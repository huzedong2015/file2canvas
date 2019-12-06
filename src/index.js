import imageCompress from "../index";

const input = document.createElement("input");

input.type = "file";
input.accept = "image/*";

document.body.appendChild(input);

input.addEventListener("change", (e) => {
	imageCompress(e.target.files[0], 0, 600)
		.then((canvas) => {
			document.body.appendChild(canvas);
		});
});
