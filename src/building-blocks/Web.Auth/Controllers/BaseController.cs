using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Web.Auth.Controllers;

[ApiController]
public abstract class BaseController : ControllerBase
{
    protected int UserId
    {
        get
        {
            string? claimValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(claimValue, out int userId))
            {
                return userId;
            }

            throw new UnauthorizedAccessException("Valid user ID claim was not found in token.");
        }
    }
}
