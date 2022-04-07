import locations from "../2-utils/locations";
import safeDelete from "../2-utils/safe-delete";
import { CategoryModel, ICategoryModel } from "../4-models/category-model";
import { IdNotFoundError, ValidationError } from "../4-models/client-errors";
import { IProductModel, ProductModel } from "../4-models/product-model";
import { v4 as uuid } from "uuid";

//* Return all the products:
async function getAllProducts(): Promise<IProductModel[]> {
    return ProductModel.find().populate("category").exec();
};

//* Count products:
async function countProducts(): Promise<number> {
    return ProductModel.find().count().exec();
};

//* Get all categories:
async function getAllCategories(): Promise<ICategoryModel[]> {
    return CategoryModel.find().exec();
};

//* Used to get old imageName for updating product:
async function getOneProduct(_id: string): Promise<IProductModel> {
    const product = await ProductModel.findById(_id).populate("category").exec();
    if (!product) throw new IdNotFoundError(_id);
    return product;
};

//* Adding new product:
async function addProduct(product: IProductModel): Promise<IProductModel> {
    //* Validation:
    const errors = product.validateSync();
    if (errors) throw new ValidationError(errors.message);

    //* Handle Image:
    if (product.image) {
        const extension = product.image.name.substring(
            product.image.name.lastIndexOf(".")
        ); // .gif / .png / .jpg / .jpeg
        product.imageName = uuid() + extension;
        await product.image.mv(locations.getProductImageFile(product.imageName)); // mv = move = copy image.
        product.image = undefined; // Delete File before saving.
    }

    return product.save();
};

//* Update exist product:
async function updateProduct(product: IProductModel): Promise<IProductModel> {
    //* Validation:
    const errors = product.validateSync();
    if (errors) throw new ValidationError(errors.message);

    //* Handle Image:
    //^ If there is no update to the image
    const productFromDataBase = await getOneProduct(product._id);
    product.imageName = productFromDataBase.imageName;

    if (product.image) {
        await safeDelete(locations.getProductImageFile(product.imageName));
        const extension = product.image.name.substring(
            product.image.name.lastIndexOf(".")
        ); // .gif / .png / .jpg / .jpeg
        product.imageName = uuid() + extension;
        await product.image.mv(locations.getProductImageFile(product.imageName)); // mv = move = copy image.
        delete product.image; // Delete File before saving.
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(product._id, product, { returnOriginal: false }).exec();
    if (!updatedProduct) throw new IdNotFoundError(product._id);
    return updatedProduct;
};

export default {
    getAllProducts,
    countProducts,
    getAllCategories,
    getOneProduct,
    addProduct,
    updateProduct
};