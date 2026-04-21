import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  standalone: true
})
export class ButtonComponent {
  @Input() desabilitado: boolean = false;
  @Input() label: string = '';
  @Input() classeBotao: string = '' ;
  @Output() aoClicar = new EventEmitter<void>();

  onClick() {
    this.aoClicar.emit();
  }
}
