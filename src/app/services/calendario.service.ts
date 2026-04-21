import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ano } from '../models/ano.model';
import { Mes } from '../models/mes.model';
import { environment } from '../../environment/enviroment';
import { HttpClient } from '@angular/common/http';
import { MesDashboard } from '../models/mes-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  constructor(private http: HttpClient) { }

  getAnos(): Observable<Ano[]> {
    return this.http.get<Ano[]>(environment.BASE_URL.listarAnos)
  }

  getMeses(ano: number): Observable<Mes[]> {
    return this.http.get<Mes[]>(`${environment.BASE_URL.listarMeses}`, { params: { ano } })
  }

  getMesesDashboard(): Observable<MesDashboard[]> {
    return this.http.get<MesDashboard[]>(`${environment.BASE_URL.mesesDashboard}`);
  }
}
