# picture2canvas


## Installing
```
npm install image-compress
```

## Browser compatibility
The library should work fine on the following browsers (with Promise polyfill):

 - Google Chrome
- IE10 +
- Safari 8+

## Usage
### Webpack
```javascript
import picture2canvas from "image-compress";

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
## Config
| Param | Type | Default | require | Description|
| - | :- | :- | :- | :- |
| file | File | `null` | true | input choose file |
| maxSize | Number | `0` | false | file maxSize |
| width | Number | `--` | false | output canvas width |
