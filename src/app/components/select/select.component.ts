import { CommonModule, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export interface SelectModel {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, FormsModule, MatIconModule, NgTemplateOutlet, CommonModule],
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
  opcaoSelecionada!: string;
  opcaoSelecionadaMultiselect: any[] = []
  abrirModalComOpcoes = false;
  @Input() placeholder!: string;
  @Input() opcoes: SelectModel[] = [];
  @Input() multiselect: boolean = false
  @Input() aparecerAdicionarOpcao: boolean = false;
  @Output() adicionarNovaOpcao = new EventEmitter<void>();

  value: any;
  disabled = false;

  onChangeFn = (_: any) => {};
  onTouchedFn = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectChange(value: SelectModel | string) {
    console.log(value)

    if (value === 'adicionar') {
      this.adicionarNovaOpcao.emit();
      value = this.value ?? '';
      return;
    }


    this.value = value;
    this.onChangeFn(this.value);
    this.onTouchedFn();
  }

  aoSelecionarOpcaoDeveAparecerNoPlaceholder(opcao: SelectModel) {
    this.opcaoSelecionada = opcao.nome;
    this.abrirModalComOpcoes = !this.abrirModalComOpcoes
  }

  aoSelecionarOpcaoDevePermanecerAbertoModal(opcao: SelectModel) {
    this.opcaoSelecionadaMultiselect.push(opcao)
  }

  acaoAoClicar(event: any, opcao: SelectModel) {
    const checked = event.target.checked;

    if (checked) {
      this.opcaoSelecionadaMultiselect.push({...opcao, marcado: checked})
    } else {
      this.opcaoSelecionadaMultiselect = this.opcaoSelecionadaMultiselect.filter(o => o.id != opcao.id )
    }
    console.log(this.opcaoSelecionadaMultiselect);

  }

estaSelecionado(opcao: any): boolean {
  return this.opcaoSelecionadaMultiselect.some(o => o.id === opcao.id);
}
}
