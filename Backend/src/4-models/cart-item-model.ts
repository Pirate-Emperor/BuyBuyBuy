import mongoose from "mongoose";
import { CartModel } from "./cart-model";
import { ProductModel } from "./product-model";

//* Interface:
export interface ICartItemModel extends mongoose.Document {
    quantity: number;
    total: number;
    productId: mongoose.Schema.Types.ObjectId;
    cartId: mongoose.Schema.Types.ObjectId;
}

//* Schema:
export const CartItemSchema = new mongoose.Schema<ICartItemModel>({
    quantity: {
        type: Number,
        required: [true, "Missing quantity"],
        min: [0, "Quantity can't be negative"],
        max: [100, "Quantity can't exceed 100"]
    },
    total: {
        type: Number,
        min: [0, "Total can't be negative"]
    },
    productId: mongoose.Schema.Types.ObjectId,
    cartId: mongoose.Schema.Types.ObjectId
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
});

CartItemSchema.virtual('product', {
    ref: ProductModel,
    localField: "productId",
    foreignField: "_id",
    justOne: true
});

CartItemSchema.virtual('cart', {
    ref: CartModel,
    localField: "cartId",
    foreignField: "_id",
    justOne: true
});

//* Model:
export const CartItemModel = mongoose.model<ICartItemModel>("CartItemModel", CartItemSchema, "cart-items");