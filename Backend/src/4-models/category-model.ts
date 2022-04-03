import mongoose from "mongoose";

//* Interface:
export interface ICategoryModel extends mongoose.Document {
    categoryName: string;
}

//* Schema:
export const CategorySchema = new mongoose.Schema<ICategoryModel>({
    categoryName: {
        type: String,
        required: [true, "Missing category name"],
        minlength: [2, "Category name too short"],
        maxlength: [100, "Category name too long"],
        trim: true,
        unique: true
    }
}, {
    versionKey: false
});

//* Model:
export const CategoryModel = mongoose.model<ICategoryModel>("CategoryModel", CategorySchema, "categories");