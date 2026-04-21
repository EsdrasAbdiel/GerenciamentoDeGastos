import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Despesa } from '../models/despesa.model';

type PostDespesa = {
  descricao: string;
  categoriaId: number;
}

@Injectable({
  providedIn: 'root'
})
export class DespesasService {

  private http = inject(HttpClient)

  buscarDespesas(): Observable<Despesa[]> {
    return this.http.get<Despesa[]>(`${environment.BASE_URL.despesas}`)
  }

  cadastrarDespesa(params: PostDespesa): Observable<any> {
    return this.http.post<any>(`${environment.BASE_URL.despesas}`, params)
  }
}
