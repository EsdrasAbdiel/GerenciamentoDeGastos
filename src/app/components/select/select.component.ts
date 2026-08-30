import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export interface SelectModel {
  id: number;
  descricao: string;
  marcado?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    NgTemplateOutlet,
    CommonModule
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() opcoes: SelectModel[] = [];
  @Input() multiselect = false;
  @Input() aparecerAdicionarOpcao = false;

  @Output() adicionarNovaOpcao = new EventEmitter<void>();

  opcaoSelecionada = '';
  opcaoSelecionadaMultiselect: SelectModel[] = [];
  array: string[] = [];

  abrirModalComOpcoes = false;
  value: SelectModel | SelectModel[] | null = null;
  disabled = false;

  private onChangeFn: (value: SelectModel | SelectModel[] | null) => void = () => undefined;
  private onTouchedFn: () => void = () => undefined;

  writeValue(value: SelectModel | SelectModel[] | null): void {
    if (!value) {
      this.value = null;
      this.opcaoSelecionada = '';
      this.opcaoSelecionadaMultiselect = [];
      this.array = [];
      return;
    }

    this.value = value;

    if (Array.isArray(value)) {
      this.opcaoSelecionadaMultiselect = value;
      this.array = value.map(opcao => opcao.descricao);
      this.opcaoSelecionada = this.array.join(', ');
      return;
    }

    this.opcaoSelecionada = value.descricao;
  }

  registerOnChange(
    fn: (value: SelectModel | SelectModel[] | null) => void
  ): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectChange(value: SelectModel | 'adicionar'): void {
    if (value === 'adicionar') {
      this.adicionarNovaOpcao.emit();
      return;
    }

    this.value = value;
    this.opcaoSelecionada = value.descricao;

    this.onChangeFn(value);
    this.onTouchedFn();
  }

  aoSelecionarOpcaoDeveAparecerNoPlaceholder(
    opcao: SelectModel
  ): string {
    this.opcaoSelecionada = opcao.descricao;
    this.abrirModalComOpcoes = false;
    this.value = opcao;

    this.onChangeFn(opcao);
    this.onTouchedFn();

    return this.opcaoSelecionada;
  }

  acaoAoClicar(
    event: Event,
    opcao: SelectModel
  ): void {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;

    if (checked) {
      this.opcaoSelecionadaMultiselect.push({
        ...opcao,
        marcado: true
      });
    } else {
      this.opcaoSelecionadaMultiselect =
        this.opcaoSelecionadaMultiselect.filter(
          item => item.id !== opcao.id
        );
    }

    this.array = this.opcaoSelecionadaMultiselect.map(
      item => item.descricao
    );

    this.opcaoSelecionada = this.array.join(', ');
    this.value = this.opcaoSelecionadaMultiselect;

    this.onChangeFn(this.value);
    this.onTouchedFn();
  }
}
