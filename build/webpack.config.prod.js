const webpackConfigCommon = require("./webpack.config.common");

module.exports = {
	output: {
		filename: `${process.env.npm_package_name}.js`,
	},

	...webpackConfigCommon,
};
