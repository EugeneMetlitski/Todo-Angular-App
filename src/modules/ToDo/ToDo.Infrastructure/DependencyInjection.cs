using Microsoft.Extensions.DependencyInjection;
using ToDo.Domain.Abstractions.Infrastructure;
using ToDo.Infrastructure.Repositories;

namespace ToDo.Infrastructure;

public static class DependencyInjection
{
    public static void AddInMemoryInfrastructure(this IServiceCollection services)
    {
        services.AddSingleton<IToDoRepository, InMemoryToDoRepository>();
    }
}
