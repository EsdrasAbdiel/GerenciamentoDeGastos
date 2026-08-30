
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
	selector: 'app-date-picker',
	imports: [ButtonComponent],
	templateUrl: './date-picker.component.html',
	styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent<T> {
  @Input() items: T[] = [];
  @Input() labelKey?: keyof T;
  @Input() label = '';
  @Input() isOpen = false;

  @Output() selecionado = new EventEmitter<T>();
  @Output() abrirFechar = new EventEmitter<void>();

  selecionar(item: T): void {
  	this.selecionado.emit(item);
  }

  getLabel(item: T): string {
  	if (!this.labelKey) {
  		return String(item);
  	}

  	return String(item[this.labelKey]);
  }

  toggle(): void {
  	this.abrirFechar.emit();
  }
}
