using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

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
            const int userId = 1;
            string token = GenerateJwtToken(userId, dto.Username);

            return Ok(new
            {
                Token = token,
                Username = dto.Username,
                UserId = userId
            });
        }
        return Unauthorized(new
        {
            Message = "Invalid username or password"
        });
    }

    private static string GenerateJwtToken(int userId, string username)
    {
        SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(AuthConstants.SecretKey));
        SigningCredentials creds = new(key, SecurityAlgorithms.HmacSha256);

        Claim[] claims =
        [
            new(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new("userId", userId.ToString()),
            new(ClaimTypes.Name, username),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        ];

        JwtSecurityToken token = new(
            issuer: AuthConstants.Issuer,
            audience: AuthConstants.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public record LoginDto(string Username, string Password);
