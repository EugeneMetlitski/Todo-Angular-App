using Microsoft.AspNetCore.Mvc;

namespace ToDo.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToDoController : ControllerBase
{
    // Static in-memory list for demo purposes
    private static readonly List<ToDoItemDto> Items =
    [
        new(1, "Configure .NET 10 backend skeleton", true),
        new(2, "Scaffold Angular client with pnpm", true),
        new(3, "Connect Angular to .NET API via Proxy", false),
        new(4, "Build awesome ToDo application features", false)
    ];

    [HttpGet]
    public ActionResult<IEnumerable<ToDoItemDto>> Get() => Ok(Items);

    [HttpPost]
    public ActionResult<ToDoItemDto> Create([FromBody] CreateToDoItemDto dto)
    {
        ToDoItemDto newItem = new(Items.Count + 1, dto.Title, false);
        Items.Add(newItem);
        return CreatedAtAction(nameof(Get), newItem);
    }
}

public record ToDoItemDto(int Id, string Title, bool IsCompleted);
public record CreateToDoItemDto(string Title);
