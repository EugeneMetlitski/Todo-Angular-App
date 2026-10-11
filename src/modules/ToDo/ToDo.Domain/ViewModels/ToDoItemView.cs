namespace ToDo.Domain.ViewModels;

public record ToDoItemView(
    Guid Id,
    string Title,
    bool IsCompleted
);
