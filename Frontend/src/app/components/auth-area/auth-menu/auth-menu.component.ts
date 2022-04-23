import { Component, OnDestroy, OnInit } from '@angular/core';
import { Unsubscribe } from 'redux';
import { UserModel } from 'src/app/models/user.model';
import { authStore } from 'src/app/redux/auth.state';

@Component({
    selector: 'app-auth-menu',
    templateUrl: './auth-menu.component.html',
    styleUrls: ['./auth-menu.component.css']
})

export class AuthMenuComponent implements OnInit, OnDestroy {
    public user: UserModel;
    private unsubscribe: Unsubscribe;

    ngOnInit(): void {
        this.user = authStore.getState().user;
        this.unsubscribe = authStore.subscribe(() => {
            this.user = authStore.getState().user;
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe();
    }
}