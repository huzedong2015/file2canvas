# picture2canvas

![npm](https://img.shields.io/npm/dt/picture2canvas)
![GitHub file size in bytes](https://img.shields.io/github/size/huzedong2015/picture2canvas/dist/picture2canvas.js)
![GitHub package.json version](https://img.shields.io/github/package-json/v/huzedong2015/picture2canvas)

> Later, I will try to write an EXIF JS that only gets the angle

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

picture2canvas(file, options)
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
    picture2canvas(file, options)
        .then((canvas) => {
            // code
        })
        .catch((error) => {
            // code
        });
</script>
```
### params
#### file 
input choose file

#### options 
| Param | Type | Default | require | Description|
| - | :- | :- | :- | :- |
| maxSize | Number | `0` | false | file maxSize |
| width | Number | `--` | false | output canvas width |
| background | String | `transparent` | false | canvas background |
