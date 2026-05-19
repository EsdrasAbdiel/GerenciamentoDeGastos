import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table'
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { GridEditarExcluirColunas } from './grid-editar-excluir-colunas.model';

@Component({
  selector: 'app-grid-editar-excluir',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    NgFor,
    NgTemplateOutlet,
    NgIf,
    IconButtonComponent
  ],
  templateUrl: './grid-editar-excluir.component.html',
  styleUrl: './grid-editar-excluir.component.scss'
})
export class GridEditarExcluirComponent<T> implements OnInit {
  @Input() rowEditTemplate!: TemplateRef<any>;
  @Output() confirmar = new EventEmitter<any>()
  @Output() deletar = new EventEmitter<any>();
  @Output() editar = new EventEmitter<any>();
  @Output() adicionar = new EventEmitter<any>();
  @Input() form!: FormGroup;
  @Input() dados: T[] = [];
  _colunas: GridEditarExcluirColunas[] = []
  displayedColumns: string[] = []

  editingRow: any = null;

  editandoLinha = false;

  isExpansionDetailRow = (_: number, row: any) => {
    return this.isEditing(row);
  };


  @Input() set colunas(value: any[]) {
    if (!value) return;
    const colunas = value;

    console.log(value);


    this.displayedColumns = colunas.map((column: any) => column.key);
    this.displayedColumns.push('acoes');

    this._colunas = value;


  }

  visualizar: boolean = true;

  ngOnInit(): void {
    console.log(this.displayedColumns);
    console.log(this._colunas);
  }

  editarLinha(linha: any) {
    console.log(linha);

  }

  onDelete(row: any) {
    this.deletar.emit(row)
  }

  onConfirmar(row: any) {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    Object.assign(row, this.form.value);

    this.editandoLinha = false;

    this.confirmar.emit(row);

    this.editingRow = null;
  }


  private rowOriginal: any;

onEditar(row: any) {

  if (this.editingRow === row) {
    return;
  }

  this.editar.emit(row);

  this.editingRow = row;

  this.rowOriginal = structuredClone(row);

  this.form.reset();
  this.form.patchValue(row);
}

  onCancelar() {

    if (this.editandoLinha) {

      this.dados = this.dados.filter(
        item => item !== this.editingRow
      );

      this.editandoLinha = false;

    } else {

Object.assign(this.editingRow, this.rowOriginal);
    }

    this.editingRow = null;
  }

  isEditing(row: any): boolean {
    return this.editingRow === row;
  }

  adicionarLinha() {

    this.editandoLinha = true;

    const novaLinha: any = {};

    this.dados = [
      ...this.dados,
      novaLinha
    ];

    this.onEditar(novaLinha);
    this.adicionar.emit()
  }
}
