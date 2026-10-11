using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Web.Auth.Extensions;

public static class AuthenticationExtensions
{
    // Reusable service container definitions
    public static IServiceCollection AddSharedWebAuth(this IServiceCollection services)
    {
        // Put standard JWT Bearer validation configurations here in the future.
        // For now, it registers common authentication dependencies
        return services;
    }

    // Reusable middleware pipeline wiring
    public static IApplicationBuilder UseSharedWebAuth(this IApplicationBuilder app)
    {
        app.UseAuthentication();
        app.UseAuthorization();
        return app;
    }
}
