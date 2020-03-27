/**
 * 获取JPEG方向
 * @param {File} file 图片文件
 * @return {Number}
 */
function getOrientation(buffer) {
	const dataView = new DataView(buffer);

	// 位置
	let index = 0;
	// 方向
	let result = 1;
	// 长度
	let dataViewLength = dataView.byteLength;

	// 检测是否为有效JPEG
	if (buffer.length < 2 || dataView.getUint16(index) !== 0xFFD8) {
		return result;
	}

	// 遍历文件内容，找到 APP1, 即 EXIF 所在的标识
	while (index < dataViewLength) {
		const uint16 = dataView.getUint16(index);

		switch (uint16) {
			case 0xFFE1:
				// 获取EXIF大小
				dataViewLength = dataView.getUint16(index);
				break;

			// 获取方向(Orientation)，并结束循环
			case 0x0112:
				result = dataView.getUint16(index + 8);
				dataViewLength = 0;
				break;
			default:
				break;
		}

		index += 2;
	}

	return result;
}

/**
 * 判断文件是否合法
 * @param {File} file 文件
 * @param {Number} maxSize 文件大小
 */
const checkFile = (file, maxSize) => {
	// 100: "File does not exist or format is wrong",
	// 101: "The file size exceeds the specified size",

	let errorType = "";

	// 文件存在同时为
	if (!(file && file instanceof File)) {
		errorType = 100;
	} else if (maxSize > 0 && file.size > maxSize) {
		errorType = 101;
	}

	return errorType;
};


/**
 * 文件转换成图片
 * @param {File} file 文件
 */
const file2image = (file) => new Promise((reslove) => {
	const url = URL.createObjectURL(file);
	const image = new Image();

	image.onload = reslove.bind(null, image);

	image.src = url;
});


/**
 * 获取输出尺寸
 * @param {Image} image 图片
 * @param {File} file 图片文件数据
 * @param {Number} width 输出尺寸
 */
const getOutSizeParams = (image, file, width) => new Promise((reslove) => {
	// 输出宽度
	let outputWidth = width > 0 ? width : image.naturalWidth;
	// 输出高度
	let outputHeight = Math.floor(outputWidth * (image.naturalHeight / image.naturalWidth));
	// 图片旋转角度
	let angle = 0;

	const fr = new FileReader();

	fr.onload = (e) => {
		const orientation = getOrientation(e.target.result);

		switch (orientation) {
			// 顺时针旋转180度
			case 3:
				angle = 180;
				break;

			// 逆时针旋转90度
			case 6:
				[outputWidth, outputHeight] = [outputHeight, outputWidth];
				angle = 90;
				break;

			// 顺时针旋转90度
			case 8:
				[outputWidth, outputHeight] = [outputHeight, outputWidth];
				angle = -90;
				break;

			default:
				angle = 0;
		}

		// 数据
		const result = {
			outputWidth,
			outputHeight,
			angle,
		};

		reslove(result);
	};

	fr.readAsArrayBuffer(file);
});


/**
 * 创建canvas
 * @param {Number} width canvs宽度
 * @param {Number} height canvs高度
 * @param {Image} image 图片
 * @param {Number} angle 图片旋转角度
 */
const createCanvas = ({
	width, height, image, angle, background,
}) => {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	// 设置背景颜色
	ctx.fillStyle = background;
	ctx.fillRect(0, 0, width, height);

	switch (angle) {
		case 90:
		case -90:
			ctx.translate(width / 2, height / 2);
			ctx.rotate(angle * (Math.PI / 180));
			ctx.drawImage(image, -height / 2, -width / 2, height, width);
			break;

		case 180:
			ctx.translate(width / 2, height / 2);
			ctx.rotate(angle * (Math.PI / 180));
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
	const errorType = checkFile(file, maxSize);

	// 如果有错误
	if (errorType) {
		reject(errorType);
		return;
	}

	let image = "";

	// 二进制数据转Image
	file2image(file)
		.then((img) => {
			image = img;
			return getOutSizeParams(img, file, width);
		})
		.then(({ outputWidth, outputHeight, angle }) => {
			// 创建canvas
			const canvas = createCanvas({
				width: outputWidth,
				height: outputHeight,
				image,
				angle,
				background,
			});

			reslove(canvas);
		})
		.catch(reject);
});


// 外部接口
window.picture2canvas = picture2canvas;

export default picture2canvas;
