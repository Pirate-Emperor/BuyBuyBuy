import express, { NextFunction, Request, Response } from "express";
import verifyLoggedIn from "../3-middleware/verify-logged-in";
import { OrderModel } from "../4-models/order-model";
import ordersLogic from "../5-logic/orders-logic";

const router = express.Router();

//* GET http://localhost:3001/api/orders/
router.get("/orders", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const orders = await ordersLogic.getAllOrders();
        response.json(orders);
    } catch (err: any) {
        next(err);
    }
});

//* POST http://localhost:3001/api/orders/
router.post("/orders", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const order = new OrderModel(request.body);
        order.creditCard4Digits = order.creditCard.toString().slice(-4).padStart(order.creditCard.toString().length, '*');
        const addedOrder = await ordersLogic.addOrder(order);
        response.status(201).json(addedOrder);
    } catch (err: any) {
        next(err);
    }
});

//* GET http://localhost:3001/api/orders/count
router.get("/orders/count", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const count = await ordersLogic.countOrders();
        response.json(count);
    } catch (err: any) {
        next(err);
    }
});

export default router;