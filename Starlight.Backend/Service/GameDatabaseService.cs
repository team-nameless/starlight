using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
// ReSharper disable once RedundantUsingDirective
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Starlight.Backend.Database.Game;

namespace Starlight.Backend.Service;

public class GameDatabaseService : IdentityDbContext<Player>
{
    public DbSet<Score> Scores { get; set; }
    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<UserSetting> Settings { get; set; }
    public DbSet<LoginTracking> LoginSessions { get; set; }
    
    // ReSharper disable once NotAccessedField.Local
    private readonly IConfiguration _configuration;
    
    public GameDatabaseService(IConfiguration configuration)
    {
        _configuration = configuration;
        
        // ReSharper disable once VirtualMemberCallInConstructor
        Database.EnsureCreated();
    }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(
            optionsBuilder
                .EnableDetailedErrors()
#if DEBUG
                .EnableSensitiveDataLogging()
#endif
#if DEBUG
                .UseSqlite(
                    new SqliteConnection("Filename=Starlight.db;"),
                    opt =>
                    {
                        opt.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                    }
                )
#else
                .UseMySql(
                    $"Server={_configuration.GetValue<string>("Database:Host")};" +
                    $"Port={_configuration.GetValue<int>("Database:Port")};" +
                    $"Database={_configuration.GetValue<string>("Database:Database")};" +
                    $"User={_configuration.GetValue<string>("Database:User")};" +
                    $"Password={_configuration.GetValue<string>("Database:Password")};",
                    MySqlServerVersion.LatestSupportedServerVersion,
                    opt =>
                    {
                        opt.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                    }
                )
#endif
        );
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        builder.Entity<Player>()
            .HasOne(u => u.Setting)
            .WithOne(s => s.Player)
            .HasForeignKey<UserSetting>();
    }
}