import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { RetornoApi } from '../models/retorno-api.model';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);

  buscarCategorias(): Observable<RetornoApi<Categoria[]>> {
    return this.http.get<RetornoApi<Categoria[]>>(`${environment.BASE_URL.categorias}`);
  }
}
