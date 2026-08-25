import { NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { GridEditarExcluirColunas } from './grid-editar-excluir-colunas.model';

@Component({
  selector: 'app-grid-editar-excluir',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    NgTemplateOutlet,
    IconButtonComponent
  ],
  templateUrl: './grid-editar-excluir.component.html',
  styleUrl: './grid-editar-excluir.component.scss'
})
export class GridEditarExcluirComponent<T extends object> {
  @Input() rowEditTemplate!: TemplateRef<unknown>;
  @Output() confirmar = new EventEmitter<T>();
  @Output() deletar = new EventEmitter<T>();
  @Output() editar = new EventEmitter<T>();
  @Output() adicionar = new EventEmitter<T>();
  @Input() criarNovaLinha!: () => T;
  @Input() tipoGrid: 'consulta' | 'edicao' = 'consulta'

  @Input() form!: FormGroup;
  @Input() dados: T[] = [];
  _colunas: GridEditarExcluirColunas[] = [];
  displayedColumns: string[] = [];

  editingRow: T | null = null;

  editandoLinha = false;

  isExpansionDetailRow = (_: number, row: T) => {
    return this.isEditing(row);
  };


  @Input() set colunas(value: GridEditarExcluirColunas[]) {
    if (!value) return;

    this.displayedColumns = value.map(column => column.key);
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
}
