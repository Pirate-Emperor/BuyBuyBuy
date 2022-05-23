import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CredentialsModel } from '../models/credentials.model';
import { UserModel } from '../models/user.model';
import { AuthAction, AuthActionType, authStore } from '../redux/auth.state';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    async register(user: UserModel): Promise<void> {
        user.firstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);
        user.lastName = user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1);

        const observable = this.http.post<string>(environment.registerUrl, user);
        const token = await firstValueFrom(observable);

        const action: AuthAction = { type: AuthActionType.Register, payload: token };
        authStore.dispatch(action);
    }

    async login(credentials: CredentialsModel): Promise<void> {
        const observable = this.http.post<string>(environment.loginUrl, credentials);
        const token = await firstValueFrom(observable);

        const action: AuthAction = { type: AuthActionType.Login, payload: token };
        authStore.dispatch(action);
    }

    //* Check if there is duplicate username or ID number:
    async checkValidEmailAndIdNumber(user: UserModel): Promise<boolean> {
        const observable = this.http.post<boolean>(environment.emailAndIdNumberUniqueUrl, user);
        return await firstValueFrom(observable);
    }

    logout(): void {
        const action: AuthAction = { type: AuthActionType.Logout };
        authStore.dispatch(action);
    }
}
