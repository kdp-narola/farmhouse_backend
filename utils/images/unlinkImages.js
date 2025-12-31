const createHttpError = require("http-errors");
const path = require('path');
const fs = require('fs');
async function unlinkImages(imageArray) {
    if (!imageArray || !imageArray.length) throw new createHttpError[400]('Image not provided.');
    try {
        for (let images = 0; images < imageArray.length; images++) {
            const element = imageArray[images];

            const filePath = path.resolve('public', element);

            const removeFile = await new Promise((resolve, reject) => {
                fs.unlink(filePath, (err) => {
                    if (err) reject(false);
                    resolve(true);
                })
            });
            if (!removeFile) throw new createHttpError[403]('Image not Updated.');
        }
    } catch (error) {
        console.log('error :>> ', "Images not Removed..");
    }

}


module.exports = unlinkImages;