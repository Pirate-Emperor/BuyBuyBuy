import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Unsubscribe } from 'redux';
import { CartItemModel } from 'src/app/models/cart-item.model';
import { ProductModel } from 'src/app/models/product.model';
import { RoleEnum } from 'src/app/models/role.enum';
import { UserModel } from 'src/app/models/user.model';
import { authStore } from 'src/app/redux/auth.state';
import { cartsStore } from 'src/app/redux/carts.state';
import { CartsService } from 'src/app/services/carts.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ProductDialogComponent } from '../products-area/product-dialog/product-dialog.component';

@Component({
    selector: 'app-shopping',
    templateUrl: './shopping.component.html',
    styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {

    public user: UserModel;
    public opened: boolean = true;
    public allItemsByCart: CartItemModel[] = [];
    public totalAmount: number;
    private unsubscribe: Unsubscribe;

    constructor(private router: Router, public cartsService: CartsService, public notifyService: NotifyService, public dialog: MatDialog) { }

    async ngOnInit() {
        //* Check the role of user:
        this.user = authStore.getState().user;

        //* If the role is for admin -> navigate to admin area:
        if (this.user.role == RoleEnum.Admin) {
            this.router.navigateByUrl('/admin-home');
        }

        //* If the cart is empty -> don't open the sidenav:
        if (cartsStore.getState().cartItems.length === 0) {
            this.opened = false;
        }

        const cart = await this.cartsService.getCartByUser(this.user._id);
        this.allItemsByCart = await this.cartsService.getAllItemsByCart(cart?._id);
        this.totalAmount = this.cartsService.getTotalCartAmount();

        this.unsubscribe = cartsStore.subscribe(() => {
            this.allItemsByCart = cartsStore.getState().cartItems;
            this.totalAmount = this.cartsService.getTotalCartAmount();
        })
    }

    async addProduct(product: ProductModel) {
        let dialogRef = this.dialog.open(ProductDialogComponent);

        //* An action to do when closing dialog (updating the cart):
        dialogRef.afterClosed().subscribe(async (quantity) => {

            if (!quantity) return;

            if (cartsStore.getState().cartItems.length === 0) {
                this.opened = true;
            }

            try {
                const total = (quantity) * product.price;

                //* Creating new Cart Item:
                const itemToBeAddedToCart = new CartItemModel(quantity, product._id, cartsStore.getState().currentCart?._id, total);
                await this.cartsService.addItemToCart(itemToBeAddedToCart, authStore.getState().user._id);
                this.notifyService.success("Item's in cart have been updated");

                //* Updating the cartsStore (through backend): 
                const cart = await this.cartsService.getCartByUser(authStore.getState().user._id);
                await this.cartsService.getAllItemsByCart(cart?._id);

            } catch (err: any) {
                this.notifyService.error(err);
            }
        })
    }
}