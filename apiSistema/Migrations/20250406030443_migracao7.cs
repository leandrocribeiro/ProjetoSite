using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace apiSistema.Migrations
{
    /// <inheritdoc />
    public partial class migracao7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Senha",
                table: "TBUserSecretaria",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(130)",
                oldMaxLength: 130);

            migrationBuilder.AlterColumn<string>(
                name: "Senha",
                table: "TBUserPaciente",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(130)",
                oldMaxLength: 130);

            migrationBuilder.AlterColumn<string>(
                name: "Senha",
                table: "TBUserAdmin",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(130)",
                oldMaxLength: 130);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Senha",
                table: "TBUserSecretaria",
                type: "nvarchar(130)",
                maxLength: 130,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Senha",
                table: "TBUserPaciente",
                type: "nvarchar(130)",
                maxLength: 130,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Senha",
                table: "TBUserAdmin",
                type: "nvarchar(130)",
                maxLength: 130,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
