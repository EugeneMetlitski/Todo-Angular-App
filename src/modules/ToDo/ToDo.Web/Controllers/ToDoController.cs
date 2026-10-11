using Microsoft.AspNetCore.Mvc;

namespace ToDo.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToDoController : ControllerBase
{
    // Our static in-memory list remains our server-side database for now
    private static readonly List<ToDoItemDto> Items =
    [
        new(1, "Configure .NET 10 backend skeleton", true),
        new(2, "Scaffold Angular client with pnpm", true),
        new(3, "Connect Angular to .NET API via Proxy", true),
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

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] UpdateToDoItemDto dto)
    {
        ToDoItemDto? existingItem = Items.FirstOrDefault(x => x.Id == id);
        if (existingItem == null) return NotFound();

        // Remove old item and insert updated version into our static list
        Items.Remove(existingItem);
        ToDoItemDto updatedItem = existingItem with { Title = dto.Title, IsCompleted = dto.IsCompleted };
        Items.Add(updatedItem);

        return Ok(updatedItem);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        ToDoItemDto? existingItem = Items.FirstOrDefault(x => x.Id == id);
        if (existingItem == null) return NotFound();

        Items.Remove(existingItem);
        return NoContent();
    }
}

public record ToDoItemDto(int Id, string Title, bool IsCompleted);
public record CreateToDoItemDto(string Title);
public record UpdateToDoItemDto(string Title, bool IsCompleted);
