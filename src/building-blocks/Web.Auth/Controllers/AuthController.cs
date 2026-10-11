using Microsoft.AspNetCore.Mvc;

namespace Web.Auth.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        if (dto is { Username: "demo", Password: "demo" })
        {
            return Ok(new
            {
                Token = "mock-jwt-token-for-demo",
                Username = "demo"
            });
        }
        return Unauthorized(new
        {
            Message = "Invalid username or password"
        });
    }
}

public record LoginDto(string Username, string Password);
