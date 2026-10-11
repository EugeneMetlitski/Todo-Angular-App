import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToDoItemComponent, ToDoItem } from './todo-item.component';

@Component({
  selector: 'app-todo-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ToDoItemComponent],
  templateUrl: './todo-dashboard.component.html'
})
export class ToDoDashboardComponent implements OnInit {
  todos = signal<ToDoItem[]>([]);
  newTodoTitle = '';
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTodos();
  }

  fetchTodos() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.http.get<ToDoItem[]>('/api/todo').subscribe({
      next: (data) => {
        // Sort items by ID so they stay in order when updated
        this.todos.set(data.sort((a, b) => a.id - b.id));
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(`Could not load tasks: ${err.message || 'Server error'}`);
      }
    });
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return;
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.http.post<ToDoItem>('/api/todo', { title: this.newTodoTitle }).subscribe({
      next: () => {
        this.newTodoTitle = '';
        this.fetchTodos(); // Refresh the list from backend
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(`Failed to add item: ${err.error?.Message || 'Server error'}`);
      }
    });
  }

  handleToggleComplete(item: ToDoItem) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Call PUT endpoint with updated status
    this.http.put(`/api/todo/${item.id}`, {
      title: item.title,
      isCompleted: !item.isCompleted
    }).subscribe({
      next: () => this.fetchTodos(),
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(`Failed to update task status: ${err.message}`);
      }
    });
  }

  handleUpdateTitle(event: { id: number, newTitle: string }) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Find the item to get its completion status
    const targetItem = this.todos().find(t => t.id === event.id);
    if (!targetItem) return;

    // Call PUT endpoint with updated text label
    this.http.put(`/api/todo/${event.id}`, {
      title: event.newTitle,
      isCompleted: targetItem.isCompleted
    }).subscribe({
      next: () => this.fetchTodos(),
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(`Failed to change task title: ${err.message}`);
      }
    });
  }

  deleteTodo(id: number) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Call our new HTTP DELETE endpoint on the backend
    this.http.delete(`/api/todo/${id}`).subscribe({
      next: () => this.fetchTodos(),
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(`Failed to delete task: ${err.message}`);
      }
    });
  }
}
