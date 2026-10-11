using FluentAssertions;
using FluentResults;
using NSubstitute;
using ToDo.Domain.Abstractions.Infrastructure;
using ToDo.Domain.Dto;
using ToDo.Domain.ViewModels;
using ToDo.UseCases.Services;

namespace ToDo.UseCases.Tests.Services;

public class ToDoServiceTests
{
    private readonly IToDoRepository _repo = Substitute.For<IToDoRepository>();
    private readonly ToDoService _sut;

    public ToDoServiceTests()
    {
        _sut = new ToDoService(_repo);
    }

    [Fact]
    public async Task GetReadOnlyCollection_WhenCalled_ReturnsItemsForUser()
    {
        // Arrange
        const int userId = 42;
        List<ToDoItemView> expectedItems =
        [
            new(Guid.NewGuid(), "Task 1", false),
            new(Guid.NewGuid(), "Task 2", true)
        ];

        _repo.GetReadOnlyCollection(userId).Returns(expectedItems);

        // Act
        IReadOnlyCollection<ToDoItemView> result = await _sut.GetReadOnlyCollection(userId);

        // Assert
        result.Should().BeEquivalentTo(expectedItems, options => options.WithStrictOrdering());
        await _repo.Received(1).GetReadOnlyCollection(userId);
    }

    [Fact]
    public async Task GetReadOnlyCollection_WhenNoItemsExist_ReturnsEmptyCollection()
    {
        // Arrange
        const int userId = 10;
        List<ToDoItemView> emptyList = [];

        _repo.GetReadOnlyCollection(userId).Returns(emptyList);

        // Act
        IReadOnlyCollection<ToDoItemView> result = await _sut.GetReadOnlyCollection(userId);

        // Assert
        result.Should().BeEmpty();
        await _repo.Received(1).GetReadOnlyCollection(userId);
    }

    [Fact]
    public async Task Add_WhenValidItem_CallsRepositoryAndReturnsSuccessWithNewId()
    {
        // Arrange
        const int userId = 7;
        CreateToDoItemDto dto = new("New Task");
        Guid expectedId = Guid.NewGuid();

        _repo.Add(dto, userId).Returns(expectedId);

        // Act
        IResult<Guid> result = await _sut.Add(dto, userId);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be(expectedId);
        await _repo.Received(1).Add(dto, userId);
    }

    [Fact]
    public async Task Update_WhenItemExists_UpdatesItemAndReturnsSuccessWithId()
    {
        // Arrange
        const int userId = 1;
        Guid itemId = Guid.NewGuid();
        ToDoItemView existingItem = new(itemId, "Original Title", false);
        UpdateToDoItemDto updateDto = new(itemId, "Updated Title", true);

        _repo.GetByIdWritable(itemId, userId).Returns(existingItem);

        // Act
        IResult<Guid> result = await _sut.Update(updateDto, userId);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be(itemId);

        ToDoItemView expectedUpdatedItem = new(itemId, "Updated Title", true);
        await _repo.Received(1).GetByIdWritable(itemId, userId);
        await _repo.Update(expectedUpdatedItem, userId);
    }

    [Fact]
    public async Task Update_WhenItemDoesNotExist_ReturnsFailAndDoesNotCallUpdate()
    {
        // Arrange
        const int userId = 1;
        Guid itemId = Guid.NewGuid();
        UpdateToDoItemDto updateDto = new(itemId, "Updated Title", true);

        _repo.GetByIdWritable(itemId, userId).Returns((ToDoItemView?)null);

        // Act
        IResult<Guid> result = await _sut.Update(updateDto, userId);

        // Assert
        result.IsFailed.Should().BeTrue();
        result.Errors.Should().ContainSingle(e => e.Message == "Item not found");

        await _repo.Received(1).GetByIdWritable(itemId, userId);
        await _repo.DidNotReceive().Update(Arg.Any<ToDoItemView>(), Arg.Any<int>());
    }

    [Fact]
    public async Task Delete_WhenItemExists_DeletesItemAndReturnsSuccess()
    {
        // Arrange
        const int userId = 5;
        Guid itemId = Guid.NewGuid();
        ToDoItemView existingItem = new(itemId, "Task to delete", false);

        _repo.GetByIdWritable(itemId, userId).Returns(existingItem);

        // Act
        IResult<bool> result = await _sut.Delete(itemId, userId);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeTrue();

        await _repo.Received(1).GetByIdWritable(itemId, userId);
        await _repo.Received(1).Delete(itemId, userId);
    }

    [Fact]
    public async Task Delete_WhenItemDoesNotExist_ReturnsFailAndDoesNotCallDelete()
    {
        // Arrange
        const int userId = 5;
        Guid itemId = Guid.NewGuid();

        _repo.GetByIdWritable(itemId, userId).Returns((ToDoItemView?)null);

        // Act
        IResult<bool> result = await _sut.Delete(itemId, userId);

        // Assert
        result.IsFailed.Should().BeTrue();
        result.Errors.Should().ContainSingle(e => e.Message == "Item not found");

        await _repo.Received(1).GetByIdWritable(itemId, userId);
        await _repo.DidNotReceive().Delete(Arg.Any<Guid>(), Arg.Any<int>());
    }

    [Fact]
    public async Task ReplaceAllForUser_WhenCalled_ReplacesItemsAndReturnsUpdatedCollection()
    {
        // Arrange
        const int userId = 15;
        List<ReplaceToDoItemDto> replaceItems =
        [
            new(Guid.NewGuid(), "Task 1", true),
            new(null, "New Task 2", false)
        ];
        List<ToDoItemView> updatedCollection =
        [
            new(replaceItems[0].Id!.Value, "Task 1", true),
            new(Guid.NewGuid(), "New Task 2", false)
        ];

        _repo.GetReadOnlyCollection(userId).Returns(updatedCollection);

        // Act
        IReadOnlyCollection<ToDoItemView> result = await _sut.ReplaceAllForUser(replaceItems, userId);

        // Assert
        result.Should().BeEquivalentTo(updatedCollection, options => options.WithStrictOrdering());

        Received.InOrder(async () =>
        {
            await _repo.ReplaceAllForUser(replaceItems, userId);
            await _repo.GetReadOnlyCollection(userId);
        });
    }
}
