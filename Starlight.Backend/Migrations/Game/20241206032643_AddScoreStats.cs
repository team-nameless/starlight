using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Starlight.Backend.Migrations.Game
{
    /// <inheritdoc />
    public partial class AddScoreStats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<ulong>(
                name: "Bad",
                table: "Scores",
                type: "bigint unsigned",
                nullable: false,
                defaultValue: 0ul);

            migrationBuilder.AddColumn<ulong>(
                name: "Critical",
                table: "Scores",
                type: "bigint unsigned",
                nullable: false,
                defaultValue: 0ul);

            migrationBuilder.AddColumn<ulong>(
                name: "Good",
                table: "Scores",
                type: "bigint unsigned",
                nullable: false,
                defaultValue: 0ul);

            migrationBuilder.AddColumn<ulong>(
                name: "Miss",
                table: "Scores",
                type: "bigint unsigned",
                nullable: false,
                defaultValue: 0ul);

            migrationBuilder.AddColumn<ulong>(
                name: "Perfect",
                table: "Scores",
                type: "bigint unsigned",
                nullable: false,
                defaultValue: 0ul);

            migrationBuilder.AddColumn<string>(
                name: "RawJson",
                table: "Scores",
                type: "longtext",
                maxLength: 2147483647,
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Bad",
                table: "Scores");

            migrationBuilder.DropColumn(
                name: "Critical",
                table: "Scores");

            migrationBuilder.DropColumn(
                name: "Good",
                table: "Scores");

            migrationBuilder.DropColumn(
                name: "Miss",
                table: "Scores");

            migrationBuilder.DropColumn(
                name: "Perfect",
                table: "Scores");

            migrationBuilder.DropColumn(
                name: "RawJson",
                table: "Scores");
        }
    }
}
