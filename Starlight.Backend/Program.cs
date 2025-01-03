using System.Net;
using System.Reflection;
using Microsoft.AspNetCore.Authentication.Cookies;
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
builder.Services
    .AddControllers()
    .AddNewtonsoftJson(x => x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
builder.Services.AddHealthChecks();

builder.Services    
    .AddHttpLogging(_ => { })
    .AddEndpointsApiExplorer()
    .AddSwaggerGen()
    .AddIdentity<Player, Role>(opt =>
    {
        // Let the FE team handle this.
        opt.Password.RequiredLength = 1;
        opt.Password.RequireDigit = false;
        opt.Password.RequireLowercase = false;
        opt.Password.RequireUppercase = false;
        opt.Password.RequireNonAlphanumeric = false;
        
        opt.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
        opt.Lockout.MaxFailedAccessAttempts = 5;
        opt.Lockout.AllowedForNewUsers = true;

        opt.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*.+-_";
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
    .AddCors()
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
    .AddSingleton<StarlightEmailService>()
    .AddSingleton(builder.Configuration)
    .ConfigureApplicationCookie(opt =>
    {
        opt.Cookie.HttpOnly = true;
        opt.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        opt.Cookie.SameSite = SameSiteMode.None;
        
        opt.ExpireTimeSpan = TimeSpan.FromHours(480);
        opt.SlidingExpiration = true;
        
        opt.Events = new CookieAuthenticationEvents
        {
            OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            }
        };
    })
    .Configure<CookiePolicyOptions>(opt =>
    {
        opt.OnAppendCookie = context =>
        {
            if (context.CookieOptions is { Secure: true, SameSite: SameSiteMode.None })
            {
                context.CookieOptions.Extensions.Add("Partitioned");
            }
        };
    })
    .Configure<ForwardedHeadersOptions>(opt =>
    {
        opt.KnownProxies.Add(IPAddress.Parse("163.47.8.41"));
    });

var app = builder.Build();

// Because this app lies behind NGINX,
// This must be run first.
app
    .UseHttpLogging()
    .UseForwardedHeaders(new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.All
    });

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (app.Environment.IsProduction())
{
    app
        .UseHsts()
        .UseHttpsRedirection();
}

app
    .UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "static")),
        RequestPath = "/static",
        // https://stackoverflow.com/questions/61152499/dotnet-core-3-1-cors-issue-when-serving-static-image-files
        OnPrepareResponse = context =>
        {
            context.Context.Response.Headers.Append("Access-Control-Allow-Origin", "*");
            context.Context.Response.Headers.Append("Access-Control-Allow-Methods", "*");
            context.Context.Response.Headers.Append("Access-Control-Allow-Headers", "*");
        }
    })
    .UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "avatars")),
        RequestPath = "/avatars",
        // https://stackoverflow.com/questions/61152499/dotnet-core-3-1-cors-issue-when-serving-static-image-files
        OnPrepareResponse = context =>
        {
            context.Context.Response.Headers.Append("Access-Control-Allow-Origin", "*");
            context.Context.Response.Headers.Append("Access-Control-Allow-Methods", "*");
            context.Context.Response.Headers.Append("Access-Control-Allow-Headers", "*");
        }
    })
    .UseRouting()
    .UseCors(policy =>
    {
        policy
            .WithOrigins(
                // React page
                "http://localhost:3000",
                "http://localhost:3001",
                "https://localhost:3000",
                "https://localhost:3001",
                
                // local API doc - http
                "http://localhost:5289",
                
                // local API doc - https
                "https://localhost:7224",
                
                // Production page
                "http://starlight.swyrin.id.vn",
                "https://starlight.swyrin.id.vn"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .Build();
    })
    .UseAuthentication()
    .UseAuthorization()
    .UseCookiePolicy()
    .UseHealthChecks("/api/healthcheck")
    .UseEndpoints(endpoints => endpoints.MapDefaultControllerRoute());
    
app.MapControllers();
app.Run();

// for creating test classes.
// DO. NOT. REMOVE.
public partial class Program { }