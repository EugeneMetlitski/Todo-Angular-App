namespace ToDo.Domain.Dto;

public record ReplaceToDoItemDto(
    Guid? Id,
    string Title,
    bool IsCompleted = false
);
