import hash from "../2-utils/cyber";
import { ValidationError } from "../4-models/client-errors";
import { IOrderModel, OrderModel } from "../4-models/order-model";
import cartsLogic from "./carts-logic";

//* Adding a new order:
async function addOrder(order: IOrderModel): Promise<IOrderModel> {
    const errors = order.validateSync();
    if (errors) throw new ValidationError(errors.message);

    order.creditCard = hash(order.creditCard);

    await cartsLogic.closeCart(order.cartId.toString());

    //* Add an order:
    return order.save();
};

//* Get all orders:
async function getAllOrders(): Promise<IOrderModel[]> {
    return OrderModel.find().populate("cart").populate("user").exec();
};

//* Count the number of orders:
async function countOrders(): Promise<number> {
    return OrderModel.find().count().exec();
};

export default {
    addOrder,
    getAllOrders,
    countOrders
}