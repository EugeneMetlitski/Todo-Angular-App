import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: { login: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceSpy = {
      login: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with initial default username and password', () => {
    expect(component).toBeTruthy();
    expect(component.username).toBe('demo');
    expect(component.password).toBe('demo');
    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBeNull();
  });

  it('should call authService.login and emit loginSuccess on successful login', () => {
    authServiceSpy.login.mockReturnValue(of({ token: 'jwt-token' }));

    let successEmitted = false;
    component.loginSuccess.subscribe(() => {
      successEmitted = true;
    });

    component.username = 'myuser';
    component.password = 'mypassword';
    component.handleLogin();

    expect(authServiceSpy.login).toHaveBeenCalledWith('myuser', 'mypassword');
    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBeNull();
    expect(successEmitted).toBe(true);
  });

  it('should display error message on login failure with error.message', () => {
    authServiceSpy.login.mockReturnValue(
      throwError(() => ({ error: { message: 'Invalid username or password' } }))
    );

    component.handleLogin();
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('Invalid username or password');

    const errorDiv = fixture.nativeElement.querySelector('div[style*="var(--mat-sys-error)"]');
    expect(fixture.nativeElement.textContent).toContain('Invalid username or password');
  });

  it('should handle error with uppercase Message and fallback error message', () => {
    authServiceSpy.login.mockReturnValue(
      throwError(() => ({ error: { Message: 'Account is locked' } }))
    );

    component.handleLogin();
    expect(component.errorMessage()).toBe('Account is locked');

    authServiceSpy.login.mockReturnValue(
      throwError(() => ({ error: {} }))
    );

    component.handleLogin();
    expect(component.errorMessage()).toBe('Invalid credentials');
  });

  it('should disable submit button while login is loading', () => {
    component.isLoading.set(true);
    fixture.detectChanges();

    const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);
    expect(submitBtn.textContent).toContain('Signing in...');
  });
});
