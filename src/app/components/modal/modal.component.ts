import { Component, inject, OnInit } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';
import { MatDialog } from '@angular/material/dialog';
import { DespesasService } from '../../services/despesas.service';
import { CategoriaService } from '../../services/categoria.service';
import { FormBuilder, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';
import { ResumoFinanceiroMensalService } from '../../services/resumo-financeiro-mensal.service';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [InputComponent, SelectComponent, ɵInternalFormsSharedModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {
  private dialog = inject(MatDialog);
  private categoriaService = inject(CategoriaService);
  private fb = inject(FormBuilder);
  private despesaService = inject(DespesasService);
  private snackbar = inject(SnackbarService);
  private resumoFinanceiroMensalService = inject(ResumoFinanceiroMensalService);
  form!: FormGroup;
  opcoesCategorias: Categoria[] = []

  constructor() {
    this.inicializarForm();
  }

  ngOnInit(): void {
    this.carregarOpcoesCategorias();
  }

  inicializarForm() {
    this.form = this.fb.group({
      descricao: [null, [Validators.required]],
      categoria: [null, [Validators.required]]
    });
  }

  carregarOpcoesCategorias() {
    this.categoriaService.buscarCategorias().subscribe(
      categoria => {
        const resultado = categoria.resultado;

        this.opcoesCategorias = resultado
      }
    )
  }

  cadastrarDespesa() {
    const { descricao, categoria } = this.form.value;

    const params = {
      descricao: String(descricao),
      categoriaId: Number(categoria.id)
    };

    this.despesaService.cadastrarDespesa(params).subscribe(
      retorno => {
        if (retorno.sucesso)
          this.snackbar.success(retorno.mensagem);
        this.resumoFinanceiroMensalService.setAtualizarOpcoesDespesas(retorno.sucesso);
        this.close();
      }
    );
  }

  close() {
    this.dialog.closeAll();
  }
}
