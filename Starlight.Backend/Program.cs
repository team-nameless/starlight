using System.Net;
using System.Reflection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;
using Starlight.Backend.Database.Game;
using Starlight.Backend.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();
builder.Services.AddHealthChecks();

builder.Services.AddIdentity<Player, IdentityRole>(
        opt =>
        {
            opt.Password.RequireDigit = false;
            opt.Password.RequireLowercase = false;
            opt.Password.RequireNonAlphanumeric = false;
            opt.Password.RequireUppercase = false;
            opt.Password.RequiredLength = 6;

            opt.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
            opt.Lockout.MaxFailedAccessAttempts = 5;
            opt.Lockout.AllowedForNewUsers = true;

            opt.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+ ";
            opt.User.RequireUniqueEmail = true;

            opt.SignIn.RequireConfirmedAccount = false;
            opt.SignIn.RequireConfirmedEmail = false;
            opt.SignIn.RequireConfirmedPhoneNumber = false;
        })
    .AddEntityFrameworkStores<GameDatabaseService>()
    .AddDefaultTokenProviders();

builder.Services
    .AddRouting()
    .AddEndpointsApiExplorer()
    .AddHttpContextAccessor()
#if DEBUG
    .AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Starlight API", Version = "v1" });
        c.IncludeXmlComments(Assembly.GetExecutingAssembly());
    })
#endif
    .AddDbContext<GameDatabaseService>()
    .AddDbContext<TrackDatabaseService>();

builder.Services.Configure<ForwardedHeadersOptions>(opt =>
{
    opt.KnownProxies.Add(IPAddress.Parse("163.47.8.41"));
});

var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app
    .UseHealthChecks("/api/healthcheck")
    .UseHsts()
    .UseRouting()
    .UseAuthorization()
    .UseAuthentication()
    .UseDeveloperExceptionPage()
    .UseEndpoints(endpoints => endpoints.MapDefaultControllerRoute());

// well, it could have been worse!
app.Services.GetRequiredService<GameDatabaseService>().Database.EnsureCreated();
app.Services.GetRequiredService<TrackDatabaseService>().Database.EnsureCreated();
    
app.MapControllers();
app.Run();

// for creating test classes.
// DO. NOT. REMOVE.
public partial class Program { }