using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Starlight.Backend.Migrations.Game
{
    /// <inheritdoc />
    public partial class AddRecentPlayedSong : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<ulong>(
                name: "RecentlyPlayedSong",
                table: "Players",
                type: "bigint unsigned",
                nullable: false,
                defaultValue: 0ul);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RecentlyPlayedSong",
                table: "Players");
        }
    }
}
