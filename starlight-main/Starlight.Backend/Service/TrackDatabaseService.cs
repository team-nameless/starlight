using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Starlight.Backend.Database.Track;

namespace Starlight.Backend.Service;

public class TrackDatabaseService : DbContext
{
    public DbSet<Track> Tracks { get; set; }
    public DbSet<TrackSet> TrackSets { get; set; }

    public TrackDatabaseService(DbContextOptions<TrackDatabaseService> options) : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(
            optionsBuilder
#if DEBUG
                .EnableDetailedErrors()
                .EnableSensitiveDataLogging()
#endif
                .UseSqlite(
                    new SqliteConnection("Filename=Starlight.Tracks.db;"),
                    opt =>
                    {
                        opt.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                    }
                )
        );
    }
}