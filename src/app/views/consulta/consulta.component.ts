import { Router, RouterLink } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatCardModule } from '@angular/material/card'
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [
    MatCardModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    MatListModule,
    CommonModule
],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.scss'
})
export class ConsultaComponent implements OnInit {

  constructor(
    private router: Router,
  ){}

  ngOnInit(): void {

  }

  @ViewChild('drawer') drawer!: MatSidenav;

  detalhes = false;
  home = false;

  aoClicarNoCardDeveVerDetalhes() {
    this.detalhes = true;
  }

  deveAbrirMenuLateral() {
    console.log('teste');

    this.drawer.toggle()
  }

}
