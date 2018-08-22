const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: __dirname,
  entry: "./src/index.js",
  output: {
    path: __dirname + "/docs",
    filename: "index.js"
  },
  resolve: {
    modules: ["node_modules", "output", "src"],
    extensions: [".js"],
    alias: {
      "../Halogen.Component/index.js": "Halogen.Component.patch.js"
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      filename: "index.html",
      minify: {
        collapseWhitespace: true
      }
    })
  ]
};
