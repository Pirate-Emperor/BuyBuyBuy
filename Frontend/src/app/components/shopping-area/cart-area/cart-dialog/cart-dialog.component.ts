import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CartListComponent } from '../cart-list/cart-list.component';

export interface DialogData {
    action: 'removeAll' | 'remove'
}
@Component({
    selector: 'app-cart-dialog',
    templateUrl: './cart-dialog.component.html',
    styleUrls: ['./cart-dialog.component.css']
})

export class CartDialogComponent {

    constructor(public dialogRef: MatDialogRef<CartListComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

}
