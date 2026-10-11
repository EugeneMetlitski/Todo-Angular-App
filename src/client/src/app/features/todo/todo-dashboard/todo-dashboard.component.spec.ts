import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { ToDoDashboardComponent } from './todo-dashboard.component';
import { ToDoItem } from '../todo-item/todo-item.component';

describe('ToDoDashboardComponent', () => {
  let component: ToDoDashboardComponent;
  let fixture: ComponentFixture<ToDoDashboardComponent>;
  let httpTesting: HttpTestingController;

  const initialItems: ToDoItem[] = [
    { id: '11111111-1111-1111-1111-111111111111', title: 'Task 1', isCompleted: false },
    { id: '22222222-2222-2222-2222-222222222222', title: 'Task 2', isCompleted: true }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoDashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ToDoDashboardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should fetch and display todos on init', () => {
    fixture.detectChanges();

    const req = httpTesting.expectOne('/api/todo');
    expect(req.request.method).toBe('GET');
    req.flush(initialItems);

    fixture.detectChanges();
    expect(component.todos().length).toBe(2);
    expect(component.todos()[0].title).toBe('Task 1');
  });

  it('should add a new todo and update list with returned Guid', () => {
    fixture.detectChanges();
    const initReq = httpTesting.expectOne('/api/todo');
    initReq.flush(initialItems);

    component.newTodoTitle = 'New Created Task';
    component.addTodo();

    const postReq = httpTesting.expectOne('/api/todo');
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body).toEqual({ title: 'New Created Task' });
    postReq.flush('33333333-3333-3333-3333-333333333333');

    expect(component.todos().length).toBe(3);
    expect(component.todos()[2]).toEqual({
      id: '33333333-3333-3333-3333-333333333333',
      title: 'New Created Task',
      isCompleted: false
    });
    expect(component.newTodoTitle).toBe('');
    expect(component.isAdding()).toBe(false);
  });

  it('should update todo on toggle complete', () => {
    fixture.detectChanges();
    const initReq = httpTesting.expectOne('/api/todo');
    initReq.flush(initialItems);

    component.handleToggleComplete(initialItems[0]);

    const putReq = httpTesting.expectOne('/api/todo');
    expect(putReq.request.method).toBe('PUT');
    expect(putReq.request.body).toEqual({
      id: initialItems[0].id,
      title: initialItems[0].title,
      isCompleted: true
    });
    putReq.flush('11111111-1111-1111-1111-111111111111');

    expect(component.todos()[0].isCompleted).toBe(true);
    expect(component.togglingIds().has(initialItems[0].id)).toBe(false);
  });

  it('should delete a todo', () => {
    fixture.detectChanges();
    const initReq = httpTesting.expectOne('/api/todo');
    initReq.flush(initialItems);

    component.deleteTodo(initialItems[0].id);

    const deleteReq = httpTesting.expectOne(`/api/todo/${initialItems[0].id}`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush(null);

    expect(component.todos().length).toBe(1);
    expect(component.todos()[0].id).toBe(initialItems[1].id);
  });

  it('should export tasks with id, title, and isCompleted', () => {
    fixture.detectChanges();
    const initReq = httpTesting.expectOne('/api/todo');
    initReq.flush(initialItems);

    const createElementSpy = vi.spyOn(document, 'createElement');
    component.downloadJson();

    expect(createElementSpy).toHaveBeenCalledWith('a');
  });

  it('should upload tasks and replace list preserving completion states', async () => {
    fixture.detectChanges();
    const initReq = httpTesting.expectOne('/api/todo');
    initReq.flush(initialItems);

    const jsonContent = JSON.stringify([
      { id: '33333333-3333-3333-3333-333333333333', title: 'Imported Task 1', isCompleted: true },
      { title: 'Imported Task 2', isCompleted: false }
    ]);
    const file = new File([jsonContent], 'test.json', { type: 'application/json' });
    const event = {
      target: {
        files: [file],
        value: ''
      }
    } as unknown as Event;

    await component.onFileSelected(event);

    const replaceReq = httpTesting.expectOne('/api/todo/replaceAll');
    expect(replaceReq.request.method).toBe('POST');
    expect(replaceReq.request.body).toEqual([
      { id: '33333333-3333-3333-3333-333333333333', title: 'Imported Task 1', isCompleted: true },
      { id: undefined, title: 'Imported Task 2', isCompleted: false }
    ]);

    const returnedList: ToDoItem[] = [
      { id: '33333333-3333-3333-3333-333333333333', title: 'Imported Task 1', isCompleted: true },
      { id: '44444444-4444-4444-4444-444444444444', title: 'Imported Task 2', isCompleted: false }
    ];
    replaceReq.flush(returnedList);

    expect(component.todos()).toEqual(returnedList);
    expect(component.isUploading()).toBe(false);
  });
});
