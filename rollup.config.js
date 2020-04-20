import { name } from "./package.json";
import typescript from "@rollup/plugin-typescript";

export default {
	input: "src/index.ts",
	plugins: [typescript()],
	output: [
		{
			file: `dist/${name}.js`,
			format: "es",
		},
	],
};
