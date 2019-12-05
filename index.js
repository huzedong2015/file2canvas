// import EXIF from "exif-js";

/**
 * 判断文件是否合法
 * @param {File} file 文件
 * @param {Number} maxSize 文件大小
 */
const checkFile = (file, maxSize = 0) => {
	let errorMsg = "";

	// 文件存在同时为
	if (!(file && file instanceof File)) {
		errorMsg = "文件不存在或格式错误";
	} else if (maxSize > 0 && file.size > maxSize) {
		let maxSizeStr = "";

		// 小于1M
		if (maxSize < 1024 * 1024) {
			maxSizeStr = `${(maxSize / 1024).toFixed(2)}KB`;
		} else {
			maxSizeStr = `${(maxSize / 1024 / 1024).toFixed()}MB`;
		}

		errorMsg = `文件不能超过${maxSizeStr}`;
	}

	return errorMsg;
};


/**
 * 图片转换成base64
 * @param {File} file 文件
 */
const file2image = (file) => new Promise((reslove) => {
	const fr = new FileReader();

	fr.onload = (e) => {
		const image = new Image();

		image.onload = () => {
			reslove(image);
		};

		image.src = e.target.result;
	};

	fr.readAsDataURL(file);
});


/**
 * 创建canvas
 * @param {Number} width canvs宽度
 * @param {Number} height canvs高度
 * @param {Image} image 图片
 */
const createCanvas = (width, height, image) => {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	ctx.drawImage(image, width, height);

	return canvas;
};


/**
 * 图片选择预览
 * @param {File} file 文件
 * @param {Number} maxSize 文件大小上限
 * @param {Number} width 导出canvas尺寸
 */
const imageCompress = (file, maxSize, width) => new Promise((reslove, reject) => {
	// 检测文件
	const errorMsg = checkFile(file, maxSize);

	// 如果有错误
	if (errorMsg) {
		reject(new Error(errorMsg));
		return;
	}

	// 图片转base64
	file2image(file)
		.then((image) => {
			// 读取图片旋转角度
			// let orientation = null;

			// EXIF.getData(this, () => {
			// 	orientation = EXIF.getTag(this, "Orientation");
			// });

			const height = Math.floor(width * (image.naturalHeight / image.naturalWidth));
			const canvas = createCanvas(width, height, image);

			reslove(canvas);
		});
});


export default imageCompress;
