using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace apiSistema.Migrations
{
    /// <inheritdoc />
    public partial class Migracao03 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TBAgendamento_TBUser_TipoUserId",
                table: "TBAgendamento");

            migrationBuilder.DropTable(
                name: "TBUser");

            migrationBuilder.RenameColumn(
                name: "TipoUserId",
                table: "TBAgendamento",
                newName: "TipoUserPacienteId");

            migrationBuilder.RenameIndex(
                name: "IX_TBAgendamento_TipoUserId",
                table: "TBAgendamento",
                newName: "IX_TBAgendamento_TipoUserPacienteId");

            migrationBuilder.CreateTable(
                name: "TBUserAdmin",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Senha = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DataNascimento = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TBUserAdmin", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TBUserPaciente",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Senha = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CPF = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DataNascimento = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TBUserPaciente", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TBUserSecretaria",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Senha = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DataNascimento = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TBUserSecretaria", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_TBAgendamento_TBUserPaciente_TipoUserPacienteId",
                table: "TBAgendamento",
                column: "TipoUserPacienteId",
                principalTable: "TBUserPaciente",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TBAgendamento_TBUserPaciente_TipoUserPacienteId",
                table: "TBAgendamento");

            migrationBuilder.DropTable(
                name: "TBUserAdmin");

            migrationBuilder.DropTable(
                name: "TBUserPaciente");

            migrationBuilder.DropTable(
                name: "TBUserSecretaria");

            migrationBuilder.RenameColumn(
                name: "TipoUserPacienteId",
                table: "TBAgendamento",
                newName: "TipoUserId");

            migrationBuilder.RenameIndex(
                name: "IX_TBAgendamento_TipoUserPacienteId",
                table: "TBAgendamento",
                newName: "IX_TBAgendamento_TipoUserId");

            migrationBuilder.CreateTable(
                name: "TBUser",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DataNascimento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Tipo = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TBUser", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_TBAgendamento_TBUser_TipoUserId",
                table: "TBAgendamento",
                column: "TipoUserId",
                principalTable: "TBUser",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
