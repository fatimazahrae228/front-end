
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8081/api/admins';
  private http = inject(HttpClient); // Injection sans constructeur

  getEtudiantCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count/etudiants`);
  }

  getFormateurCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count/formateurs`);
  }

  getAdminCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count/admins`);
  }

  getUserCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count/users`);
  }
}
