import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Unsubscribe } from 'redux';
import { CityEnum } from 'src/app/models/city.enum';
import { OrderModel } from 'src/app/models/order.model';
import { UserModel } from 'src/app/models/user.model';
import { authStore } from 'src/app/redux/auth.state';
import { cartsStore } from 'src/app/redux/carts.state';
import { ordersStore } from 'src/app/redux/orders.state';
import { NotifyService } from 'src/app/services/notify.service';
import { OrdersService } from 'src/app/services/orders.service';
import { OrderDialogComponent } from '../order-dialog/order-dialog.component';

@Component({
    selector: 'app-add-order',
    templateUrl: './add-order.component.html',
    styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent implements OnInit, OnDestroy {

    public CityEnum = CityEnum;
    public user: UserModel;
    public order = new OrderModel();
    public cartId: string;
    private unsubscribe: Unsubscribe;

    public today: Date = new Date();
    public currentYear: number = this.today.getFullYear();
    public currentMonth: number = this.today.getMonth();
    public currentDay: number = this.today.getDate();
    public minDate: Date = new Date(this.currentYear, this.currentMonth, this.currentDay);
    public maxDate: Date = new Date(this.currentYear, this.currentMonth + 1, this.currentDay);

    public orders: OrderModel[];

    constructor(private ordersService: OrdersService, private router: Router, private notifyService: NotifyService, public dialog: MatDialog) { }

    async ngOnInit() {
        this.user = authStore.getState().user;

        this.orders = await this.ordersService.getAllOrders();

        this.unsubscribe = ordersStore.subscribe(() => {
            this.orders = ordersStore.getState().orders;
        });
    }

    //* This function prevents fridays and saturdays and dates that have more than 3 orders:
    dateFilter(date: any) {

        //* Prevents fridays and saturdays:
        const day = date?.getDay()
        if (day === 5 || day === 6) {
            return false;
        }

        //* Get all the orders dates:
        const orders: OrderModel[] = ordersStore.getState().orders;
        const arrOfOrdersDates: any[] = orders.map(o => o.deliveryDate);

        //* Count how many there are of the same value:
        const arr = arrOfOrdersDates.reduce((obj, b) => {
            obj[b] = ++obj[b] || 1;
            return obj;
        }, {})

        //* Turn them into an array of dates number:
        let blockedDates = [];

        for (const [key, value] of Object.entries(arr)) {
            if (value >= 3) {
                let dateNumber = new Date(key).getDate();
                let dateMonth = new Date(key).getMonth();
                let fullDate = { dateNumber, dateMonth };
                blockedDates.push(fullDate);
            };
        };

        //* Prevents dates that have more than 3 orders:
        let dNumber = date?.getDate();
        let dMonth = date?.getMonth();

        if (blockedDates) {
            return !blockedDates.find(x => {
                if (x.dateMonth == dMonth) {
                    return x.dateNumber == dNumber;
                }
                return !x.dateNumber;
            });
        };

        return true;
    }

    async addOrder() {
        try {
            this.cartId = cartsStore.getState().currentCart._id;
            this.order.cartId = this.cartId;
            this.order.userId = this.user._id;

            await this.ordersService.addOrder(this.order);
            this.notifyService.success("Order has been added");

            let dialogRef = this.dialog.open(OrderDialogComponent);

            dialogRef.afterClosed().subscribe((result) => {
                if (result === undefined) {
                    this.router.navigateByUrl('/shopping');
                }
            });
        } catch (err: any) {
            this.notifyService.error(err);
        }

    }

    doubleClickToPopulate() {
        this.order.deliveryCity = this.user.city;
        this.order.deliveryStreet = this.user.street;
    }

    ngOnDestroy(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}