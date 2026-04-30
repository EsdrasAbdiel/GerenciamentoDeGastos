import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { GridEditarExcluirColunas } from './grid-editar-excluir-colunas.model';

@Component({
  selector: 'app-grid-editar-excluir',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatGridListModule,
    IconButtonComponent
  ],
  templateUrl: './grid-editar-excluir.component.html',
  styleUrl: './grid-editar-excluir.component.scss'
})
export class GridEditarExcluirComponent<T = any> {

  @Input() dados: T[] = [];
  @Input() titulo: string = 'Tabela';
  @Input() colunas: GridEditarExcluirColunas<T>[] = [];

  @Output() salvarEdicao = new EventEmitter<{ index: number; item: T }>();
  @Output() salvarNovo = new EventEmitter<T>();
  @Output() remover = new EventEmitter<number>();
  @Output() cancelar = new EventEmitter<void>();

  indiceEmEdicao: number | null = null;
  adicionandoNovo = false;
  novoItem: Partial<T> = {};

  get estaEmEdicaoOuAdicionando(): boolean {
    return this.indiceEmEdicao !== null || this.adicionandoNovo;
  }

  get totalColunas(): number {
  return this.colunas.reduce((total, c) => total + c.colspan, 0) + 2; // +2 ações
}

  trackByFn(index: number): number {
    return index;
  }

  editarLinha(index: number): void {
    this.indiceEmEdicao = index;
    this.adicionandoNovo = false;
  }

  cancelarEdicao(): void {
    this.indiceEmEdicao = null;
    this.adicionandoNovo = false;
    this.novoItem = {};
    this.cancelar.emit();
  }

  salvarEdicaoInterno(index: number): void {
    const item = this.dados[index];
    this.salvarEdicao.emit({ index, item: { ...item } });
    this.cancelarEdicao();
  }

  adicionarLinha(): void {
    this.novoItem = {};
    this.adicionandoNovo = true;
    this.indiceEmEdicao = null;
  }

  salvarNovoInterno(): void {
    this.salvarNovo.emit(this.novoItem as T);
    this.cancelarEdicao();
  }

  removerLinha(index: number): void {
    if (confirm('Deseja excluir?')) {
      this.remover.emit(index);
    }
  }
}
