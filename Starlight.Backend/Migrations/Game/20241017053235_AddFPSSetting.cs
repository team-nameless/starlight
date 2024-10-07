using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Starlight.Backend.Migrations.Game
{
    /// <inheritdoc />
    public partial class AddFPSSetting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FrameRate",
                table: "Settings",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FrameRate",
                table: "Settings");
        }
    }
}
