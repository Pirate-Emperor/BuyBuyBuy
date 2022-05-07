import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Unsubscribe } from 'redux';
import { CartItemModel } from 'src/app/models/cart-item.model';
import { authStore } from 'src/app/redux/auth.state';
import { cartsStore } from 'src/app/redux/carts.state';
import { CartsService } from 'src/app/services/carts.service';
import { NotifyService } from 'src/app/services/notify.service';
import { CartDialogComponent } from '../cart-dialog/cart-dialog.component';

@Component({
    selector: 'app-cart-list',
    templateUrl: './cart-list.component.html',
    styleUrls: ['./cart-list.component.css']
})

export class CartListComponent implements OnInit, OnDestroy {

    public allItemsByCart: CartItemModel[];
    public isShoppingPage = true;
    public totalAmount: number;
    private unsubscribe: Unsubscribe;

    constructor(private notifyService: NotifyService, private cartsService: CartsService, public dialog: MatDialog) { }

    @Input() openedTrigger!: boolean | string;
    @Output() openedChange = new EventEmitter<boolean>();
    @Output() allItemsByCartEvent = new EventEmitter<CartItemModel[]>();

    async ngOnInit() {
        try {
            const cart = await this.cartsService.getCartByUser(authStore.getState().user._id);
            this.allItemsByCart = await this.cartsService.getAllItemsByCart(cart?._id);
            this.totalAmount = this.cartsService.getTotalCartAmount();

            this.allItemsByCartEvent.emit(this.allItemsByCart);

            if (cartsStore.getState().cartItems.length > 0) {
                this.openedTrigger = true;
                this.openedChange.emit(this.openedTrigger);
            };

            if (cart?.isClosed) {
                this.totalAmount = this.cartsService.getTotalCartAmount();
            };

            this.unsubscribe = cartsStore.subscribe(() => {
                this.allItemsByCart = cartsStore.getState().cartItems;
                this.totalAmount = this.cartsService.getTotalCartAmount();
            });
        } catch (err: any) {
            this.notifyService.error(err);
        }
    }

    async deleteAllItems() {
        try {
            if (this.allItemsByCart.length === 0) return;

            let dialogRef = this.dialog.open(CartDialogComponent, {
                data: { action: 'removeAll' }
            });

            dialogRef.afterClosed().subscribe(async (result) => {
                if (result === false || result === undefined) return;

                await this.cartsService.deleteAllItemsByCart(this.allItemsByCart[0].cartId);
                this.notifyService.success('All items in your cart have been deleted!');
            });
        } catch (err: any) {
            this.notifyService.error(err);
        }
    }

    async deleteThisItem(arr: string[]) {
        try {
            let dialogRef = this.dialog.open(CartDialogComponent, {
                data: { action: 'remove' }
            });
            
            dialogRef.afterClosed().subscribe(async (result) => {
                if (result === false || result === undefined) return;

                await this.cartsService.deleteItem(arr[0], arr[1]);
                this.notifyService.success('Item has been deleted');
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
