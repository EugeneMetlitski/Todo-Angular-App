import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ToDoItem {
  id: number;
  title: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition">

      <!-- VIEW MODE / EDIT MODE TOGGLE -->
      <div class="flex-1 mr-4">
        <div *ngIf="!isEditing()" class="flex items-center space-x-3">
          <input type="checkbox" [checked]="item().isCompleted" (change)="toggleComplete.emit(item())" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer">
          <span [class.line-through]="item().isCompleted" [class.text-gray-400]="item().isCompleted" class="text-gray-700 font-medium break-all">
            {{ item().title }}
          </span>
        </div>

        <div *ngIf="isEditing()" class="flex items-center space-x-2">
          <input type="text" [(ngModel)]="editTitle" class="flex-1 px-3 py-1 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm">
          <button (click)="saveEdit()" class="bg-blue-600 text-white text-xs px-2.5 py-1.5 rounded-md hover:bg-blue-700 font-medium">Save</button>
          <button (click)="isEditing.set(false)" class="bg-gray-200 text-gray-700 text-xs px-2.5 py-1.5 rounded-md hover:bg-gray-300 font-medium">Cancel</button>
        </div>
      </div>

      <!-- ACTION BUTTONS -->
      <div *ngIf="!isEditing()" class="flex items-center space-x-1 shrink-0">
        <button (click)="startEditing()" class="text-gray-400 hover:text-blue-500 p-1.5 rounded-lg hover:bg-blue-50 transition" title="Edit Task">✏️</button>
        <button (click)="delete.emit(item().id)" class="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition" title="Delete Task">🗑️</button>
      </div>

    </div>
  `
})
export class ToDoItemComponent {
  item = input.required<ToDoItem>();
  delete = output<number>();
  toggleComplete = output<ToDoItem>();
  updateTitle = output<{ id: number, newTitle: string }>();

  isEditing = signal(false);
  editTitle = '';

  startEditing() {
    this.editTitle = this.item().title;
    this.isEditing.set(true);
  }

  saveEdit() {
    if (!this.editTitle.trim()) return;
    this.updateTitle.emit({ id: this.item().id, newTitle: this.editTitle });
    this.isEditing.set(false);
  }
}
