using FluentResults;
using Microsoft.AspNetCore.Mvc;
using ToDo.Domain.Abstractions.UseCases;
using ToDo.Domain.Dto;
using ToDo.Domain.ViewModels;
using Web.Auth.Controllers;

namespace ToDo.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToDoController(IToDoService service) : BaseController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<ToDoItemView>>> Get()
    {
        IReadOnlyCollection<ToDoItemView> result = await service.GetReadOnlyCollection(UserId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateToDoItemDto item)
    {
        IResult<Guid> result = await service.Add(item, UserId);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Errors);
    }

    [HttpPut]
    public async Task<ActionResult<Guid>> Update([FromBody] UpdateToDoItemDto item)
    {
        IResult<Guid> result = await service.Update(item, UserId);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Errors);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        IResult<bool> result = await service.Delete(id, UserId);
        return result.IsSuccess ? NoContent() : BadRequest(result.Errors);
    }

    [HttpPost("replaceAll")]
    public async Task<IActionResult> ReplaceAll([FromBody] IEnumerable<ReplaceToDoItemDto> items)
    {
        IReadOnlyCollection<ToDoItemView> result = await service.ReplaceAllForUser(items, UserId);
        return Ok(result);
    }
}
