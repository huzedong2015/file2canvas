const HtmlWebpackPlugin = require("html-webpack-plugin");
const packageJson = require("./package.json");

module.exports = {
	output: {
		filename: `${packageJson.name}.js`,
	},

	devServer: {
		port: "8080",
		host: "0.0.0.0",
	},

	plugins: [
		// html模板
		new HtmlWebpackPlugin({ template: "./public/index.html" }),
	],

	stats: "errors-only",
};
