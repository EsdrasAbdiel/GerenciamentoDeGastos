import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon-button',
  imports: [MatIconModule, NgStyle],
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss', '../../../assets/colors.scss']
})
export class IconButtonComponent {
  @Input() icone = '';
  @Input() desabilitado = '';
  @Input() cor = '';

}
