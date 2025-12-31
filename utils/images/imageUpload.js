const createHttpError = require("http-errors");
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

async function imageUpload(images) {
    if (!images) throw new createHttpError[400]("Images not Provided.");
    images = images?.length ? images : [images];
    const allowedFileType = ['image/jpeg', 'image/jpg', 'image/png'];
    const uploadDir = path.resolve("public", "propertyImage");

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const imageArray = await Promise.all(images.map(async (image) => {
        if (!allowedFileType.includes(image?.mimetype)) throw new createHttpError[422]('File should be in JPG, PNG or JPEG format.');

        const imageName = crypto.randomUUID() + "_" + image?.name;
        const uploadPath = path.resolve("public", "propertyImage", imageName)

        const uploadSuccess = await new Promise((resolve, reject) => {
            image.mv(uploadPath, (err) => {
                if (err) reject(false);
                resolve(true);
            });
        });

        if (!uploadSuccess) throw new createHttpError[403]("Image not saved.");

        const imagePath = 'propertyImage/' + imageName;
        return imagePath;
    }));
    return imageArray;
}

module.exports = imageUpload;
