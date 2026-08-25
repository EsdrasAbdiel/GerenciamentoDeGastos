import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
	selector: 'app-snackbar',
	standalone: true,
	imports: [MatIconModule],
	templateUrl: './snackbar.component.html',
	styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent {

  public data: { message: string, matIcon: string } = inject(MAT_SNACK_BAR_DATA);
}
