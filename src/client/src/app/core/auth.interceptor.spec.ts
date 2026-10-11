import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.clear();
    httpTesting.verify();
  });

  it('should attach Bearer authorization header when token exists in localStorage', () => {
    localStorage.setItem('demo_token', 'sample-token-123');

    httpClient.get('/api/todo').subscribe();

    const req = httpTesting.expectOne('/api/todo');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe('Bearer sample-token-123');
    req.flush([]);
  });

  it('should not attach Authorization header when token is not present in localStorage', () => {
    httpClient.get('/api/todo').subscribe();

    const req = httpTesting.expectOne('/api/todo');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });
});
