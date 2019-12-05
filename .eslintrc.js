module.exports = {
	root: true,
	env: {
		node: true,
		es6: true,
		browser: true,
	},
	extends: [
		"eslint-config-airbnb-base",
	],
	rules: {
		// 空格缩进
		"indent": ["error", "tab"],

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

		// 最大行长度
		"max-len": "off",

		// 不使用new
		"no-new": "off"
	}
};
