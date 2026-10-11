import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToDoItemComponent, ToDoItem } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToDoItemComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './todo-dashboard.component.html'
})
export class ToDoDashboardComponent implements OnInit {
  todos = signal<ToDoItem[]>([]);
  newTodoTitle = '';
  isInitialLoading = signal(false);
  isAdding = signal(false);
  isUploading = signal(false);
  errorMessage = signal<string | null>(null);

  deletingIds = signal<Set<string>>(new Set());
  updatingIds = signal<Set<string>>(new Set());
  togglingIds = signal<Set<string>>(new Set());

  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.fetchTodos(true);
  }

  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  fetchTodos(initial = false) {
    if (initial) {
      this.isInitialLoading.set(true);
    }
    this.errorMessage.set(null);
    this.http.get<ToDoItem[]>('/api/todo').subscribe({
      next: (data) => {
        this.todos.set(data);
        if (initial) {
          this.isInitialLoading.set(false);
        }
      },
      error: (err: any) => {
        if (initial) {
          this.isInitialLoading.set(false);
        }
        this.errorMessage.set(`Could not load tasks: ${err.message || 'Server error'}`);
      }
    });
  }

  addTodo() {
    const title = this.newTodoTitle.trim();
    if (!title) return;
    this.isAdding.set(true);
    this.errorMessage.set(null);
    this.http.post<string>('/api/todo', { title }).subscribe({
      next: (newId) => {
        const newItem: ToDoItem = {
          id: newId,
          title,
          isCompleted: false
        };
        this.todos.update(current => [...current, newItem]);
        this.newTodoTitle = '';
        this.isAdding.set(false);
        this.showSuccess('Task added successfully');
      },
      error: (err: any) => {
        this.isAdding.set(false);
        this.errorMessage.set(`Failed to add item: ${err.message || 'Server error'}`);
      }
    });
  }

  handleToggleComplete(item: ToDoItem) {
    const newToggling = new Set(this.togglingIds());
    newToggling.add(item.id);
    this.togglingIds.set(newToggling);
    this.errorMessage.set(null);

    const updatedItem: ToDoItem = { ...item, isCompleted: !item.isCompleted };
    this.http.put('/api/todo', updatedItem).subscribe({
      next: () => {
        this.todos.update(items => items.map(t => t.id === item.id ? updatedItem : t));
        const updatedToggling = new Set(this.togglingIds());
        updatedToggling.delete(item.id);
        this.togglingIds.set(updatedToggling);
        this.showSuccess('Task updated successfully');
      },
      error: (err: any) => {
        const updatedToggling = new Set(this.togglingIds());
        updatedToggling.delete(item.id);
        this.togglingIds.set(updatedToggling);
        this.errorMessage.set(err.message || 'Server error');
      }
    });
  }

  handleUpdateTitle(event: { id: string; newTitle: string }) {
    const targetItem = this.todos().find(t => t.id === event.id);
    if (!targetItem) return;

    const newUpdating = new Set(this.updatingIds());
    newUpdating.add(event.id);
    this.updatingIds.set(newUpdating);
    this.errorMessage.set(null);

    const updatedItem: ToDoItem = { ...targetItem, title: event.newTitle };
    this.http.put('/api/todo', updatedItem).subscribe({
      next: () => {
        this.todos.update(items => items.map(t => t.id === event.id ? updatedItem : t));
        const updatedUpdating = new Set(this.updatingIds());
        updatedUpdating.delete(event.id);
        this.updatingIds.set(updatedUpdating);
        this.showSuccess('Task updated successfully');
      },
      error: (err: any) => {
        const updatedUpdating = new Set(this.updatingIds());
        updatedUpdating.delete(event.id);
        this.updatingIds.set(updatedUpdating);
        this.errorMessage.set(err.message || 'Server error');
      }
    });
  }

  deleteTodo(id: string) {
    const newDeleting = new Set(this.deletingIds());
    newDeleting.add(id);
    this.deletingIds.set(newDeleting);
    this.errorMessage.set(null);

    this.http.delete(`/api/todo/${id}`).subscribe({
      next: () => {
        this.todos.update(items => items.filter(t => t.id !== id));
        const updatedDeleting = new Set(this.deletingIds());
        updatedDeleting.delete(id);
        this.deletingIds.set(updatedDeleting);
        this.showSuccess('Task deleted successfully');
      },
      error: (err: any) => {
        const updatedDeleting = new Set(this.deletingIds());
        updatedDeleting.delete(id);
        this.deletingIds.set(updatedDeleting);
        this.errorMessage.set(err.message || 'Server error');
      }
    });
  }

  downloadJson() {
    const exportData = this.todos().map(t => ({
      id: t.id,
      title: t.title,
      isCompleted: t.isCompleted
    }));
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todos.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showSuccess('Task list exported as JSON');
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    input.value = '';

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        this.errorMessage.set('Invalid JSON format: expected an array of tasks.');
        return;
      }

      const dtos = parsed.map((item: any) => {
        if (typeof item === 'string') {
          return { title: item, isCompleted: false };
        } else if (item && typeof item === 'object') {
          return {
            id: typeof item.id === 'string' && item.id.trim() ? item.id.trim() : undefined,
            title: typeof item.title === 'string' ? item.title : String(item.title ?? ''),
            isCompleted: Boolean(item.isCompleted)
          };
        } else {
          return { title: String(item ?? ''), isCompleted: false };
        }
      }).filter(dto => dto.title.trim().length > 0);

      this.isUploading.set(true);
      this.errorMessage.set(null);
      this.http.post<ToDoItem[]>('/api/todo/replaceAll', dtos).subscribe({
        next: (updatedList) => {
          this.isUploading.set(false);
          this.todos.set(updatedList);
          this.showSuccess('Tasks uploaded and replaced successfully');
        },
        error: (err: any) => {
          this.isUploading.set(false);
          this.errorMessage.set(`Failed to upload tasks: ${err.message || 'Server error'}`);
        }
      });
    } catch (err: any) {
      this.errorMessage.set(`Failed to parse JSON file: ${err.message}`);
    }
  }
}
