import multer from "multer"
import path from "path"
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import { TCloudinaryResponse, TFile } from "../app/interfaces/file";
import config from "../config";

cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_cloud_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret
});

// multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

// cloudinary
const uploadToCloudinary = async (file: TFile): Promise<TCloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path,
            (error: Error, result: TCloudinaryResponse) => {
                fs.unlinkSync(file.path)
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                }
            }
        );
    })
}

export const fileUploader = {
    upload,
    uploadToCloudinary
}