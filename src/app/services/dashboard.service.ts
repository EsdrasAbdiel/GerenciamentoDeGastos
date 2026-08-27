import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Dashboard } from '../models/dashboard.model';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {
	private http = inject(HttpClient);

	dashboard(id: string): Observable<Dashboard> {
		return this.http.get<Dashboard>(`${environment.BASE_URL.dashboard}`, { params: { id } });
	}
}
