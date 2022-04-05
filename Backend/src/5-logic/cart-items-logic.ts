import { CartItemModel, ICartItemModel } from "../4-models/cart-item-model";
import { CartModel } from "../4-models/cart-model";
import { IdNotFoundError, OneOfIdsNotFoundError, ValidationError } from "../4-models/client-errors";
import cartsLogic from "./carts-logic";

//* Get all items that in the cart by caryId:
async function getAllItemsByCart(cartId: string): Promise<ICartItemModel[]> {
    return CartItemModel.find({ cartId }).populate("cart").populate("product").exec();
};

//* Add Item to cart:
async function addItemToCart(item: ICartItemModel, userId: string): Promise<ICartItemModel> {

    //* Validation:
    const errors = item.validateSync();
    if (errors) throw new ValidationError(errors.message);

    //* If there is no cart for this user:
    if (!item.cartId) {
        //^ Add new cart to the userId:
        const newCart = await cartsLogic.addCart(new CartModel({ userId, isClosed: false }));

        //^ Update the cartId:
        item.cartId = newCart._id;

        //^ Add new item to the cart:
        return item.save();
    };

    //* If there is existing cart:
    if (item.cartId) {
        //^ Find if the item is in the cart and update him:
        await CartItemModel.updateOne({ cartId: item.cartId, productId: item.productId }, { $set: { quantity: item.quantity, total: item.total } }).exec();

        //^ Add item that doesn't exist in cart:
        let found = await CartItemModel.findOne({ cartId: item.cartId, productId: item.productId }).exec();

        if (!found) {
            return item.save();
        } else {
            return found;
        };
    };
};

//* Delete item from cart:
async function deleteItem(productId: string, cartId: string): Promise<void> {
    const deletedItem = await CartItemModel.deleteOne({ productId, cartId }).exec();
    if (!deletedItem) throw new OneOfIdsNotFoundError(productId, cartId);
};

//* Delete all the Items from the cart:
async function deleteAllItemsByCart(cartId: string): Promise<void> {
    const deletedCartItems = await CartItemModel.deleteMany({ cartId });
    if (!deletedCartItems) throw new IdNotFoundError(cartId);
};

export default {
    getAllItemsByCart,
    addItemToCart,
    deleteItem,
    deleteAllItemsByCart
}