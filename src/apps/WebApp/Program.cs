using ToDo.Web;
using Web.Auth.Extensions;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddSharedWebAuth(); // Call Auth configuration from building-blocks

builder.Services.AddToDoApp(); // Services and Repositories for To Do app
builder.Services.AddControllers().AddApplicationPart(typeof(ToDo.Web.Controllers.ToDoController).Assembly);

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

WebApplication app = builder.Build();

app.UseRouting();
app.UseCors("DevCorsPolicy");

app.UseSharedWebAuth(); // Inject auth pipeline middleware from building-blocks

app.MapControllers();
app.Run("http://localhost:5000");
