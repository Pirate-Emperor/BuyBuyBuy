import { createStore } from "redux";
import { ProductModel } from "../models/product.model";

//* Products State - products data needed in the application level: 
export class ProductsState {
    public products: ProductModel[] = [];
    public searchText: string = '';
}

//* Products Action Type - any action which can be done on the above products state:
export enum ProductsActionType {
    FetchProducts = "FetchProducts",
    AddProduct = "AddProduct",
    UpdateProduct = "UpdateProduct",
    searchText = "searchText"
}

//* Products Action - any single object sent to the store during 'dispatch':
export interface ProductsAction {
    type: ProductsActionType;
    payload?: any;
}

//* Products Reducer - the main function performing any action on products state:
export function productsReducer(currentState = new ProductsState(), action: ProductsAction): ProductsState {
    const newState = { ...currentState };

    switch (action.type) {
        case ProductsActionType.FetchProducts:
            newState.products = action.payload;
            break;

        case ProductsActionType.AddProduct:
            newState.products.push(action.payload);
            break;

        case ProductsActionType.UpdateProduct:
            const indexToUpdate = newState.products.findIndex(p => p._id === action.payload._id)
            if (indexToUpdate >= 0) {
                newState.products[indexToUpdate] = action.payload;
            }
            break;

        case ProductsActionType.searchText:
            newState.searchText = action.payload;
            break;
    }

    return newState;
}

export const productsStore = createStore(productsReducer);