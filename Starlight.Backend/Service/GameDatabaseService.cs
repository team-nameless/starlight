using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Starlight.Backend.Database.Game;

namespace Starlight.Backend.Service;

public class GameDatabaseService : DbContext
{
    public DbSet<Score> Scores { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<UserSetting> Settings { get; set; }
    
    public GameDatabaseService(DbContextOptions<GameDatabaseService> options) : base(options)
    {
    }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(
            optionsBuilder
#if DEBUG
                .EnableDetailedErrors()
                .EnableSensitiveDataLogging()
                .UseSqlite(
                    new SqliteConnection("Filename=Starlight.testing.db;"),
                    opt =>
                    {
                        opt.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                    }
                )
#else
                // TODO: ASK THE PROJECT MANAGER!!!!!
                .UseMySql(ServerVersion.AutoDetect(""))
#endif
        );
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasOne(u => u.Setting)
            .WithOne(s => s.User)
            .HasForeignKey<UserSetting>();
    }
}