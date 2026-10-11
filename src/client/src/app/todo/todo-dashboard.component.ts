import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToDoItemComponent, ToDoItem } from './todo-item.component';

@Component({
  selector: 'app-todo-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ToDoItemComponent],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-8">

      <!-- ADD FORM -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Add New Task</h2>
        <form (ngSubmit)="addTodo()" class="flex gap-2">
          <input type="text" [(ngModel)]="newTodoTitle" name="newTodoTitle" placeholder="What needs to be done?" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50" [disabled]="isLoading()">
          <button type="submit" [disabled]="isLoading() || !newTodoTitle.trim()" class="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg transition disabled:opacity-50">
            Add
          </button>
        </form>
      </div>

      <!-- ERROR ALERTS -->
      <div *ngIf="errorMessage()" class="p-4 mb-6 bg-red-50 text-red-700 rounded-xl border border-red-100 flex justify-between items-start animate-fade-in">
        <div>
          <p class="font-semibold">⚠️ Backend Connection Error</p>
          <p class="text-sm mt-0.5">{{ errorMessage() }}</p>
        </div>
        <button (click)="errorMessage.set(null)" class="text-red-400 hover:text-red-700 font-bold text-xl leading-none">×</button>
      </div>

      <!-- CENTRAL LOADING SPINNER -->
      <div *ngIf="isLoading()" class="flex flex-col items-center justify-center py-12 space-y-3">
        <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        <p class="text-gray-500 text-sm font-medium animate-pulse">Syncing changes with server...</p>
      </div>

      <!-- MAIN TASKS COLLECTION PANEL -->
      <div *ngIf="!isLoading()" class="space-y-3">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">My Tasks ({{ todos().length }})</h3>

        <div *ngIf="todos().length === 0" class="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p class="text-gray-400 font-medium">All caught up! No tasks left.</p>
        </div>

        <app-todo-item
          *ngFor="let item of todos()"
          [item]="item"
          (delete)="deleteTodo($event)"
          (toggleComplete)="handleToggleComplete($event)"
          (updateTitle)="handleUpdateTitle($event)" />
      </div>
    </div>
  `
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
        this.todos.set(data);
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
      next: (newItem) => {
        this.todos.update(current => [...current, newItem]);
        this.newTodoTitle = '';
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(`Failed to add item: ${err.error?.Message || 'Server configuration error'}`);
      }
    });
  }

  handleToggleComplete(item: ToDoItem) {
    this.isLoading.set(true);
    // Note: Since our backend currently stores everything statically in-memory,
    // we mimic updates instantly across our runtime cache.
    this.todos.update(current =>
      current.map(t => t.id === item.id ? { ...t, isCompleted: !t.isCompleted } : t)
    );
    this.isLoading.set(false);
  }

  handleUpdateTitle(event: { id: number, newTitle: string }) {
    this.isLoading.set(true);
    this.todos.update(current =>
      current.map(t => t.id === event.id ? { ...t, title: event.newTitle } : t)
    );
    this.isLoading.set(false);
  }

  deleteTodo(id: number) {
    this.isLoading.set(true);
    // Since our backend uses an in-memory list, we filter it locally for this phase.
    setTimeout(() => {
      this.todos.update(current => current.filter(item => item.id !== id));
      this.isLoading.set(false);
    }, 300);
  }
}
