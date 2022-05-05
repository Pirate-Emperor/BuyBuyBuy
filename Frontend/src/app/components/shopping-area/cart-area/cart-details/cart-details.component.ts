import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Unsubscribe } from 'redux';
import { CartItemModel } from 'src/app/models/cart-item.model';
import { productsStore } from 'src/app/redux/products.state';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-cart-details',
    templateUrl: './cart-details.component.html',
    styleUrls: ['./cart-details.component.css']
})

export class CartDetailsComponent implements OnInit, OnDestroy {

    private unsubscribe: Unsubscribe;
    public search: string = null;
    public productsImageUrl = environment.productsImageUrl;

    @Input() public fromShopPage: boolean;

    @Input() public item: CartItemModel;

    @Output() public deleteItem = new EventEmitter<string[]>();

    constructor(public dialog: MatDialog, public router: Router) { }

    ngOnInit(): void {
        this.unsubscribe = productsStore.subscribe(() => {
            this.search = productsStore.getState().searchText;
        });
    };

    public deleteThisItem(_id: string, cartId: string): void {
        this.deleteItem.emit([_id, cartId]);
    };

    ngOnDestroy(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    };

}
