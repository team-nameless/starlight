using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Starlight.Backend.Migrations.Game
{
    /// <inheritdoc />
    public partial class FinishingTouches : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RecentlyPlayedSong",
                table: "Players");

            migrationBuilder.AddColumn<string>(
                name: "Grade",
                table: "Scores",
                type: "varchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<ulong>(
                name: "MaxCombo",
                table: "Scores",
                type: "bigint unsigned",
                nullable: false,
                defaultValue: 0ul);

            migrationBuilder.AddColumn<string>(
                name: "TrackName",
                table: "Scores",
                type: "longtext",
                maxLength: 16384,
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Achievements",
                columns: new[] { "Id", "Detail", "FavorText", "Name" },
                values: new object[] { 1ul, "Created an account.", "It is just the beginning.", "Baby Step" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Achievements",
                keyColumn: "Id",
                keyValue: 1ul);

            migrationBuilder.DropColumn(
                name: "Grade",
                table: "Scores");

            migrationBuilder.DropColumn(
                name: "MaxCombo",
                table: "Scores");

            migrationBuilder.DropColumn(
                name: "TrackName",
                table: "Scores");

            migrationBuilder.AddColumn<ulong>(
                name: "RecentlyPlayedSong",
                table: "Players",
                type: "bigint unsigned",
                nullable: false,
                defaultValue: 0ul);
        }
    }
}
