/**
 * 检测文件是否有效
 * @param file 文件
 * @param maxSize 允许文件最大值
 */
function checkFile(file, maxSize) {
    // 100: "File does not exist or format is wrong",
    // 101: "The file size exceeds the specified size",
    let errorType = 0;
    // 文件存在同时为
    if (!(file && file instanceof File)) {
        errorType = 100;
    }
    else if (typeof maxSize === "number"
        && maxSize > 0
        && file.size > maxSize) {
        errorType = 101;
    }
    return errorType;
}
/**
 * 获取JPEG方向
 * @param file 图片文件
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
        }
        index += 2;
    }
    return result;
}
/**
 * 文件转图片
 * @param file 文件
 */
function file2Image(file) {
    return new Promise((reslove) => {
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
            URL.revokeObjectURL(url);
            reslove(image);
        };
        image.src = url;
    });
}
function getOutSizeParams(file, image, width) {
    return new Promise((reslove) => {
        // 输出宽度
        let outputWidth = width > 0 ? width : image.naturalWidth;
        // 输出高度
        let outputHeight = Math.floor(outputWidth * (image.naturalHeight / image.naturalWidth));
        // 图片旋转角度
        let angle = 0;
        const fr = new FileReader();
        fr.onload = (e) => {
            const { target } = e;
            let orientation = 1;
            if (target && target.result instanceof ArrayBuffer) {
                orientation = getOrientation(target.result);
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
            const result = {
                outputWidth,
                outputHeight,
                angle,
            };
            reslove(result);
        };
        fr.readAsArrayBuffer(file);
    });
}
const createCanvas = ({ width, height, image, angle, background = "", }) => {
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
function file2canvas(
// 文件
file, { width = 0, maxSize = 0, background = "transparent", }) {
    return new Promise((reslove, reject) => {
        const errorType = checkFile(file, maxSize);
        // 如果文件非法
        if (errorType) {
            reject(errorType);
        }
        let image = new Image();
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

export default file2canvas;
