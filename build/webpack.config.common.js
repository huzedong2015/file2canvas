module.exports = {

	module: {
		rules: [
			{
				test: /\.ts$/,
				use: ["babel-loader"],
			},
		],
	},

	stats: "errors-only",

	resolve: {
		extensions: [".js", ".ts", ".json"],
	},

	optimization: {
		minimize: false,
	},
};
