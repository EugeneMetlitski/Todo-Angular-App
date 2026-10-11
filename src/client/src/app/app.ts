import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/auth.service';
import { LoginComponent } from './auth/login.component';
import { ToDoDashboardComponent } from './todo/todo-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent, ToDoDashboardComponent],
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
