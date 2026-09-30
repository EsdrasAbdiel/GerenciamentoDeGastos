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
export class ModalComponent {

}
