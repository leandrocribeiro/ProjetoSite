using Microsoft.EntityFrameworkCore;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options)
        : base(options) { }

       // para cada model mapeada a uma tabela, devemos criar
       // uma propriedade DBSet<T>, em que o tipo abstrato é a model desejada. 
      
       // public DbSet<TipoUser> TBUser { get; set; } = null!;
       
       public DbSet<TipoUserAdmin> TBUserAdmin { get; set; } = null!;
       public DbSet<TipoUserSecretaria> TBUserSecretaria { get; set; } = null!;
       public DbSet<TipoUserPaciente> TBUserPaciente { get; set; } = null!;
       public DbSet<TipoExame> TBExame { get; set; } = null!;
       public DbSet<TipoAgendamento> TBAgendamento { get; set; } = null!;

       
}


