import { timeStamp } from "console";
import mongoose from "mongoose";
import { UserModel } from "./user-model";

//* Interface:
export interface ICartModel extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId;
    isClosed: boolean;
}

//* Schema:
export const CartSchema = new mongoose.Schema<ICartModel>({
    userId: mongoose.Schema.Types.ObjectId,
    isClosed: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false,
    timestamps: true
});

CartSchema.virtual('user', {
    ref: UserModel,
    localField: "userId",
    foreignField: "_id",
    justOne: true
});

//* Model:
export const CartModel = mongoose.model<ICartModel>("CartModel", CartSchema, "carts");