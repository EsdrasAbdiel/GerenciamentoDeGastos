import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);

  buscarCategorias(): Observable<any> {
   return  this.http.get<any>(`${environment.BASE_URL.categorias}`)
  }
}
