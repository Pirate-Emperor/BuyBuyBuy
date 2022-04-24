import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
    selector: 'app-logout',
    template: ""
})

export class LogoutComponent implements OnInit {

    constructor(private authService: AuthService, private notifyService: NotifyService, private router: Router, private productsService: ProductsService) { }

    ngOnInit(): void {
        this.productsService.setSelectedCategory("all");
        this.authService.logout();
        this.notifyService.success("You are logged-out");
        this.router.navigateByUrl("/home");
    }
}