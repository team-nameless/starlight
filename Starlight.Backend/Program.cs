using System.Net;
using System.Reflection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;
using Starlight.Backend.Database.Game;
using Starlight.Backend.Service;

var builder = WebApplication.CreateBuilder(args);

// Add configuration file.
builder.Configuration
    .AddJsonFile("config.json")
    .Build();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();
builder.Services.AddHealthChecks();

builder.Services
    .AddIdentity<Player, IdentityRole>(opt =>
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
    .AddHsts(opt =>
    {
        opt.Preload = true;
        opt.IncludeSubDomains = true;
        opt.MaxAge = TimeSpan.FromDays(60);
    })
    .AddEndpointsApiExplorer()
    .AddHttpContextAccessor()
    .AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Starlight API", Version = "v1" });
        c.IncludeXmlComments(Assembly.GetExecutingAssembly());
    })
    .AddHttpsRedirection(opt =>
    {
        opt.RedirectStatusCode = StatusCodes.Status301MovedPermanently;
    })
    .AddDbContext<GameDatabaseService>()
    .AddDbContext<TrackDatabaseService>()
    .AddSingleton<IdentityEmailService>()
    .Configure<ForwardedHeadersOptions>(opt =>
    {
        opt.KnownProxies.Add(IPAddress.Parse("163.47.8.41"));
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseExceptionHandler("/api/error");
    app.UseSwagger();
    app.UseSwaggerUI();
}

app
    .UseHttpsRedirection()
    .UseForwardedHeaders(new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    })
    .UseHsts()
    .UseHealthChecks("/api/healthcheck")
    .UseRouting()
    .UseAuthorization()
    .UseAuthentication()
    .UseEndpoints(endpoints => endpoints.MapDefaultControllerRoute());
    
app.MapControllers();
app.Run();

// for creating test classes.
// DO. NOT. REMOVE.
public partial class Program { }