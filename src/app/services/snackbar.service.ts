import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarComponent } from "../components/snackbar/snackbar.component";
import { timeout } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    private _snackBar = inject(MatSnackBar)

    success(message?: string, duration?: number) {
        this._snackBar.openFromComponent(SnackbarComponent, {
            data: {
                matIcon: 'check_circle',
                message: message
            },
            verticalPosition: 'top',
            horizontalPosition: 'right',
            duration: duration ? duration : 3000,
            panelClass: ['success']
        })
    }

    error(message?: string, duration?: number) {
        this._snackBar.openFromComponent(SnackbarComponent, {
            data: {
                matIcon: 'cancel',
                message: message
            },
            verticalPosition: 'top',
            horizontalPosition: 'right',
            duration: duration ? duration : 3000,
            panelClass: ['error']
        })
    }
}