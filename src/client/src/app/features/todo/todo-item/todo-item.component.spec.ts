import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToDoItemComponent, ToDoItem } from './todo-item.component';

describe('ToDoItemComponent', () => {
  let component: ToDoItemComponent;
  let fixture: ComponentFixture<ToDoItemComponent>;

  const mockItem: ToDoItem = {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    title: 'Test Task',
    isCompleted: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ToDoItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', mockItem);
    fixture.detectChanges();
  });

  it('should create and render item title', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Task');
  });

  it('should emit delete with Guid string', () => {
    let deletedId = '';
    component.delete.subscribe(id => (deletedId = id));

    const deleteBtn = fixture.nativeElement.querySelector('button[title="Delete Task"]');
    deleteBtn.click();

    expect(deletedId).toBe(mockItem.id);
  });

  it('should emit updateTitle when editing and saving, staying in edit mode until update completes', () => {
    let updated: { id: string; newTitle: string } | undefined;
    component.updateTitle.subscribe(val => (updated = val));

    component.startEditing();
    fixture.detectChanges();

    component.editTitle = 'Updated Task Title';
    component.saveEdit();

    expect(updated).toEqual({
      id: mockItem.id,
      newTitle: 'Updated Task Title'
    });
    expect(component.isEditing()).toBe(true);

    fixture.componentRef.setInput('isUpdating', true);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();

    fixture.componentRef.setInput('isUpdating', false);
    fixture.detectChanges();

    expect(component.isEditing()).toBe(false);
  });

  it('should disable edit and delete buttons when isUpdating is true in view mode', () => {
    fixture.componentRef.setInput('isUpdating', true);
    fixture.detectChanges();

    const editBtn = fixture.nativeElement.querySelector('button[title="Edit Task"]');
    const deleteBtn = fixture.nativeElement.querySelector('button[title="Delete Task"]');

    expect(editBtn.disabled).toBe(true);
    expect(deleteBtn.disabled).toBe(true);
  });
});
