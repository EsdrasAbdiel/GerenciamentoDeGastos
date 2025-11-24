import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from "@angular/material/card";
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule, JsonPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

export interface Gastos {
  descricao: string;
  valor: number;
  id: number;
}

@Component({
  selector: 'app-detalhes',
  imports: [MatDividerModule, MatCardModule, MatGridListModule, MatInputModule, MatFormFieldModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.scss', '../../../assets/colors.scss']
})



export class DetalhesComponent implements OnInit{

  editar = false;
  adicionar = false;
  form!: FormGroup
  array: Gastos[] = [
    {
      id: 1,
      descricao: 'Teste 01',
      valor: 10
    },
    {
      id: 2,
      descricao: 'Teste 02',
      valor: 10
    },
    {
      id: 3,
      descricao: 'Teste 03',
      valor: 10
    },
  ]
  valoresSomados!: number

  itemEmEdicao: Gastos[] = [];

  desabilitarComboEditarEDeletar = false;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.adicionar = false;
    if(this.array.length === 0) {
      this.inicializarFormGroup();
    } else {
      this.form = this.fb.group({
        descricao: this.array[0].descricao,
        valor: this.array[0].valor
      })

      this.deveSomarValoresEmReais()
    }
  }

  deveRenderizarLinhaSemDados() {
    this.adicionar = false
    this.editar = false
    this.array;
  }

  deveCancelarEdicaoComDados() {
    this.array.unshift({
      descricao: this.itemEmEdicao[0].descricao,
      valor: this.itemEmEdicao[0].valor,
      id: this.itemEmEdicao[0].id,
    })

    this.adicionar = false;
    this.editar = false;
  }

  deveEditarDadosAoConfirmar() {
    this.array.unshift(this.form.value);
    this.adicionar = false;
    this.editar = false;
    this.deveSomarValoresEmReais();
  }

  aoDeletarDeveRemoverLinha(linha: Gastos) {
    let confirmar = confirm('Deseja excluir esse resgistro');

    if (!confirmar) return;

    this.array = this.array.filter(item => item.id !== linha.id);
    this.deveSomarValoresEmReais();
  }

  deveDesabilitarComboEditarDeletar() {
    return this.adicionar || this.editar;
  }

  inicializarFormGroup() {
    this.form = this.fb.group({
      descricao: [null, [Validators.required]],
      valor: [null, [Validators.required]]
    })
  }

  aoClicarDeveVoltarParaConsulta() {
    this.router.navigate(['consulta']);
  }

  deveAdicionarMaisLinhas() {
    this.form.reset({
      descricao: [],
      valor: []
    });

    this.adicionar = true;
    this.editar = false;
  }

  aoEditarDeveAlterarLinha(linha: Gastos) {
    this.adicionar = false;
    this.editar = true;

    const item = this.array.filter(item => item.id === linha.id);
      this.form.patchValue({
        descricao: item[0].descricao,
        valor: item[0].valor,
        id: item[0].id
    })

    this.itemEmEdicao = item;

    this.array = this.array.filter(item => item.id !== linha.id);

  }

  deveMostrarDadosAoConfirmar() {
    console.log(this.form.valid)
    if (!this.form.valid) {
      alert(`Deve preencher campos 'Descricao' e/ou 'Valor'`)
      return;
    }

    const { descricao, valor } = this.form.value

    this.adicionar = false;
    this.array.push({
      descricao: descricao,
      valor: valor,
      id: 0
    })

    this.deveSomarValoresEmReais()
  }

  deveSomarValoresEmReais() {
    let valores: number[] = []
    valores = this.array.map((item: { valor: number }) => item.valor);
    console.log(valores);
    let valoresSomados = valores.reduce(function(acumulador, valorAtual) {
      return acumulador + valorAtual;
    }, 0)

    this.valoresSomados = valoresSomados

    console.log(valoresSomados)
  }

  get forms() {
    return this.form.controls
  }
}
