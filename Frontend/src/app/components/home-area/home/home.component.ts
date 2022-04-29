import { Component, OnDestroy, OnInit } from '@angular/core';
import { Unsubscribe } from 'redux';
import { UserModel } from 'src/app/models/user.model';
import { authStore } from 'src/app/redux/auth.state';
import { CartsService } from 'src/app/services/carts.service';
import { NotifyService } from 'src/app/services/notify.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {
    public user: UserModel;
    private unsubscribe: Unsubscribe;

    constructor(private productsService: ProductsService, private ordersService: OrdersService, private cartsService: CartsService, private notifyService: NotifyService) { }

    ngOnInit(): void {
        try {
            this.unsubscribe = authStore.subscribe(async () => {
                if (authStore.getState().user !== this.user) {
                    this.user = authStore.getState().user;

                    if (this.user) {
                        await this.productsService.getAllProducts();
                        await this.ordersService.getAllOrders();
                        await this.productsService.getAllCategories();

                        const cart = await this.cartsService.getCartByUser(this.user._id);
                        await this.cartsService.getAllItemsByCart(cart?._id);
                    }
                }
            })
        } catch (err: any) {
            this.notifyService.error(err);
        }
    }

    ngOnDestroy(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}