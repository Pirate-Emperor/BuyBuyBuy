import express, { NextFunction, Request, Response } from "express";
import verifyLoggedIn from "../3-middleware/verify-logged-in";
import { CartItemModel } from "../4-models/cart-item-model";
import cartItemsLogic from "../5-logic/cart-items-logic";

const router = express.Router();

//* GET http://localhost:3001/api/items-by-cart/:cartId
router.get("/items-by-cart/:cartId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const cartId = request.params.cartId;
        const items = await cartItemsLogic.getAllItemsByCart(cartId);
        response.json(items);
    } catch (err: any) {
        next(err);
    }
});

//* POST http://localhost:3001/api/items/:userId
router.post("/items/:userId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.params.userId;
        const item = new CartItemModel(request.body);

        const addedItem = await cartItemsLogic.addItemToCart(item, userId);
        response.status(201).json(addedItem);
    } catch (err: any) {
        next(err);
    }
});

//* DELETE http://localhost:3001/api/items/:productId/:cartId
router.delete("/items/:productId/:cartId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const productId = request.params.productId;
        const cartId = request.params.cartId;
        await cartItemsLogic.deleteItem(productId, cartId);
        response.sendStatus(204);
    } catch (err: any) {
        next(err);
    }
});

//* DELETE http://localhost:3001/api/items/:cartId
router.delete("/items/:cartId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const cartId = request.params.cartId;
        await cartItemsLogic.deleteAllItemsByCart(cartId);
        response.sendStatus(204);
    } catch (err: any) {
        next(err);
    }
});

export default router;