import path from "path";

const rootFolder = path.resolve(__dirname, "..", "..");

const productImagesFolder = path.join(rootFolder, "src", "1-assets", "images");
const notFoundImageFile = path.join(rootFolder, "src", "1-assets", "images", "not-found.jpg");

function getProductImageFile(imageName) {
    if (!imageName) return null;
    return path.join(productImagesFolder, imageName);
};

export default {
    getProductImageFile,
    notFoundImageFile
};