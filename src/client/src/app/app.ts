import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

interface ToDoItem {
  id: number;
  title: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], // Removed RouterOutlet since we aren't using routing links yet
  styleUrl: './app.scss',
  templateUrl: './app.html'
})
export class App implements OnInit {
  username = 'demo';
  password = 'demo';
  errorMessage = '';

  todos: ToDoItem[] = [];
  newTodoTitle = '';

  constructor(public authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.fetchTodos();
    }
  }

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.errorMessage = '';
        this.fetchTodos();
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || err.error?.Message || 'Authentication failed';
      }
    });
  }

  fetchTodos() {
    this.http.get<ToDoItem[]>('/api/todo').subscribe(data => this.todos = data);
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return;
    this.http.post<ToDoItem>('/api/todo', { title: this.newTodoTitle }).subscribe(newItem => {
      this.todos.push(newItem);
      this.newTodoTitle = '';
    });
  }
}
