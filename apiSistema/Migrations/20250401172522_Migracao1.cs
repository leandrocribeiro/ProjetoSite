using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace apiSistema.Migrations
{
    /// <inheritdoc />
    public partial class Migracao1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TBExame",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Instrucoes = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Duracao = table.Column<TimeSpan>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TBExame", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TBUser",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tipo = table.Column<int>(type: "int", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DataNascimento = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TBUser", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TBAgendamento",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TipoUserId = table.Column<int>(type: "int", nullable: false),
                    TipoExameId = table.Column<int>(type: "int", nullable: false),
                    Horario = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TBAgendamento", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TBAgendamento_TBExame_TipoExameId",
                        column: x => x.TipoExameId,
                        principalTable: "TBExame",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TBAgendamento_TBUser_TipoUserId",
                        column: x => x.TipoUserId,
                        principalTable: "TBUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TBAgendamento_TipoExameId",
                table: "TBAgendamento",
                column: "TipoExameId");

            migrationBuilder.CreateIndex(
                name: "IX_TBAgendamento_TipoUserId",
                table: "TBAgendamento",
                column: "TipoUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TBAgendamento");

            migrationBuilder.DropTable(
                name: "TBExame");

            migrationBuilder.DropTable(
                name: "TBUser");
        }
    }
}
