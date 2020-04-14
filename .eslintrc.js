module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: [
		"airbnb-base",
	],
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly",
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
	},
	plugins: [
		"@typescript-eslint",
	],
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "error" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",

		// 空格缩进
		"indent": ["error", "tab", { "SwitchCase": 1 }],

		// 不使用tab
		"no-tabs": "off",

		// 双引号
		"quotes": ["error", "double"],

		// import 排序
		"import/order": "off",

		// 强制使用 Windows 换行符
		"linebreak-style": "off",

		// 使用圆括号将参数括起来。
		"arrow-parens": ["error", "always"],

		// for in 循环使用if 
		"guard-for-in": "off",

		// 不使用new
		"no-new": "off",

		// 最大长度
		"max-len": "off"
	},
};
