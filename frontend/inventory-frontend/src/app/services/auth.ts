import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/login`,
      {
        email,
        password
      }
    );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/register`,
      user
    );
  }

  me(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  currentUser(): User | null {
    if (typeof localStorage === 'undefined') return null;
    const saved = localStorage.getItem('currentUser');
    try { return saved ? JSON.parse(saved) as User : null; } catch { this.logout(); return null; }
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') localStorage.removeItem('currentUser');
  }
}
