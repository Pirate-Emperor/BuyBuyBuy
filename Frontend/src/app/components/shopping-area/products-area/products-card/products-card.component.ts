import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductModel } from 'src/app/models/product.model';
import { RoleEnum } from 'src/app/models/role.enum';
import { ProductsService } from 'src/app/services/products.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-products-card',
    templateUrl: './products-card.component.html',
    styleUrls: ['./products-card.component.css']
})

export class ProductsCardComponent {
    @Input() public product: ProductModel;
    @Input() public role: RoleEnum;

    public userRole = RoleEnum.User;
    public adminRole = RoleEnum.Admin;

    public productsImageUrl = environment.productsImageUrl;

    constructor(private productsService: ProductsService) { }

    // ---------------------------------------------this is for admin only: ----------------------------------------------
    @Output()
    public edit = new EventEmitter<ProductModel>();

    public editProduct(product: ProductModel) {
        this.productsService.isAddAction.emit(false);
        this.edit.emit(product);
    }

    // ---------------------------------------------this is for user only: ----------------------------------------------

    @Output()
    public add = new EventEmitter<ProductModel>();

    public addProduct(product: ProductModel) {
        this.add.emit(product);
    }
}