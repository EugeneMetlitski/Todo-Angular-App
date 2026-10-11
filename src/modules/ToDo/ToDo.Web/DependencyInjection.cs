using Microsoft.Extensions.DependencyInjection;
using ToDo.Infrastructure;
using ToDo.UseCases;

namespace ToDo.Web;

public static class DependencyInjection
{
    public static void AddToDoApp(this IServiceCollection services)
    {
        services.AddInMemoryInfrastructure();
        services.AddUseCases();
    }
}
