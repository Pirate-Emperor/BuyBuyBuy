import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RoleEnum } from '../models/role.enum';
import { authStore } from '../redux/auth.state';
import { NotifyService } from './notify.service';

@Injectable({
    providedIn: 'root'
})

export class AdminGuard implements CanActivate {

    public constructor(private notify: NotifyService, private router: Router) { }

    //* This function is invoked whenever user tries to enter a route required to be admin
    //* This function should return true if the user is actually admin, or false if he isn't admin:
    canActivate(): boolean {
        if (authStore.getState().user?.role === RoleEnum.Admin) {
            return true;
        }

        this.notify.error("You are not an Admin!");
        this.router.navigateByUrl("/home");
        return false;

    }

}
