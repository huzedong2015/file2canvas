# picture2canvas

![npm](https://img.shields.io/npm/dm/picture2canvas)
![GitHub file size in bytes](https://img.shields.io/github/size/huzedong2015/picture2canvas/dist/picture2canvas.js)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/huzedong2015/picture2canvas/core-js)
![GitHub package.json version](https://img.shields.io/github/package-json/v/huzedong2015/picture2canvas)
### Installing
    $ npm install picture2canvas

### Browser compatibility
The library should work fine on the following browsers (with Promise polyfill):

- Google Chrome
- IE10 +
- Safari 8+

### Usage
```javascript
import picture2canvas from "picture2canvas";

picture2canvas(file, maxSize, width)
    .then((canvas) => {
        // code
    })
    .catch((error) => {
        // code
    });
```
### Browser
```html
<script src="dist/picture2canvas.js"></script>
<script>
    picture2canvas(file, maxSize, width)
        .then((canvas) => {
            // code
        })
        .catch((error) => {
            // code
        });
</script>
```
### Config
| Param | Type | Default | require | Description|
| - | :- | :- | :- | :- |
| file | File | `--` | true | input choose file |
| maxSize | Number | `0` | false | file maxSize |
| width | Number | `--` | false | output canvas width |
