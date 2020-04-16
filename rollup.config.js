import { name } from "./package.json";
import typescript from "@rollup/plugin-typescript";

export default {
	input: "src/index.ts",
	output: [
		{
			file: `dist/${name}.esm.js`,
			format: "es",
			plugins: [typescript()],
		},
	],
};
