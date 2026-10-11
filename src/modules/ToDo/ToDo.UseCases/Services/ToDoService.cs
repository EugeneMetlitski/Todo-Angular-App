using FluentResults;
using ToDo.Domain.Abstractions.Infrastructure;
using ToDo.Domain.Abstractions.UseCases;
using ToDo.Domain.Dto;
using ToDo.Domain.ViewModels;

namespace ToDo.UseCases.Services;

internal sealed class ToDoService(IToDoRepository repo) : IToDoService
{
    public async Task<IReadOnlyCollection<ToDoItemView>> GetReadOnlyCollection(int userId)
    {
        return await repo.GetReadOnlyCollection(userId);
    }

    public async Task<IResult<Guid>> Add(CreateToDoItemDto item, int userId)
    {
        Guid newId = await repo.Add(item, userId);
        return Result.Ok(newId);
    }

    public async Task<IResult<Guid>> Update(UpdateToDoItemDto item, int userId)
    {
        ToDoItemView? toUpdate = await repo.GetByIdWritable(item.Id, userId);
        if (toUpdate is null)
        {
            return Result.Fail<Guid>("Item not found");
        }
        ToDoItemView updated = toUpdate with { Title = item.Title, IsCompleted = item.IsCompleted };
        await repo.Update(updated, userId);
        return Result.Ok(updated.Id);
    }

    public async Task<IResult<bool>> Delete(Guid id, int userId)
    {
        ToDoItemView? toUpdate = await repo.GetByIdWritable(id, userId);
        if (toUpdate is null)
        {
            return Result.Fail<bool>("Item not found");
        }
        await repo.Delete(id, userId);
        return Result.Ok(true);
    }

    public async Task<IReadOnlyCollection<ToDoItemView>> ReplaceAllForUser(IEnumerable<ReplaceToDoItemDto> items, int userId)
    {
        await repo.ReplaceAllForUser(items, userId);
        IReadOnlyCollection<ToDoItemView> collection = await repo.GetReadOnlyCollection(userId);
        return collection;
    }
}
