import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CategoryModel } from 'src/app/models/category.model';
import { ProductModel } from 'src/app/models/product.model';
import { NotifyService } from 'src/app/services/notify.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.css']
})

export class AddProductComponent implements OnInit {
    public selectedFile: any = null;
    public dynamicClass: string = '';
    public products: ProductModel[]; //* In order to check unique name only

    @Input()
    public addButtonClicked: boolean;
    public displayError = false;

    public product = new ProductModel();
    public categories: CategoryModel[];

    public productForm: FormGroup;
    public nameInput: FormControl;
    public priceInput: FormControl;
    public categoryIdInput: FormControl;
    public imageInput: FormControl;

    @ViewChild('imageBox')
    private imageBoxRef: ElementRef<HTMLInputElement>;

    public isDisabled: boolean = false;

    constructor(private productsService: ProductsService, private notifyService: NotifyService) { }

    onFileSelected(event: Event): void {
        const inputElement = (event.target as HTMLInputElement);
        this.selectedFile = inputElement.files[0] ?? null;
    }

    async ngOnInit() {
        try {
            this.nameInput = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100), this.isUnique()]);
            this.priceInput = new FormControl('', [Validators.required, Validators.min(0), Validators.max(1000)]);
            this.categoryIdInput = new FormControl('', [Validators.required]);
            this.imageInput = new FormControl('', [Validators.required]); //* image is required!!

            this.productForm = new FormGroup({
                nameBox: this.nameInput,
                priceBox: this.priceInput,
                categoryIdBox: this.categoryIdInput,
                imageBox: this.imageInput
            });

            //* Must be after above because await doesn't let formControl get initialized
            this.categories = await this.productsService.getAllCategories();
            this.products = await this.productsService.getAllProducts();

        } catch (err: any) {
            this.notifyService.error(err);
        }
    }

    async add() {
        const errorMsg = 'Please fill out all fields properly';
        try {
            //* These 4 if's is for second time you try to add a product - it won't let you without filling out all fields:
            if (this.nameInput.value === null) {
                this.notifyService.error(errorMsg);
                return;
            };

            if (this.priceInput.value === null) {
                this.notifyService.error(errorMsg);
                return;
            };

            if (this.categoryIdInput.value === null) {
                this.notifyService.error(errorMsg);
                return;
            };

            if (this.imageBoxRef.nativeElement.files[0] === undefined) {
                this.notifyService.error(errorMsg);
                return;
            };

            this.product.productName = this.nameInput.value;
            this.product.price = this.priceInput.value;
            this.product.categoryId = this.categoryIdInput.value;
            this.product.image = this.imageBoxRef.nativeElement.files[0];

            await this.productsService.addProduct(this.product);
            this.notifyService.success('Product has been added');

            //* reset selected file message:
            this.selectedFile = null;

            this.productForm.reset();

            //* Reset validation error:
            Object.keys(this.productForm.controls).forEach(key => {
                this.productForm.get(key).setErrors(null);
            });

        } catch (err: any) {
            this.notifyService.error(err);

        }
    }

    isUnique(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!this.products || this.products.length === 0) {
                return null;
            };

            const nameTaken = this.products.filter(p => (p.productName?.toLowerCase() === this.nameInput.value?.toLowerCase() && p._id != this.product._id));

            if (nameTaken.length > 0) {
                return { uniqueName: false };
            } else {
                return null;
            }
        };
    }
}