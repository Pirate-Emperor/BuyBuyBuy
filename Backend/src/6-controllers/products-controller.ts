import express, { NextFunction, Request, Response } from "express";
import verifyAdmin from "../3-middleware/verify-admin";
import verifyLoggedIn from "../3-middleware/verify-logged-in";
import { ProductModel } from "../4-models/product-model";
import productsLogic from "../5-logic/products-logic";

const router = express.Router();

//* GET http://localhost:3001/api/categories
router.get("/categories", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const categories = await productsLogic.getAllCategories();
        response.json(categories);
    } catch (err: any) {
        next(err);
    }
});

//* GET http://localhost:3001/api/products
router.get("/products", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const products = await productsLogic.getAllProducts();
        response.json(products);
    } catch (err: any) {
        next(err);
    }
});

//* GET http://localhost:3001/api/products/count
router.get("/products/count", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const count = await productsLogic.countProducts();
        response.json(count);
    } catch (err: any) {
        next(err);
    }
});

//* GET http://localhost:3001/api/products/:_id
router.get("/products/:_id", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        const product = await productsLogic.getOneProduct(_id);
        response.json(product);
    } catch (err: any) {
        next(err);
    }
});

//* POST http://localhost:3001/api/products
router.post("/products", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.image = request.files?.image;
        const product = new ProductModel(request.body);
        const addedProduct = await productsLogic.addProduct(product);
        response.status(201).json(addedProduct);
    } catch (err: any) {
        next(err);
    }
});

//* PUT http://localhost:3001/api/products/:_id
router.put("/products/:_id", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.image = request.files?.image;
        const _id = request.params._id;
        request.body._id = _id;
        const product = new ProductModel(request.body);
        const updatedProduct = await productsLogic.updateProduct(product);
        response.json(updatedProduct);
    } catch (err: any) {
        next(err);
    }
});

export default router;