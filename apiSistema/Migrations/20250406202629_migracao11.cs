using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace apiSistema.Migrations
{
    /// <inheritdoc />
    public partial class migracao11 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "TBUserPaciente");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "TBAgendamento",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "TBAgendamento");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "TBUserPaciente",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
