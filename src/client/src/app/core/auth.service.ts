import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenSignal = signal<string | null>(localStorage.getItem('demo_token'));

  isLoggedIn = computed(() => !!this.tokenSignal());

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('/api/auth/login', { username, password }).pipe(
      tap(res => {
        localStorage.setItem('demo_token', res.token);
        this.tokenSignal.set(res.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('demo_token');
    this.tokenSignal.set(null);
  }
}
