import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgIf } from '@angular/common';
import { CalendarioComponent } from '../../components/calendario/calendario.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-menu-cards',
  standalone: true,
  imports: [CalendarioComponent, MenuComponent],
  templateUrl: './menu-cards.component.html',
  styleUrl: './menu-cards.component.scss'
})
export class MenuCardsComponent{

}
