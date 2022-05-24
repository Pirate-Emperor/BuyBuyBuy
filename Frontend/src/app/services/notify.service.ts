import { Injectable } from '@angular/core';
import { Notyf } from 'notyf';

@Injectable({
    providedIn: 'root'
})
export class NotifyService {

    private notify = new Notyf({
        position: { x: "center", y: "top" },
        types: [
            {
                type: 'success',
                duration: 4000,
                background: 'blue',
                dismissible: true,
            },
            {
                type: 'error',
                duration: 7000,
                dismissible: true,
            }
        ]
    });

    success(message: string): void {
        this.notify.success(message);
    }

    error(err: any): void {
        const message = this.extractErrorMessage(err);
        this.notify.error(message);
    }

    private extractErrorMessage(err: any): string {
        if (typeof err === 'string') return err;
        if (typeof err.error === 'string') return err.error;
        if (Array.isArray(err.error)) return err.error[0];
        if (typeof err.message === 'string') return err.message;
        return 'Some error, please try again...';
    }

}
