using Web.Auth.Extensions;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Call Auth configuration from building-blocks
builder.Services.AddSharedWebAuth();

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

// Inject auth pipeline middleware from building-blocks
app.UseSharedWebAuth();

app.MapControllers();
app.Run("http://localhost:5000");
