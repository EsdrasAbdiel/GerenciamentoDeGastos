import { NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { GridAcoesModel } from './grid-acoes.model';
import { GridAcoesTipoEnum } from './grid-acoes.enum';

@Component({
  selector: 'app-grid-acoes',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    NgTemplateOutlet,
    IconButtonComponent
],
  templateUrl: './grid-acoes.component.html',
  styleUrl: './grid-acoes.component.scss'
})
export class GridAcoesComponent<T extends object> {
  @Input() rowEditTemplate!: TemplateRef<unknown>;
  @Output() confirmar = new EventEmitter<T>();
  @Output() deletar = new EventEmitter<T>();
  @Output() editar = new EventEmitter<T>();
  @Output() adicionar = new EventEmitter<T>();
  @Input() criarNovaLinha!: () => T;
  @Input() tipoGrid: GridAcoesTipoEnum = GridAcoesTipoEnum.consulta;
  @Input() linhaClicavel = false;
  @Output() aoClicarNaLinha = new EventEmitter<T>();

  @Input() form!: FormGroup;
  @Input() dados: T[] = [];
  _colunas: GridAcoesModel[] = [];
  displayedColumns: string[] = [];

  editingRow: T | null = null;
  editandoLinha = false;
  GridAcoesTipoEnum = GridAcoesTipoEnum

  isExpansionDetailRow = (_: number, row: T) => {
    return this.isEditing(row);
  };

  @Input() set colunas(value: GridAcoesModel[]) {
    if (!value) return;

    this.displayedColumns = value.map(column => column.key);

    if(this.tipoGrid === GridAcoesTipoEnum.edicao)
      this.displayedColumns.push('acoes');

    this._colunas = value;
  }

  visualizar = true;

  onDelete(row: T): void {
    this.deletar.emit(row);
  }

  onConfirmar(row: T): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    Object.assign(row, this.form.value);

    this.editandoLinha = false;

    this.confirmar.emit(row);

    this.editingRow = null;
  }

  private rowOriginal: T | null = null;

  onEditar(row: T): void {
    console.log(row);

    if (this.editingRow === row) {
      return;
    }

    this.editar.emit(row);

    this.editingRow = row;
    this.rowOriginal = structuredClone(row);

    this.form.reset();
    this.form.patchValue(row);
  }

  onCancelar(): void {
    if (!this.editingRow) {
      return;
    }

    if (this.editandoLinha) {
      this.dados = this.dados.filter(
        item => item !== this.editingRow
      );

      this.editandoLinha = false;
    } else if (this.rowOriginal) {
      Object.assign(this.editingRow, this.rowOriginal);
    }

    this.editingRow = null;
    this.rowOriginal = null;
  }

  isEditing(row: T): boolean {
    return this.editingRow === row;
  }

  adicionarLinha(): void {
    this.editandoLinha = true;

    const novaLinha = this.criarNovaLinha();

    this.dados = [
      ...this.dados,
      novaLinha
    ];

    this.onEditar(novaLinha);
    this.adicionar.emit();
  }

  deveClicar() {
    alert('Linha clicada')
  }

  onClickRow(row: T) {
    this.aoClicarNaLinha.emit(row);
  }
}
