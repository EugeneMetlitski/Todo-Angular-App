import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    httpTesting.verify();
  });

  function setupService(): void {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  }

  it('should initialize as not logged in when localStorage has no token', () => {
    setupService();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should initialize as logged in when localStorage already has token', () => {
    localStorage.setItem('demo_token', 'existing-jwt-token');
    setupService();
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should authenticate user, store token in localStorage, and update isLoggedIn to true', () => {
    setupService();
    const token = 'sample-jwt-token';

    service.login('testuser', 'password123').subscribe(res => {
      expect(res.token).toBe(token);
    });

    const req = httpTesting.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'testuser', password: 'password123' });

    req.flush({ token });

    expect(localStorage.getItem('demo_token')).toBe(token);
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should log out user, remove token from localStorage, and update isLoggedIn to false', () => {
    localStorage.setItem('demo_token', 'existing-token');
    setupService();

    expect(service.isLoggedIn()).toBe(true);

    service.logout();

    expect(localStorage.getItem('demo_token')).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });
});
