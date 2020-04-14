/**
 * 检测文件是否有效
 * @param file 文件
 * @param maxSize 允许文件最大值
 */
function checkFile(file: File, maxSize?: number): number {
	// 100: "File does not exist or format is wrong",
	// 101: "The file size exceeds the specified size",

	let errorType: number = null;

	// 文件存在同时为
	if (!(file && file instanceof File)) {
		errorType = 100;
	} else if (typeof maxSize === "number" && maxSize > 0 && file.size > maxSize) {
		errorType = 101;
	}

	return errorType;
}

/**
 * 获取JPEG方向
 * @param file 图片文件
 */
function getOrientation(buffer: ArrayBuffer): number {
	const dataView = new DataView(buffer);

	// 位置
	let index: number = 0;
	// 方向
	let result: number = 1;
	// 长度
	let dataViewLength: number = dataView.byteLength;

	// 检测是否为有效JPEG
	if (buffer.byteLength < 2 || dataView.getUint16(index) !== 0xFFD8) {
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
 * 文件转图片
 * @param file 文件
 */
function file2Image(file: File): Promise<HTMLImageElement> {
	return new Promise((reslove, reject) => {
		const url = URL.createObjectURL(file);
		const image = new Image();

		image.onload = reslove.bind(null, image);
		image.onerror = reject.bind(null);

		image.src = url;
	});
}


/**
 * 获取输出参数
 * @param file 文件
 * @param image 图片
 * @param width 图片宽度
 */
interface getOutSizeParamsReturn {
	outputWidth: number,
	outputHeight: number,
	angle: number,
}

function getOutSizeParams(
	file: File,
	image: HTMLImageElement,
	width: number,
): Promise<getOutSizeParamsReturn> {
	return new Promise((reslove) => {
		// 输出宽度
		let outputWidth: number = width > 0 ? width : image.naturalWidth;
		// 输出高度
		let outputHeight: number = Math.floor(outputWidth * (image.naturalHeight / image.naturalWidth));
		// 图片旋转角度
		let angle: number = 0;

		const fr = new FileReader();

		fr.onload = (e) => {
			const arrayBuffer = e.target.result;
			let orientation: number = 1;

			if (arrayBuffer instanceof ArrayBuffer) {
				orientation = getOrientation(arrayBuffer);
			}

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
			const result: getOutSizeParamsReturn = {
				outputWidth,
				outputHeight,
				angle,
			};

			reslove(result);
		};

		fr.readAsArrayBuffer(file);
	});
}

/**
 * 创建canvas
 * @param width canvs宽度
 * @param height canvs高度
 * @param image 图片
 * @param angle 图片旋转角度
 */
interface createCanvasInterface {
	width: number,
	height: number,
	image: HTMLImageElement,
	angle: number,
	background?: string
}
const createCanvas = (
	{
		width,
		height,
		image,
		angle,
		background,
	}: createCanvasInterface,
) => {
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
 * 二进制转换成canvas
 * @param file 文件
 */
interface file2canvasInterface {
	// 宽度
	width?: number,
	// 文件大小上限
	maxSize?: number,
	// 背景
	background: string,
}
function file2canvas(
	// 文件
	file: File,
	{
		width = 0,
		maxSize = 0,
		background = "transparent",
	}: file2canvasInterface,
): Promise<number | HTMLCanvasElement> {
	return new Promise((reslove, reject) => {
		const errorType: number = checkFile(file, maxSize);

		// 如果文件非法
		if (errorType) {
			reject(errorType);
		}

		let image: HTMLImageElement = null;

		// 二进制数据转Image
		file2Image(file)
			.then((img) => {
				image = img;
				return getOutSizeParams(file, img, width);
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
}


// 外部接口
const win: any = window;

win.file2canvas = file2canvas;

export default file2canvas;
