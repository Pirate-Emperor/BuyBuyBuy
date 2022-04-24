import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Unsubscribe } from 'redux';
import { CartModel } from 'src/app/models/cart.model';
import { CredentialsModel } from 'src/app/models/credentials.model';
import { OrderModel } from 'src/app/models/order.model';
import { RoleEnum } from 'src/app/models/role.enum';
import { UserModel } from 'src/app/models/user.model';
import { authStore } from 'src/app/redux/auth.state';
import { cartsStore } from 'src/app/redux/carts.state';
import { AuthService } from 'src/app/services/auth.service';
import { NotifyService } from 'src/app/services/notify.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {

    public credentials = new CredentialsModel();
    public user: UserModel;
    public authUnsubscribe: Unsubscribe;
    public cartsUnsubscribe: Unsubscribe;
    public currentCart: CartModel;
    public lastOrder: OrderModel;

    constructor(private authService: AuthService, private notifyService: NotifyService, private router: Router, private ordersService: OrdersService) { }

    ngOnInit() {
        this.user = authStore.getState().user;

        this.cartsUnsubscribe = cartsStore.subscribe(() => {
            if (this.user !== null) {
                this.currentCart = cartsStore.getState().currentCart;
                this.lastOrder = this.ordersService.getMostRecentOrder();
            }
        })

        this.authUnsubscribe = authStore.subscribe(() => {
            this.user = authStore.getState().user;

            if (this.user !== null) {
                this.currentCart = cartsStore.getState().currentCart;
                this.lastOrder = this.ordersService.getMostRecentOrder();
            }
        })
    }

    ngOnDestroy(): void {
        if (this.authUnsubscribe) {
            this.authUnsubscribe();
        }

        if (this.cartsUnsubscribe) {
            this.cartsUnsubscribe();
        }
    }

    async submit() {
        try {
            this.credentials.username = this.credentials.username.toLowerCase();
            await this.authService.login(this.credentials);

            this.notifyService.success("You are been logged in");

            if (this.user.role === RoleEnum.Admin) {
                this.router.navigateByUrl('/admin-home');
            }

        } catch (err: any) {
            this.notifyService.error(err);
        }
    }

    getLoggedInState() {
        if (!this.currentCart && this.user) {
            return 'Start Shopping'
        }
        return 'Resume Shopping'
    }
}