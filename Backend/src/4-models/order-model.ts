import mongoose from "mongoose";
import { CartModel } from "./cart-model";
import CityEnum from "./city-enum";
import { UserModel } from "./user-model";

//* Interface:
export interface IOrderModel extends mongoose.Document {
    finalPrice: number;
    deliveryCity: CityEnum;
    deliveryStreet: string;
    deliveryDate: Date;
    creditCard: string;
    creditCard4Digits: string;
    userId: mongoose.Schema.Types.ObjectId;
    cartId: mongoose.Schema.Types.ObjectId;
}

//* Schema:
export const OrderSchema = new mongoose.Schema<IOrderModel>({
    finalPrice: {
        type: Number,
        min: [0, "Final price can't be negative"],
        max: [10000, "Final price can't exceed 10,000"]
    },
    deliveryCity: {
        type: String,
        required: [true, "Missing delivery city"],
        minlength: [2, "Delivery city too short"],
        maxlength: [50, "Delivery city too long"],
        enum: CityEnum
    },
    deliveryStreet: {
        type: String,
        required: [true, "Missing delivery street"],
        minlength: [2, "Delivery street too short"],
        maxlength: [100, "Delivery street too long"],
        trim: true
    },
    deliveryDate: {
        type: Date,
        required: [true, "Missing delivery date"]
    },
    creditCard: {
        type: String,
        required: [true, "Missing credit card"],
        trim: true
    },
    creditCard4Digits: {
        type: String,
        trim: true
    },
    userId: mongoose.Schema.Types.ObjectId,
    cartId: mongoose.Schema.Types.ObjectId
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false,
    timestamps: true
});

OrderSchema.virtual("user", {
    ref: UserModel,
    localField: "userId",
    foreignField: "_id",
    justOne: true
});

OrderSchema.virtual("cart", {
    ref: CartModel,
    localField: "cartId",
    foreignField: "_id",
    justOne: true
});

//* Model:
export const OrderModel = mongoose.model<IOrderModel>("OrderModel", OrderSchema, "orders");