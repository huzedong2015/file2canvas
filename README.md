## Installing
```
npm install image-compress
```

## Usage
```
import imageCompress from "image-compress";

imageCompress(file, maxSize, width)
    .then((canvas) => {
        // code
    })
    .catch((error) => {
        // code
    });
```
## Config
Param | Type | Default | require | Description
- | :- | :- | :- | :-
file | File | `null` | true | input choose files[0]
maxSize | Number | `0` | false | file maxSize
width | Number | `--` | false | output canvas width
