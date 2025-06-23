using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace apiSistema.Migrations
{
    /// <inheritdoc />
    public partial class Migracao12 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                table: "TBAgendamento",
                newName: "StatusAgendamento");

            migrationBuilder.AddColumn<int>(
                name: "Tipo",
                table: "TBUserSecretaria",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Tipo",
                table: "TBUserPaciente",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Tipo",
                table: "TBUserAdmin",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Tipo",
                table: "TBUserSecretaria");

            migrationBuilder.DropColumn(
                name: "Tipo",
                table: "TBUserPaciente");

            migrationBuilder.DropColumn(
                name: "Tipo",
                table: "TBUserAdmin");

            migrationBuilder.RenameColumn(
                name: "StatusAgendamento",
                table: "TBAgendamento",
                newName: "Status");
        }
    }
}
