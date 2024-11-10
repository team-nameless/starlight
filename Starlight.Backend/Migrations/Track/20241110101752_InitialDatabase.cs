using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Starlight.Backend.Migrations.Track
{
    /// <inheritdoc />
    public partial class InitialDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tracks",
                columns: table => new
                {
                    Id = table.Column<ulong>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Artist = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Source = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    NoteDesigner = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    Difficulty = table.Column<double>(type: "REAL", nullable: false),
                    DifficultyFavorText = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Duration = table.Column<ulong>(type: "INTEGER", nullable: false),
                    DataFileLocation = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    BackgroundFileLocation = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    AudioFileLocation = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tracks", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tracks");
        }
    }
}
