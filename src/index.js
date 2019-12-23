import EXIF from "exif-js";

/**
 * 判断文件是否合法
 * @param {File} file 文件
 * @param {Number} maxSize 文件大小
 */
const checkFile = (file, maxSize) => {
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
 * 文件转换成图片
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
 * 获取输出尺寸
 * @param {Image} image 图片
 * @param {width} width 输出尺寸
 */
const getOutSize = (image, width) => {
	// 输出宽度
	let outputWidth = width > 0 ? width : image.naturalWidth;
	// 输出高度
	let outputHeight = Math.floor(outputWidth * (image.naturalHeight / image.naturalWidth));
	// 图片旋转角度
	let orientation = 0;

	// 读取图片旋转角度
	EXIF.getData(image, () => {
		orientation = EXIF.getTag(image, "Orientation") || 1;
	});

	switch (orientation) {
		// 顺时针旋转180度
		case 3:
			orientation = 180;
			break;

		// 逆时针旋转90度
		case 6:
			[outputWidth, outputHeight] = [outputHeight, outputWidth];
			orientation = 90;
			break;

		// 顺时针旋转90度
		case 8:
			[outputWidth, outputHeight] = [outputHeight, outputWidth];
			orientation = -90;
			break;

		default:
			orientation = 0;
	}

	return {
		outputWidth,
		outputHeight,
		orientation,
	};
};


/**
 * 创建canvas
 * @param {Number} width canvs宽度
 * @param {Number} height canvs高度
 * @param {Image} image 图片
 * @param {Number} orientation 图片旋转角度
 */
const createCanvas = ({
	width, height, image, orientation, background,
}) => {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	// 设置背景颜色
	ctx.fillStyle = background;
	ctx.fillRect(0, 0, width, height);

	switch (orientation) {
		case 90:
		case -90:
			ctx.translate(width / 2, height / 2);
			ctx.rotate(orientation * (Math.PI / 180));
			ctx.drawImage(image, -height / 2, -width / 2, height, width);
			break;

		case 180:
			ctx.translate(width / 2, height / 2);
			ctx.rotate(orientation * (Math.PI / 180));
			ctx.drawImage(image, -width / 2, -height / 2, width, height);
			break;

		default:
			ctx.drawImage(image, 0, 0, width, height);
	}

	return canvas;
};


/**
 * 图片压缩
 * @param {File} file 文件
 * @param {Number} maxSize 文件大小上限
 * @param {Number} width 导出canvas尺寸
 */
const picture2canvas = (
	file,
	{
		width = 0,
		maxSize = 0,
		background = "transparent",
	} = {},
) => new Promise((reslove, reject) => {
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
			const { outputWidth, outputHeight, orientation } = getOutSize(image, width);
			const canvas = createCanvas({
				width: outputWidth,
				height: outputHeight,
				image,
				orientation,
				background,
			});

			reslove(canvas);
		})
		.catch(reject);
});


// 外部接口
window.picture2canvas = picture2canvas;

export default picture2canvas;
