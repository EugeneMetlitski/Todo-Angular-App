import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ToDoItem {
  id: number;
  title: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule, MatButtonModule, MatIconModule],
  templateUrl: './todo-item.component.html'
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
