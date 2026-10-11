using ToDo.Domain.Dto;
using ToDo.Domain.ViewModels;

namespace ToDo.Domain.Abstractions.Infrastructure;

public interface IToDoRepository
{
    Task<IReadOnlyCollection<ToDoItemView>> GetReadOnlyCollection(int userId);
    Task<ToDoItemView?> GetByIdWritable(Guid id, int userId);
    Task<Guid> Add(CreateToDoItemDto item, int userId);
    Task Update(ToDoItemView item, int userId);
    Task Delete(Guid id, int userId);
    Task ReplaceAllForUser(IEnumerable<ReplaceToDoItemDto> items, int userId);
}
