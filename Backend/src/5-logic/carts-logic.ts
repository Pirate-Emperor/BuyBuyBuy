import { CartModel, ICartModel } from "../4-models/cart-model";
import { ValidationError } from "../4-models/client-errors";

//* Get the open cart by userId:
async function getCartByUser(userId: string, isClosed: boolean): Promise<ICartModel> {
    const carts = await CartModel.find({ userId, isClosed }).populate("user").exec();
    if (carts.length === 0) return null;
    return carts[0];
};

//* Add new Cart: for cart-items-logic:
async function addCart(cart: ICartModel): Promise<ICartModel> {
    //* Validation:
    const errors = cart.validateSync();
    if (errors) throw new ValidationError(errors.message);

    return cart.save();
};

//* Close the cart after making an order: for orders-logic:
async function closeCart(_id: string): Promise<ICartModel> {
    await CartModel.updateOne({ _id }, { $set: { isClosed: true } }).exec();

    const cart = await CartModel.findOne({ _id }).exec();

    return cart;
};

export default {
    getCartByUser,
    addCart,
    closeCart
}