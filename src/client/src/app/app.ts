import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/auth.service';
import { LayoutComponent } from './core/layout/layout.component';
import { LoginComponent } from './features/auth/login.component';
import { ToDoDashboardComponent } from './features/todo/todo-dashboard/todo-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LayoutComponent, LoginComponent, ToDoDashboardComponent],
  templateUrl: './app.html'
})
export class App {
  @ViewChild('dashboard') dashboard?: ToDoDashboardComponent;

  constructor(public authService: AuthService) {}

  refreshWorkspace() {
    this.dashboard?.ngOnInit();
  }

  handleLogout() {
    this.authService.logout();
  }
}
