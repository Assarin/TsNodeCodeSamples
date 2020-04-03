const path = require("path");

const env = process.env.NODE_ENV === "production" ? "production" : "development";
const entryFile = process.env.FILE_ENTRY || "./src/index.ts";

console.log(`Starting webpack for env=${env} with file entry=${entryFile}`);

module.exports = {
  mode: env,
  entry: entryFile,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: [
      "node_modules"
    ]
  },
  target: "node",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist/"),
    libraryTarget: "commonjs2",
    library: "umd"
  },
  plugins: []
};
