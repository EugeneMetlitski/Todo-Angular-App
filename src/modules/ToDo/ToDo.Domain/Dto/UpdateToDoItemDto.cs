namespace ToDo.Domain.Dto;

public record UpdateToDoItemDto(
    Guid Id,
    string Title,
    bool IsCompleted
);
