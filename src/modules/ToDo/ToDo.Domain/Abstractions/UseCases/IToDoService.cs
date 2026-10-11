using FluentResults;
using ToDo.Domain.Dto;
using ToDo.Domain.ViewModels;

namespace ToDo.Domain.Abstractions.UseCases;

public interface IToDoService
{
    Task<IReadOnlyCollection<ToDoItemView>> GetReadOnlyCollection(int userId);
    Task<IResult<Guid>> Add(CreateToDoItemDto item, int userId);
    Task<IResult<Guid>> Update(UpdateToDoItemDto item, int userId);
    Task<IResult<bool>> Delete(Guid id, int userId);
    Task<IReadOnlyCollection<ToDoItemView>> ReplaceAllForUser(IEnumerable<ReplaceToDoItemDto> items, int userId);
}
