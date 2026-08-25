import { Component } from '@angular/core';
import { CalendarioComponent, MenuComponent } from '../../components';

@Component({
	selector: 'app-menu-cards',
	standalone: true,
	imports: [CalendarioComponent, MenuComponent],
	templateUrl: './menu-cards.component.html',
	styleUrl: './menu-cards.component.scss'
})
export class MenuCardsComponent{

}
