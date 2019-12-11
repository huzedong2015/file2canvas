# 图片压缩

> 建议使用VS Code

## 安装
`npm install image-compress`

## 使用
`
    import imageCompress from "image-compress";

    imageCompress(file, maxSize, width)
        .then((canvas) => {
            // coding
        });
`
## 参数
### file(必须)
    选择文件
### maxSize(可选)
    文件大小上限,默认不限制
### width
    输出尺寸(可选),默认不限制
