import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderModel } from '../models/order.model';
import { authStore } from '../redux/auth.state';
import { OrdersAction, OrdersActionType, ordersStore } from '../redux/orders.state';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {

    constructor(private http: HttpClient) { }

    //* For login page to display number of orders:
    async getAllOrders(): Promise<OrderModel[]> {
        if (ordersStore.getState().orders.length === 0) {
            const observable = this.http.get<OrderModel[]>(environment.ordersUrl);
            const orders = await firstValueFrom(observable);

            const action: OrdersAction = { type: OrdersActionType.FetchOrders, payload: orders };
            ordersStore.dispatch(action);
        }
        return ordersStore.getState().orders;
    }

    //* Adding new order:
    async addOrder(order: OrderModel): Promise<OrderModel> {
        const observable = this.http.post<OrderModel>(environment.ordersUrl, order);
        const addedOrder = await firstValueFrom(observable);

        const action: OrdersAction = { type: OrdersActionType.AddOrder, payload: addedOrder };
        ordersStore.dispatch(action);

        return addedOrder;
    }

    //* Count orders:
    async countOrders(): Promise<number> {
        const observable = this.http.get<number>(environment.ordersUrl + "count");
        return await firstValueFrom(observable);
    }

    //* Get most recent order by user:
    getMostRecentOrder(): OrderModel {
        let lastOrder: OrderModel;
        const loggedInUser = authStore.getState().user;
        if (loggedInUser !== null) {
            ordersStore.getState().orders.forEach(o => {
                //^ If the order is not of the current user:
                if (o.user && o.user._id !== loggedInUser._id) {
                    return;
                };

                //^ If the order is not of the current user:
                if (o.userId && o.userId !== loggedInUser._id) {
                    return;
                };

                if (!lastOrder) {
                    lastOrder = o;
                    return;
                };

                if (o.createdAt > lastOrder.createdAt) {
                    lastOrder = o;
                };
            });
        };

        return lastOrder;
    }

}
