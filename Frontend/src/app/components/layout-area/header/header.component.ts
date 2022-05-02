import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Unsubscribe } from 'redux';
import { UserModel } from 'src/app/models/user.model';
import { authStore } from 'src/app/redux/auth.state';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {

    public user: UserModel;
    private unsubscribe: Unsubscribe;
    public pathByUserState: string;

    constructor(public router: Router) { }

    ngOnInit(): void {
        this.user = authStore.getState().user;
        this.unsubscribe = authStore.subscribe(() => {
            this.user = authStore.getState().user;

            if (!this.user) {
                this.pathByUserState = "/home";
            } else {
                this.pathByUserState = "/shopping";
            }
        });
    }

    ngOnDestroy(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
        };
    }

}
