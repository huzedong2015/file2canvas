const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackConfigCommon = require("./webpack.config.common");

module.exports = {
	mode: "development",

	devServer: {
		port: "8080",
		host: "0.0.0.0",
		hot: true,
	},

	plugins: [
		// html模板
		new HtmlWebpackPlugin({ template: "./public/index.html" }),
	],

	...webpackConfigCommon,
};
