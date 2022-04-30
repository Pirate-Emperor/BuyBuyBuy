import { Component, OnDestroy, OnInit } from '@angular/core';
import { Unsubscribe } from 'redux';
import { CartModel } from 'src/app/models/cart.model';
import { OrderModel } from 'src/app/models/order.model';
import { UserModel } from 'src/app/models/user.model';
import { authStore } from 'src/app/redux/auth.state';
import { cartsStore } from 'src/app/redux/carts.state';
import { CartsService } from 'src/app/services/carts.service';
import { NotifyService } from 'src/app/services/notify.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
    selector: 'app-shopping-info',
    templateUrl: './shopping-info.component.html',
    styleUrls: ['./shopping-info.component.css']
})

export class ShoppingInfoComponent implements OnInit, OnDestroy {
    public numberOfProducts: number;
    public numberOfOrders: number;
    public user: UserModel;
    public authUnsubscribe: Unsubscribe;
    public cartsUnsubscribe: Unsubscribe;
    public currentCart: CartModel;
    public totalAmount: number = 0;
    public lastOrder: OrderModel;

    constructor(private productsService: ProductsService, private ordersService: OrdersService, private cartsService: CartsService, private notifyService: NotifyService) { }

    async ngOnInit() {

        try {
            this.numberOfProducts = await this.productsService.countProducts();
            this.numberOfOrders = await this.ordersService.countOrders();

            this.authUnsubscribe = authStore.subscribe(() => {
                this.user = authStore.getState().user;
                this.currentCart = cartsStore.getState().currentCart;
            })

            this.cartsUnsubscribe = cartsStore.subscribe(() => {
                this.user = authStore.getState().user;
                this.currentCart = cartsStore.getState().currentCart;

                this.totalAmount = this.cartsService.getTotalCartAmount();
                this.lastOrder = this.ordersService.getMostRecentOrder();
            })
        } catch (err: any) {
            this.notifyService.error(err);
        }
    }

    getOrderText() {
        if (this.numberOfOrders > 1) {
            return `So far our store has had a total of ${this.numberOfOrders} orders!`;
        };

        if (this.numberOfOrders === 1) {
            return 'Our store currently has one order.';
        };

        return 'Our store currently has no orders!';
    }

    ngOnDestroy(): void {
        if (this.authUnsubscribe) {
            this.authUnsubscribe();
        }

        if (this.cartsUnsubscribe) {
            this.cartsUnsubscribe();
        }
    }
}