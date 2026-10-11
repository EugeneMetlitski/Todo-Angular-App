using Microsoft.Extensions.DependencyInjection;
using ToDo.Domain.Abstractions.UseCases;
using ToDo.UseCases.Services;

namespace ToDo.UseCases;

public static class DependencyInjection
{
    public static void AddUseCases(this IServiceCollection services)
    {
        services.AddScoped<IToDoService, ToDoService>();
    }
}
