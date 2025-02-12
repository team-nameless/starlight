using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Starlight.Backend.Database.Track;

namespace Starlight.Backend.Service;

public class TrackDatabaseService : DbContext
{
    public DbSet<Track> Tracks { get; set; }

    public TrackDatabaseService(DbContextOptions<TrackDatabaseService> options) : base(options)
    {
        this.Database.EnsureCreated();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(
            optionsBuilder
                .EnableDetailedErrors()
#if DEBUG
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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder
            .Entity<Track>()
            .HasData(
                new Track
                {
                    Id = 586954,
                    Title = "Virtual Paradise (Cut Ver.)",
                    Artist = "AK X LYNX feat. Veela",
                    Source = "N/A",
                    NoteDesigner = "Hydria",
                    Difficulty = 2.7,
                    DifficultyFavorText = "HD",
                    Duration = 88276,
                    DataFileLocation = "static/586954/586954.json",
                    BackgroundFileLocation = "static/586954/Bgparadise.jpg",
                    AudioFileLocation = "static/586954/AK x LYNX ft. Veela - Virtual Paradise.mp3"
                },
                new Track
                {
                    Id = 2128243,
                    Title = "Uchiage Hanabi (Cut Ver.)",
                    Artist = "DAOKO x Kenshi Yonezu",
                    Source = "打ち上げ花火、下から見るか？横から見るか？",
                    NoteDesigner = "Sympho",
                    Difficulty = 1.1,
                    DifficultyFavorText = "EZ",
                    Duration = 87500,
                    DataFileLocation = "static/2128243/2128243.json",
                    BackgroundFileLocation = "static/2128243/bg.jpg",
                    AudioFileLocation = "static/2128243/audio.mp3"
                },
                new Track
                {
                    Id = 2211127,
                    Title = "Ichiban Kagayaku Hoshi",
                    Artist = "Alya (CV: Uesaka Sumire)",
                    Source = "時々ボソッとロシア語でデレる隣のアーリャさん",
                    NoteDesigner = "keksikosu",
                    Difficulty = 1.4,
                    DifficultyFavorText = "EZ",
                    Duration = 86219,
                    DataFileLocation = "static/2211127/2211127.json",
                    BackgroundFileLocation = "static/2211127/3.jpg",
                    AudioFileLocation = "static/2211127/audio.ogg"
                },
                new Track
                {
                    Id = 2212131,
                    Title = "Kawaikute Gomen",
                    Artist = "Alya (CV: Uesaka Sumire)",
                    Source = "時々ボソッとロシア語でデレる隣のアーリャさん",
                    NoteDesigner = "Damaree",
                    Difficulty = 2.1,
                    DifficultyFavorText = "NM",
                    Duration = 88518,
                    DataFileLocation = "static/2212131/2212131.json",
                    BackgroundFileLocation = "static/2212131/alya.jpg",
                    AudioFileLocation = "static/2212131/chuowo.ogg"
                }
            );
    }
}