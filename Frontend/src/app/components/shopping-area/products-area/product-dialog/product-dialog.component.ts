import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-product-dialog',
    templateUrl: './product-dialog.component.html',
    styleUrls: ['./product-dialog.component.css']
})

export class ProductDialogComponent implements OnInit {

    public quantity: number;

    ngOnInit(): void {
        this.quantity = 1;
    }
}