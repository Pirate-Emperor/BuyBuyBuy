import { CategoryModel } from "./category.model";

export class ProductModel {
    _id: string;
    productName: string;
    price: number;
    imageName: string;
    image: File;
    categoryId: string;
    category: CategoryModel;
};