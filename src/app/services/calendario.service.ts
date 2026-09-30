import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ano } from '../models/ano.model';
import { Mes } from '../models/mes.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class CalendarioService {

  private readonly http = inject(HttpClient);

	getAnos(): Observable<Ano[]> {
		return this.http.get<Ano[]>(`${environment.BASE_URL.calendario}anos`);
	}

	getMeses(): Observable<Mes[]> {
		return this.http.get<Mes[]>(`${environment.BASE_URL.calendario}meses`);
	}

	getMesesComResumoFinanceiro(ano: number, usuarioId: string): Observable<Mes[]> {
		return this.http.get<Mes[]>(`${environment.BASE_URL.calendario}mesesComResumoFinanceiro`,  { params: { ano, usuarioId } });
	}
}
