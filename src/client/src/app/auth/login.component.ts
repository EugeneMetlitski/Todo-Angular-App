import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 px-4">
      <div class="w-full max-w-md bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <h2 class="text-2xl font-bold text-gray-900 text-center mb-2">Welcome Back</h2>
        <p class="text-gray-500 text-sm text-center mb-6">Sign in to manage your ToDo list</p>

        <div class="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-6 border border-blue-100">
          <p class="font-semibold mb-1">💡 Sandbox Demo Account:</p>
          <p><strong>Username:</strong> demo &nbsp;|&nbsp; <strong>Password:</strong> demo</p>
        </div>

        <form (ngSubmit)="handleLogin()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" [(ngModel)]="username" name="username" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" [(ngModel)]="password" name="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" required>
          </div>

          <button type="submit" [disabled]="isLoading()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center disabled:opacity-50">
            <span *ngIf="isLoading()" class="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
            {{ isLoading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p *ngIf="errorMessage()" class="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 text-center font-medium">
          {{ errorMessage() }}
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = 'demo';
  password = 'demo';
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  loginSuccess = output<void>();

  constructor(private authService: AuthService) {}

  handleLogin() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.loginSuccess.emit();
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || err.error?.Message || 'Invalid credentials');
      }
    });
  }
}
