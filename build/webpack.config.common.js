module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				use: ["babel-loader", "eslint-loader"],
			},
		],
	},

	stats: "errors-only",
};
