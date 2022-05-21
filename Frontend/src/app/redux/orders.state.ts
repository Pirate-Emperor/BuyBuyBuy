import { createStore } from "redux";
import { OrderModel } from "../models/order.model";

//* Orders State - products data needed in the application level: 
export class OrdersState {
    public orders: OrderModel[] = [];
    public theLastOrder: OrderModel;
}

//* Orders Action Type - any action which can be done on the above orders state:
export enum OrdersActionType {
    FetchOrders = "FetchOrders",
    AddOrder = "AddOrder"
}

//* Orders Action - any single object sent to the store during 'dispatch':
export interface OrdersAction {
    type: OrdersActionType;
    payload?: any;
}

//* Orders Reducer - the main function performing any action on orders state:
export function ordersReducer(currentState = new OrdersState(), action: OrdersAction): OrdersState {
    const newState = { ...currentState };

    switch (action.type) {
        case OrdersActionType.FetchOrders:
            newState.orders = action.payload;
            break;

        case OrdersActionType.AddOrder:
            newState.theLastOrder = action.payload;
            newState.orders.push(action.payload);
            break;
    }

    return newState;
}

export const ordersStore = createStore(ordersReducer);