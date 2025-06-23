using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()    // Permite qualquer origem
              .AllowAnyMethod()    // Permite qualquer método (GET, POST, PUT, DELETE, etc.)
              .AllowAnyHeader();   // Permite qualquer cabeçalho
    }); // Fecha a chamada do AddPolicy
});

// Add services to the container.
builder.Services.AddControllers();

#if DEBUG
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer("name=ConnectionStrings:Development"));
#else
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer("name=ConnectionStrings:Production"));
#endif

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Habilita o CORS
app.UseCors("AllowAll"); // Aplica a política CORS


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAPIKey();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
