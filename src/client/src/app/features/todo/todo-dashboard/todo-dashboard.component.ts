import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ToDoItemComponent, ToDoItem } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ToDoItemComponent, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './todo-dashboard.component.html'
})
export class ToDoDashboardComponent implements OnInit {
  todos = signal<ToDoItem[]>([]);
  newTodoTitle = '';
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit() { this.fetchTodos(); }

  fetchTodos() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.http.get<ToDoItem[]>('/api/todo').subscribe({
      next: (data) => {
        this.todos.set(data.sort((a, b) => a.id - b.id));
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set(`Could not load tasks: ${err.message || 'Server error'}`);
      }
    });
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return;
    this.isLoading.set(true);
    this.http.post<ToDoItem>('/api/todo', { title: this.newTodoTitle }).subscribe({
      next: () => {
        this.newTodoTitle = '';
        this.fetchTodos();
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set(`Failed to add item: ${err.message}`);
      }
    });
  }

  handleToggleComplete(item: ToDoItem) {
    this.isLoading.set(true);
    this.http.put(`/api/todo/${item.id}`, { title: item.title, isCompleted: !item.isCompleted }).subscribe({
      next: () => this.fetchTodos(),
      error: (err: any) => { this.isLoading.set(false); this.errorMessage.set(err.message); }
    });
  }

  handleUpdateTitle(event: { id: number, newTitle: string }) {
    this.isLoading.set(true);
    const targetItem = this.todos().find(t => t.id === event.id);
    if (!targetItem) return;

    this.http.put(`/api/todo/${event.id}`, { title: event.newTitle, isCompleted: targetItem.isCompleted }).subscribe({
      next: () => this.fetchTodos(),
      error: (err: any) => { this.isLoading.set(false); this.errorMessage.set(err.message); }
    });
  }

  deleteTodo(id: number) {
    this.isLoading.set(true);
    this.http.delete(`/api/todo/${id}`).subscribe({
      next: () => this.fetchTodos(),
      error: (err: any) => { this.isLoading.set(false); this.errorMessage.set(err.message); }
    });
  }
}
