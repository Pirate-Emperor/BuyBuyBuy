import mongoose from "mongoose";
import { UploadedFile } from "express-fileupload";
import { CategoryModel } from "./category-model";

//* Interface:
export interface IProductModel extends mongoose.Document {
    productName: string;
    price: number;
    imageName: string;
    image: UploadedFile;
    categoryId: mongoose.Schema.Types.ObjectId;
}

//* Schema:
export const ProductSchema = new mongoose.Schema<IProductModel>({
    productName: {
        type: String,
        required: [true, "Missing name"],
        minlength: [2, "Name too short"],
        maxlength: [100, "Name too long"],
        trim: true,
        unique: true
    },
    price: {
        type: Number,
        required: [true, "Missing price"],
        min: [0, "Price can't be negative"],
        max: [1000, "Price can't exceed 1000"]
    },
    imageName: String,
    image: Object,
    categoryId: mongoose.Schema.Types.ObjectId
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
});

ProductSchema.virtual("category", {
    ref: CategoryModel,
    localField: "categoryId",
    foreignField: "_id",
    justOne: true
})

//* Model:
export const ProductModel = mongoose.model<IProductModel>("ProductModel", ProductSchema, "products");