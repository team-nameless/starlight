using System.Net;
using System.Reflection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;
using Starlight.Backend.Database.Game;
using Starlight.Backend.Service;

var builder = WebApplication.CreateBuilder(args);

// Add configuration file.
builder.Configuration
    .AddJsonFile("config.json")
    .Build();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddHealthChecks();

builder.Services
    .AddEndpointsApiExplorer()
    .AddSwaggerGen()
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
    .AddCors(opt =>
    {
        opt.AddDefaultPolicy(conf =>
        {
            conf
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    })
    .AddEndpointsApiExplorer()
    .AddHttpContextAccessor()
    .AddSwaggerGen(opt =>
    {
        opt.SwaggerDoc("v1", new OpenApiInfo { Title = "Starlight API", Version = "v1" });
        opt.IncludeXmlComments(Assembly.GetExecutingAssembly());
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
    app.UseSwagger();
    app.UseSwaggerUI();
}

app
    .UseExceptionHandler("/api/error")
    .UseHsts()
    .UseHttpsRedirection()
    .UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "data")),
        RequestPath = "/static"
    })
    .UseRouting()
    .UseCors()
    .UseAuthorization()
    .UseAuthentication()
    .UseForwardedHeaders(new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    })
    .UseHealthChecks("/api/healthcheck")
    .UseEndpoints(endpoints => endpoints.MapDefaultControllerRoute());
    
app.MapControllers();
app.Run();

// for creating test classes.
// DO. NOT. REMOVE.
public partial class Program { }