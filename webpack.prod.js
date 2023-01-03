const path = require("path");
const Dotenv = require("webpack-dotenv-plugin");

module.exports = {
    mode: "production",
    entry: ["./src/index.js"],
    devtool: "source-map",
    devServer: {
        contentBase: "./",
        writeToDisk: true,
    },
    plugins: [new Dotenv()],
    module: {
        rules: [{
            test: /\.(png|jpe?g|jpg)$/i,
            loader: "file-loader",
            options: {
                name: "[path][name].[ext]",
                outputPath: "./assets",
            },
        }, ],
    },
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, ""),
    },
};