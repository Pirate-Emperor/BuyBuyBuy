import express, { NextFunction, Request, Response } from "express";
import verifyLoggedIn from "../3-middleware/verify-logged-in";
import cartsLogic from "../5-logic/carts-logic";

const router = express.Router();

//* GET http://localhost:3001/api/cart-by-user/:userId
router.get("/cart-by-user/:userId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.params.userId;
        const cart = await cartsLogic.getCartByUser(userId, false);
        response.json(cart);
    } catch (err: any) {
        next(err);
    }
});

export default router;