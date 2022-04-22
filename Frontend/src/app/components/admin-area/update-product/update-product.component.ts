import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CategoryModel } from 'src/app/models/category.model';
import { ProductModel } from 'src/app/models/product.model';
import { NotifyService } from 'src/app/services/notify.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
    selector: 'app-update-product',
    templateUrl: './update-product.component.html',
    styleUrls: ['./update-product.component.css']
})

export class UpdateProductComponent implements OnInit {
    public productToEdit: ProductModel;
    public categories: CategoryModel[];
    public selectedFile: any = null;
    public selectedImageName: string;
    public dynamicClass: string = '';
    public products: ProductModel[];
    public displayError = false;

    public productForm: FormGroup;
    public nameInput: FormControl;
    public priceInput: FormControl;
    public categoryIdInput: FormControl;
    public imageInput: FormControl;

    @ViewChild('imageBox')
    public imageBoxRef: ElementRef<HTMLInputElement>;

    @Input('editProduct') set editProduct(product: ProductModel) {
        if (product) {
            this.productToEdit = product;
            this.populateProductDetails();
        }
    }

    constructor(private productsService: ProductsService, private notify: NotifyService) { }

    async ngOnInit() {
        try {
            this.nameInput = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100), this.isUnique()]);
            this.priceInput = new FormControl('', [Validators.required, Validators.min(0), Validators.max(1000)]);
            this.categoryIdInput = new FormControl('', [Validators.required]);
            this.imageInput = new FormControl('', []);
            this.productForm = new FormGroup({
                nameBox: this.nameInput,
                priceBox: this.priceInput,
                categoryIdBox: this.categoryIdInput,
                imageBox: this.imageInput
            });

            this.categories = await this.productsService.getAllCategories();
            this.products = await this.productsService.getAllProducts();

        } catch (err: any) {
            this.notify.error(err);
        }
    }

    onFileSelected(event: Event): void {
        const inputElement = (event.target as HTMLInputElement);
        this.selectedFile = inputElement.files[0] ?? null;
    }

    async update() {
        try {
            this.productToEdit.productName = this.nameInput.value;
            this.productToEdit.price = this.priceInput.value;
            this.productToEdit.categoryId = this.categoryIdInput.value;
            this.productToEdit.image = this.imageBoxRef.nativeElement.files[0];

            await this.productsService.updateProduct(this.productToEdit);
            this.notify.success('Product has been updated');

            this.dynamicClass = 'hide-hint';

        } catch (err: any) {
            this.notify.error(err);
        }
    }

    populateProductDetails() {
        this.productForm.patchValue({
            nameBox: this.productToEdit.productName,
            priceBox: this.productToEdit.price,
            categoryIdBox: this.productToEdit.categoryId,
            imageBox: null
        });
    }

    isUnique(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!this.products || this.products.length === 0) {
                return null;
            };

            const nameTaken = this.products.filter(p => (p.productName.toLowerCase() === this.nameInput.value.toLowerCase() && p._id != this.productToEdit._id));

            if (nameTaken.length > 0) {
                return { uniqueName: false };
            } else {
                return null;
            }
        };
    }
}