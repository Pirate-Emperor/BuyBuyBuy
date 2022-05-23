import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { authStore } from '../redux/auth.state';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        //* If we have a token: 
        if (authStore.getState().token) {

            //* Duplicate request object:
            request = request.clone({

                //* Add jwt header to it: 
                setHeaders: {
                    authorization: "Bearer " + authStore.getState().token
                }

            });
        }

        //* next function to continue to the next interceptor:
        return next.handle(request);
    }

}