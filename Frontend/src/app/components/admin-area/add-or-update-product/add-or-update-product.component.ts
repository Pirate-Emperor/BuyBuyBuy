import { Component, Input, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
    selector: 'app-add-or-update-product',
    templateUrl: './add-or-update-product.component.html',
    styleUrls: ['./add-or-update-product.component.css']
})

export class AddOrUpdateProductComponent implements OnInit {

    public product: ProductModel;
    public isAddAction = true;
    public editWasClicked = false;

    @Input('productToBeEdited') set productToBeEdited(product: ProductModel) {
        if (product) {
            this.product = product;
            this.isAddAction = false;
            this.editWasClicked = true;
        };
    }

    //* We need this so edit button can be clicked more than once - (see productsService line 14 for reference)
    @Input('isAddActionInput') set isAddActionInput(isAdd: boolean) { }

    constructor(private productsService: ProductsService) { }

    ngOnInit(): void {
        this.productsService.isAddAction.subscribe((isOpen => {
            this.isAddAction = isOpen;
        }));
    }

    addProduct() {
        this.isAddAction = true;
        this.product = null;
        this.productsService.isAddAction.emit(true);
    }
}