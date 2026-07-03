import { Router, RouterLink } from '@angular/router';
import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';

import { MatCardModule } from '@angular/material/card'
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { GridEditarExcluirComponent } from '../../components/grid-editar-excluir/grid-editar-excluir.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from "../../components/input/input.component";

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
    CommonModule,
    GridEditarExcluirComponent,
    ReactiveFormsModule,
    InputComponent
],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.scss'
})
export class ConsultaComponent implements OnInit {
  @ViewChild('viewTemplate', { static: true }) viewTemplate!: TemplateRef<any>
  @ViewChild('viewDataPagamento', { static: true }) viewDataPagamento!: TemplateRef<any>

  colunas: any[] = [];
  dados: any[] = [];
  form!: FormGroup

  constructor(
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      descricaoDespesa: [''],
      valorDespesa: [''],
      dataPagamento: ['']
    })
   }


  ngOnInit(): void {
    this.colunas = [
      { label: 'Despesa', key: 'descricaoDespesa', type: 'text' },
      { label: 'Valor', key: 'valorDespesa', template: this.viewTemplate, type: 'number' },
      { label: 'Data Pagamento', key: 'dataPagamento', template: this.viewDataPagamento, type: 'date' },
    ]
    this.dados = [
      { descricaoDespesa: 'Mercado', valorDespesa: 10, dataPagamento: new Date().toISOString().split('T')[0]},
      { descricaoDespesa: 'Cinema', valorDespesa: 20, dataPagamento: '2024-03-26'},

    ]
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

  deveEditarDados(linha: any) {
    console.log(linha);

  }

  aoConfirmarEdicao(linha: any) {
    console.log(linha);

  }

deletarLinha(row: any) {

  this.dados = this.dados.filter(item => item !== row);

  console.log(this.dados);


}

}
