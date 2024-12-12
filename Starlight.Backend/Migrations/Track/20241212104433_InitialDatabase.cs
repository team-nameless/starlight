using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

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

            migrationBuilder.InsertData(
                table: "Tracks",
                columns: new[] { "Id", "Artist", "AudioFileLocation", "BackgroundFileLocation", "DataFileLocation", "Difficulty", "DifficultyFavorText", "Duration", "NoteDesigner", "Source", "Title" },
                values: new object[,]
                {
                    { 586954ul, "AK X LYNX feat. Veela", "static/586954/AK x LYNX ft. Veela - Virtual Paradise.mp3", "static/586954/Bgparadise.jpg", "static/586954/586954.json", 2.7000000000000002, "HD", 88276ul, "Hydria", "N/A", "Virtual Paradise (Cut Ver.)" },
                    { 2128243ul, "DAOKO x Kenshi Yonezu", "static/2128243/audio.mp3", "static/2128243/bg.jpg", "static/2128243/2128243.json", 1.1000000000000001, "EZ", 87500ul, "Sympho", "打ち上げ花火、下から見るか？横から見るか？", "Uchiage Hanabi (Cut Ver.)" },
                    { 2211127ul, "Alya (CV: Uesaka Sumire)", "static/2211127/audio.ogg", "static/2211127/3.jpg", "static/2211127/2211127.json", 1.3999999999999999, "EZ", 86219ul, "keksikosu", "時々ボソッとロシア語でデレる隣のアーリャさん", "Ichiban Kagayaku Hoshi" },
                    { 2212131ul, "Alya (CV: Uesaka Sumire)", "static/2212131/chuowo.ogg", "static/2212131/alya.jpg", "static/2212131/2212131.json", 2.1000000000000001, "NM", 88518ul, "Damaree", "時々ボソッとロシア語でデレる隣のアーリャさん", "Kawaikute Gomen" }
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
