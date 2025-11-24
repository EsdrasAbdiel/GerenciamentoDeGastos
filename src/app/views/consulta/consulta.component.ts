import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { DetalhesComponent } from '../detalhes/detalhes.component';
import { IconButtonComponent } from '../../components/icon-button/icon-button.component';

@Component({
  selector: 'app-consulta',
  imports: [MatCardModule, MatSidenavModule, MatIconModule, MatToolbarModule, MatDividerModule, MatListModule, CommonModule, DetalhesComponent, IconButtonComponent],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.scss'
})
export class ConsultaComponent {
  detalhes = false;

  aoClicarNoCardDeveVerDetalhes() {
    this.detalhes = true;
  }

}
