const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/index.js",

	devServer: {
		port: "8080",
		host: "0.0.0.0",
	},

	plugins: [
		// html模板
		new HtmlWebpackPlugin({ template: "./public/index.html" }),

		// 热更新
		new webpack.HotModuleReplacementPlugin(),
	],

	stats: "errors-only",
};
