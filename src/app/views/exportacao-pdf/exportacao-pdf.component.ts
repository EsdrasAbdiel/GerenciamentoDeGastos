import { Component } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-exportacao-pdf',
  standalone: true,
  imports: [MenuComponent, NgClass, CurrencyPipe, CommonModule],
  templateUrl: './exportacao-pdf.component.html',
  styleUrl: './exportacao-pdf.component.scss'
})
export class ExportacaoPdfComponent {
  dados: any[] = [];

constructor(private http: HttpClient) {}

onFileSelected(event: any) {

  const file = event.target.files[0];

  if (!file) {
    return;
  }

  console.log(file.type);

  if (file.type != "application/pdf") {
    alert("não é pdf");
    event.target.value = null
    return
  }

  const formData = new FormData();
  formData.append('file', file);

  this.http.post<any[]>('http://localhost:8080/api/importacaoExtrato/importar', formData)
    .subscribe(res => {
      this.dados = res;

            event.target.value = null;
    });
}

confirmar() {
  const resultado = confirm("Deseja importar esse extrato no mês X?");

  console.log(this.dados);

  if (!resultado)
    return;

  this.http.post('http://localhost:5000/api/salvar-importacao', this.dados)
    .subscribe(() => {
      console.log(this.dados);

      alert('Importado com sucesso!');

    });
}
}
