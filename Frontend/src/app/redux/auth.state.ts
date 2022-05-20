import jwtDecode from "jwt-decode";
import { createStore } from "redux";
import { UserModel } from "../models/user.model";

//* Auth State - auth data needed in the application level:
export class AuthState {
    public user: UserModel = null
    public token: string = null;

    constructor() {
        this.token = localStorage.getItem("token");
        if (this.token) {
            const container: { user: UserModel } = jwtDecode(this.token);
            this.user = container.user;
        }
    }
}

//* Auth Action Type - any action which can be done on the above auth state:
export enum AuthActionType {
    Register = "Register",
    Login = "Login",
    Logout = "Logout"
}

//* Auth Action - any single object sent to the store during 'dispatch':
export interface AuthAction {
    type: AuthActionType;
    payload?: string;
}

//* Auth Reducer - the main function performing any action on auth state:
export function authReducer(currentState = new AuthState(), action: AuthAction): AuthState {
    const newState = { ...currentState };

    switch (action.type) {
        case AuthActionType.Register:
        case AuthActionType.Login:
            newState.token = action.payload;
            const container: { user: UserModel } = jwtDecode(newState.token);
            newState.user = container.user;
            localStorage.setItem("token", newState.token);
            break;

        case AuthActionType.Logout:
            newState.token = null;
            newState.user = null;
            localStorage.removeItem("token");
            break;
    }

    return newState;
}

export const authStore = createStore(authReducer);