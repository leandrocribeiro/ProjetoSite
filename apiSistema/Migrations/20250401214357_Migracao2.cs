using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace apiSistema.Migrations
{
    /// <inheritdoc />
    public partial class Migracao2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duracao",
                table: "TBExame");

            migrationBuilder.AddColumn<int>(
                name: "DuracaoMinutos",
                table: "TBExame",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DuracaoMinutos",
                table: "TBExame");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "Duracao",
                table: "TBExame",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));
        }
    }
}
