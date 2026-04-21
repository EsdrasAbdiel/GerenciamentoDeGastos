import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);

  dashboard(id: string): Observable<any> {
    return this.http.get<any>(`${environment.BASE_URL.dashboard}`, { params: { id } });
  }
}
