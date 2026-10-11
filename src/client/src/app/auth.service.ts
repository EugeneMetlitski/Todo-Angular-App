import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = false;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('/api/auth/login', { username, password }).pipe(
      tap(() => this.loggedIn = true)
    );
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
