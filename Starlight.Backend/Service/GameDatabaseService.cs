using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Starlight.Backend.Database.Game;

namespace Starlight.Backend.Service;

public class GameDatabaseService : IdentityDbContext<Player, Role, Guid>
{
    public DbSet<Score> Scores { get; set; }
    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<Setting> Settings { get; set; }
    
    // ReSharper disable once NotAccessedField.Local
    private readonly IConfiguration _configuration;
    
    public GameDatabaseService(IConfiguration configuration)
    {
        _configuration = configuration;
        
        this.Database.Migrate();
    }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var server = _configuration.GetValue<string>("Database:Host") ?? "localhost";
        var port = _configuration.GetValue<int>("Database:Port");
        var user = _configuration.GetValue<string>("Database:User") ?? "root";
        var password = _configuration.GetValue<string>("Database:Password") ?? "root";
        var database = _configuration.GetValue<string>("Database:Database") ?? "sys";
        
        base.OnConfiguring(
            optionsBuilder
                .EnableDetailedErrors()
#if DEBUG
                .EnableSensitiveDataLogging()
#endif
                .UseMySql(
                    $"Server={server}; Port={port}; Database={database}; User={user}; Password={password};",
                    MySqlServerVersion.LatestSupportedServerVersion
                )
        );
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Player>(entity =>
        {
            entity.ToTable("Players");
            
            entity
                .HasOne(p => p.Setting)
                .WithOne(s => s.Player)
                .HasForeignKey<Setting>();

            entity
                .HasMany(p => p.Friends)
                .WithMany()
                .UsingEntity(e => e.ToTable("Friendship"));
        });

        builder.Entity<Role>(entity => { entity.ToTable("Roles"); });
        builder.Entity<IdentityUserRole<Guid>>(entity => { entity.ToTable("PlayerRoles"); });
        builder.Entity<IdentityUserClaim<Guid>>(entity => { entity.ToTable("PlayerClaims"); });
        builder.Entity<IdentityUserLogin<Guid>>(entity => { entity.ToTable("PlayerLogins"); });
        builder.Entity<IdentityRoleClaim<Guid>>(entity => { entity.ToTable("RoleClaims"); });
        builder.Entity<IdentityUserToken<Guid>>(entity => { entity.ToTable("PlayerTokens"); });

        builder.Entity<Achievement>()
            .HasData(
                new Achievement
                {
                    Id = 1,
                    Name = "Baby Step",
                    Detail = "Created an account.",
                    FavorText = "It is just the beginning."
                }
            );
    }
}