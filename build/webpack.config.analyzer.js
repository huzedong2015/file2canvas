const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const webpackConfigProd = require("./webpack.config.prod");

module.exports = {
	plugins: [
		new BundleAnalyzerPlugin(),
	],

	...webpackConfigProd,
};
