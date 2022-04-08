import express, { NextFunction, Request, Response } from "express";
import path from 'path';
import locations from "../2-utils/locations";
import fs from "fs";

const router = express.Router()

//* GET http://localhost:3001/shopping/images/:imageName
router.get('/shopping/images/:imageName', async (request: Request, response: Response, next: NextFunction) => {
    try {
        const imageName = request.params.imageName;

        let imageFile = locations.getProductImageFile(imageName);
        if (!fs.existsSync(imageFile)) imageFile = locations.notFoundImageFile;

        response.sendFile(imageFile);
    } catch (err: any) {
        next(err)
    }
})

export default router 