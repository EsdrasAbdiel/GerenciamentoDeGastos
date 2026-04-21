import { Component, computed, inject, OnInit } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';
import { MatDialog } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';
import { DespesasService } from '../../services/despesas.service';
import { CategoriaService } from '../../services/categoria.service';
import { FormBuilder, FormGroup, ɵInternalFormsSharedModule, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';
import { ResumoFinanceiroMensalService } from '../../services/resumo-financeiro-mensal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [InputComponent, SelectComponent, ɵInternalFormsSharedModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  private dialog = inject(MatDialog);
  private categoriaService = inject(CategoriaService);
  private fb = inject(FormBuilder);
  private despesaService = inject(DespesasService);
  private snackbar = inject(SnackbarService);
  private resumoFinanceiroMensalService = inject(ResumoFinanceiroMensalService)
  form!: FormGroup;

  categorias = toSignal(this.categoriaService.buscarCategorias())
  opcoesCategorias = computed(() => this.categorias().map((i: any) => ({ id: i.id, nome: i.descricao })))

  constructor() {
    this.inicializarForm();
  }

  inicializarForm() {
    this.form = this.fb.group({
      descricao: [null, [Validators.required]],
      categoria: [null, [Validators.required]]
    })
  }

  cadastrarDespesa() {
    console.log(this.form.value);
    
    const { descricao, categoria } = this.form.value;

    const params = {
      descricao: String(descricao),
      categoriaId: Number(categoria.id)
    }

    this.despesaService.cadastrarDespesa(params).subscribe(
      retorno => {
        if (retorno.sucesso)
          this.snackbar.success(retorno.mensagem);
          this.resumoFinanceiroMensalService.setAtualizarOpcoesDespesas(retorno.sucesso);
          this.close();
      }
    )
  }

  close() {
    this.dialog.closeAll();
  }
}
