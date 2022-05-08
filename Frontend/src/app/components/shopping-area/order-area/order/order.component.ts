import { Component, OnInit } from '@angular/core';
import { CartItemModel } from 'src/app/models/cart-item.model';
import { CartModel } from 'src/app/models/cart.model';
import { authStore } from 'src/app/redux/auth.state';
import { CartsService } from 'src/app/services/carts.service';
import { NotifyService } from 'src/app/services/notify.service';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit {

    public allItemsByCart: CartItemModel[];
    public cartByUser: CartModel;
    public totalAmount: number = 0;

    constructor(private notifyService: NotifyService, private cartsService: CartsService) { }

    async ngOnInit() {
        try {
            this.cartByUser = await this.cartsService.getCartByUser(authStore.getState().user._id);
            this.allItemsByCart = await this.cartsService.getAllItemsByCart(this.cartByUser?._id);
            this.totalAmount = this.cartsService.getTotalCartAmount();
        } catch (err: any) {
            this.notifyService.error(err);
        }
    }
}