const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = { 
  //This property defines where the application starts
  entry: "./src/index.js",
  // devtool: "eval-inline-source-map",

  //This property defines the file path and the file name which will be used for deploying the bundled file
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "bundle.js",
    publicPath: '/100058-DowellEditor-V2/'
  },

  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  //Setup loaders
  module: {
    rules: [
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.(png|jpg)$/,
        use: {
          loader: 'url-loader',
        },
      },
    ],
  },

  devtool : 'inline-source-map',

  // Setup plugin to use a HTML file for serving bundled js files
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      favicon: "./public/favicon.ico",
    }),
  ],
};
