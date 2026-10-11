import { Component, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface ToDoItem {
  id: string;
  title: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './todo-item.component.html'
})
export class ToDoItemComponent {
  item = input.required<ToDoItem>();
  isDeleting = input<boolean>(false);
  isUpdating = input<boolean>(false);
  isToggling = input<boolean>(false);

  delete = output<string>();
  toggleComplete = output<ToDoItem>();
  updateTitle = output<{ id: string, newTitle: string }>();

  isEditing = signal(false);
  editTitle = '';

  private wasUpdating = false;

  constructor() {
    effect(() => {
      const updating = this.isUpdating();
      if (this.wasUpdating && !updating) {
        this.isEditing.set(false);
      }
      this.wasUpdating = updating;
    });
  }

  startEditing() {
    this.editTitle = this.item().title;
    this.isEditing.set(true);
  }

  saveEdit() {
    if (!this.editTitle.trim()) return;
    if (this.editTitle.trim() === this.item().title) {
      this.isEditing.set(false);
      return;
    }
    this.updateTitle.emit({ id: this.item().id, newTitle: this.editTitle.trim() });
  }
}
