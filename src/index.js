import Main from "Main";

let dispose = require("Main").main();

if (module.hot) {
  module.hot.accept("Main", function() {
    /**
     * In many cases, you don't need to call dispose, the following is good enough.
     */
    // document.body.innerHTML = "";

    dispose();
    dispose = require("Main").main();
  });
}
