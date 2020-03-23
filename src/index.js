import Main from "Main";

if (process.env.NODE_ENV !== "production") {
  require("Main").main();

  if (module.hot) {
    module.hot.accept("Main", function() {
      document.body.innerHTML = "";
      require("Main").main();
    });
  }
}
