# file2canvas

![npm](https://img.shields.io/npm/dt/file2canvas)
![GitHub file size in bytes](https://img.shields.io/github/size/huzedong2015/file2canvas/dist/file2canvas.js)
![GitHub package.json version](https://img.shields.io/github/package-json/v/huzedong2015/file2canvas)

Image compression, correct image rotation angle.

## Installing
$ npm install file2canvas


## Usage
```javascript
file2canvas(file, options)
    .then((canvas) => {
        // code
    })
    .catch((errorType) => {
        // code
    });
```

## Params
### file 
input choose file

### options 
| Param | Type | Default | require | Description|
| - | :- | :- | :- | :- |
| maxSize | Number | `0` | false | file maxSize |
| width | Number | `--` | false | output canvas width |
| background | String | `transparent` | false | canvas background |

### ErrorType 
| code | des  |
| - | :- |
| 100 | File does not exist or format is wrong |
| 101 | The file size exceeds the specified size |

