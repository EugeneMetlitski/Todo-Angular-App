import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { LayoutComponent } from './layout.component';
import { AuthService } from '../auth.service';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let mockAuthService: { isLoggedIn: ReturnType<typeof signal<boolean>> };

  beforeEach(async () => {
    mockAuthService = {
      isLoggedIn: signal(false)
    };

    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create and render app title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('span')?.textContent).toContain('To do app');
  });

  it('should not show user badge and logout button when user is logged out', () => {
    mockAuthService.isLoggedIn.set(false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('demo');
    expect(compiled.querySelector('button')).toBeNull();
  });

  it('should show user badge and logout button when user is logged in', () => {
    mockAuthService.isLoggedIn.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('demo');
    const logoutBtn = compiled.querySelector('button');
    expect(logoutBtn).not.toBeNull();
    expect(logoutBtn?.textContent).toContain('Log Out');
  });

  it('should emit logout event when Log Out button is clicked', () => {
    mockAuthService.isLoggedIn.set(true);
    fixture.detectChanges();

    let logoutEmitted = false;
    component.logout.subscribe(() => {
      logoutEmitted = true;
    });

    const logoutBtn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    logoutBtn.click();

    expect(logoutEmitted).toBe(true);
  });
});
