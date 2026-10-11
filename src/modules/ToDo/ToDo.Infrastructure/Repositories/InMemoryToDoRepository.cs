using System.Collections.Concurrent;
using ToDo.Domain.Abstractions.Infrastructure;
using ToDo.Domain.Dto;
using ToDo.Domain.ViewModels;

namespace ToDo.Infrastructure.Repositories;

internal sealed class InMemoryToDoRepository : IToDoRepository
{
    private readonly ConcurrentDictionary<int, List<ToDoItemView>> _items = [];

    public Task<IReadOnlyCollection<ToDoItemView>> GetReadOnlyCollection(int userId)
    {
        List<ToDoItemView> toDoCollection = _items.GetOrAdd(userId, _ => []);
        return Task.FromResult<IReadOnlyCollection<ToDoItemView>>(toDoCollection.AsReadOnly());
    }

    public Task<ToDoItemView?> GetByIdWritable(Guid id, int userId)
    {
        List<ToDoItemView> toDoCollection = _items.GetOrAdd(userId, _ => []);
        ToDoItemView? result = toDoCollection.Find(x => x.Id == id);
        return Task.FromResult(result);
    }

    public Task<Guid> Add(CreateToDoItemDto item, int userId)
    {
        List<ToDoItemView> toDoCollection = _items.GetOrAdd(userId, _ => []);
        ToDoItemView newItem = new(
            Id: Guid.NewGuid(),
            Title: item.Title,
            IsCompleted: false
        );
        lock (toDoCollection)
        {
            
            toDoCollection.Add(newItem);
        }
        return Task.FromResult(newItem.Id);
    }

    public Task Update(ToDoItemView item, int userId)
    {
        List<ToDoItemView> toDoCollection = _items.GetOrAdd(userId, _ => []);
        lock (toDoCollection)
        {
            int index = toDoCollection.FindIndex(x => x.Id == item.Id);
            if (index != -1)
            {
                toDoCollection[index] = item;
            }
        }
        return Task.CompletedTask;
    }

    public Task Delete(Guid id, int userId)
    {
        if (!_items.TryGetValue(userId, out List<ToDoItemView>? toDoCollection))
        {
            return Task.CompletedTask;
        }

        lock (toDoCollection)
        {
            toDoCollection.RemoveAll(x => x.Id == id);
        }
        return Task.CompletedTask;
    }

    public Task ReplaceAllForUser(IEnumerable<ReplaceToDoItemDto> items, int userId)
    {
        List<ToDoItemView> newItems = items
            .Select(item => new ToDoItemView(
                Id: item.Id.HasValue && item.Id.Value != Guid.Empty ? item.Id.Value : Guid.NewGuid(),
                Title: item.Title,
                IsCompleted: item.IsCompleted
            ))
            .ToList();

        _items.AddOrUpdate(userId, _ => newItems, (_, _) => newItems);
        return Task.CompletedTask;
    }
}
