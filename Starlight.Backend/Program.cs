using Starlight.Backend.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();
builder.Services.AddHealthChecks();

builder.Services
    .AddRouting()
    .AddEndpointsApiExplorer()
    .AddHttpContextAccessor()
    .AddSwaggerGen()
    .AddDbContext<GameDatabaseService>()
    .AddDbContext<TrackDatabaseService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app
    .UseHealthChecks("/api/healthcheck")
    .UseHsts()
    .UseRouting()
    .UseHttpsRedirection()
    .UseEndpoints(endpoints => endpoints.MapDefaultControllerRoute());

app.MapControllers();
app.Run();

// for creating test classes.
// DO. NOT. REMOVE.
public partial class Program { }