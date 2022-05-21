import { createStore } from "redux";
import { CartItemModel } from "../models/cart-item.model";
import { CartModel } from "../models/cart.model";

//* Carts State - carts data needed in the application level:
export class CartsState {
    public currentCart: CartModel;
    public cartItems: CartItemModel[] = [];
}

//* Carts Action Type - any action which can be done on the above carts state:
export enum CartsActionType {
    FetchCartsItems = "FetchCartsItems",
    DeleteItemFromCart = "DeleteItemFromCart", // Delete one item!
    DeleteAllItemsFromCart = "DeleteAllItemsFromCart", // Delete all the items in cart!
    GetActiveCart = "GetActiveCart"
}

//* Carts Action - any single object sent to the store during 'dispatch':
export interface CartsAction {
    type: CartsActionType;
    payload?: any;
}

//* Carts Reducer - the main function performing any action on carts state:
export function cartsReducer(currentState = new CartsState(), action: CartsAction): CartsState {
    const newState = { ...currentState };

    switch (action.type) {
        case CartsActionType.FetchCartsItems:
            newState.cartItems = action.payload;
            break;

        case CartsActionType.DeleteItemFromCart:
            const indexToDelete = newState.cartItems.findIndex(c => c.productId === action.payload);
            if (indexToDelete >= 0) {
                newState.cartItems.splice(indexToDelete, 1);
            };
            break;

        case CartsActionType.DeleteAllItemsFromCart:
            newState.cartItems.length = 0;
            break;

        case CartsActionType.GetActiveCart:
            newState.currentCart = action.payload;
            break;
    }

    return newState;
}

export const cartsStore = createStore(cartsReducer);