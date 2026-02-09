import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarComponent } from "../components/snackbar/snackbar.component";

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    private _snackBar = inject(MatSnackBar)

    success() {
        this._snackBar.openFromComponent(SnackbarComponent, {
            data: {
                message: 'Teste'
            }
        })
    }
}