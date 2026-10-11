import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { App } from './app';
import { AuthService } from './core/auth.service';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let app: App;
  let mockAuthService: {
    isLoggedIn: ReturnType<typeof signal<boolean>>;
    logout: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockAuthService = {
      isLoggedIn: signal(false),
      logout: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should render toolbar with app title', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-toolbar')?.textContent).toContain('To do app');
  });

  it('should display login component when user is not logged in', () => {
    mockAuthService.isLoggedIn.set(false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-login')).toBeTruthy();
    expect(compiled.querySelector('app-todo-dashboard')).toBeNull();
  });

  it('should display dashboard component when user is logged in', () => {
    mockAuthService.isLoggedIn.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-todo-dashboard')).toBeTruthy();
    expect(compiled.querySelector('app-login')).toBeNull();
  });

  it('should call authService.logout on handleLogout', () => {
    app.handleLogout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should call dashboard.ngOnInit on refreshWorkspace when dashboard is present', () => {
    const mockDashboard = { ngOnInit: vi.fn() };
    app.dashboard = mockDashboard as any;

    app.refreshWorkspace();

    expect(mockDashboard.ngOnInit).toHaveBeenCalled();
  });
});
