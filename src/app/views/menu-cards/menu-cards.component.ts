import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';
import { MatCardModule } from '@angular/material/card';
import { LoadingComponent } from '../../components/loading/loading.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-menu-cards',
  standalone: true,
  imports: [MatCardModule, NgFor],
  templateUrl: './menu-cards.component.html',
  styleUrl: './menu-cards.component.scss'
})
export class MenuCardsComponent<T> {
  @Input() items: T[] = [];
  @Input() labelKey?: keyof T;

  @Output() selecionado = new EventEmitter<T>();

  selecionar(item: T) {
    this.selecionado.emit(item);
  }

  getLabel(item: T) {
    return this.labelKey ? item[this.labelKey] : item;
  }
}
