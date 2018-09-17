/**
 * Monkey patch `component` and `mkComponent` functions from `Halogen.Component`
 * module, so that component state persists across hot module reloading.
 */

const Data_Foldable = require("Data.Foldable/index.js");
const Data_Functor = require("Data.Functor/index.js");
const Halogen_Query_HalogenM = require("Halogen.Query.HalogenM/index.js");
const Halogen_Query_HalogenQ = require("Halogen.Query.HalogenQ/index.js");
import Component from "Halogen.Component";

export * from "Halogen.Component";

const cache = {};

const getState = id => {
  return cache[id];
};

const setState = (id, state) => {
  cache[id] = state;
};

const REGEX = /.*\((.*)\?.*/;

/**
 * stack trace looks like following, parse module file name from it.
 *
 * Error
 *   at getCallerFile (Halogen.Component.patch.js:29)
 *   at Module.component (Halogen.Component.patch.js:97)
 *   at eval (index.js:47)
 *   at eval (index.js:55)
 *   at Object../output/Example.Input/index.js (index.js:3866)
 *   at __webpack_require__ (index.js:712)
 *   at fn (index.js:95)
 *   at eval (index.js:9)
 *   at Object../output/Main/index.js (index.js:4394)
 *   at __webpack_require__ (index.js:712)
 */
function getCallerFile() {
  try {
    throw new Error();
  } catch (e) {
    const traces = e.stack.split("\n");
    const curFilename = traces[1].match(REGEX)[1];
    for (let i = 2; i < e.stack.length; i++) {
      const filename = traces[i].match(REGEX)[1];
      if (filename !== curFilename) {
        return filename;
      }
    }
  }
}

export const mkComponent = (config, cacheId) => {
  config.initialState = (...rest) => {
    return getState(cacheId) || config.initialState_(...rest);
  };

  config.render = state => {
    setState(cacheId, state);
    return config.render_(state);
  };
  return Component.mkComponent(config);
};

export function component(args) {
  // Taken from output/Halogen.Component/index.js
  const go = function(spec) {
    return {
      initialState_: spec.initialState,
      render_: spec.render,
      eval: function(v) {
        if (v instanceof Halogen_Query_HalogenQ.Initialize) {
          return Data_Functor.voidLeft(Halogen_Query_HalogenM.functorHalogenM)(
            Data_Foldable.traverse_(Halogen_Query_HalogenM.applicativeHalogenM)(
              Data_Foldable.foldableMaybe
            )(spec["eval"])(spec.initializer)
          )(v.value0);
        }
        if (v instanceof Halogen_Query_HalogenQ.Finalize) {
          return Data_Functor.voidLeft(Halogen_Query_HalogenM.functorHalogenM)(
            Data_Foldable.traverse_(Halogen_Query_HalogenM.applicativeHalogenM)(
              Data_Foldable.foldableMaybe
            )(spec["eval"])(spec.finalizer)
          )(v.value0);
        }
        if (v instanceof Halogen_Query_HalogenQ.Receive) {
          return Data_Functor.voidLeft(Halogen_Query_HalogenM.functorHalogenM)(
            Data_Foldable.traverse_(Halogen_Query_HalogenM.applicativeHalogenM)(
              Data_Foldable.foldableMaybe
            )(spec["eval"])(spec.receiver(v.value0))
          )(v.value1);
        }
        if (v instanceof Halogen_Query_HalogenQ.Handle) {
          return Data_Functor.voidLeft(Halogen_Query_HalogenM.functorHalogenM)(
            spec["eval"](v.value0)
          )(v.value1);
        }
        if (v instanceof Halogen_Query_HalogenQ.Request) {
          return spec["eval"](v.value0);
        }
        throw new Error(
          "Failed pattern match at Halogen.Component line 102, column 15 - line 107, column 37: " +
            [v.constructor.name]
        );
      }
    };
  };

  const cacheId = getCallerFile();
  return mkComponent(go(args), cacheId);
}
