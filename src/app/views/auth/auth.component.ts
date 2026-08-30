import { Component } from '@angular/core';
import { MoneyBackgroundComponent } from '../../../assets/money-background/money-background.component';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-auth',
	standalone: true,
	imports: [MoneyBackgroundComponent, RouterOutlet],
	templateUrl: './auth.component.html',
	styleUrl: './auth.component.scss'
})
export class AuthComponent {

}
