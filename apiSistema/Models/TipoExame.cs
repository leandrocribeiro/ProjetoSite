using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class TipoExame
{
    [Required]// Define ID como chave primária
    public int Id { get; set; }

    [Required(ErrorMessage = "O nome do exame é obrigatório")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "O nome deve possuir entre 3 e 100 caracteres")]
    public string Nome { get; set; }

    [Required(ErrorMessage = "A descrição do exame é obrigatória")]
    [StringLength(200, MinimumLength = 3, ErrorMessage = "A descrição deve possuir entre 3 e 200 caracteres")]
    public string Descricao { get; set; }

    [Required(ErrorMessage = "As instruções do exame são obrigatórias")]
    [StringLength(200, MinimumLength = 3, ErrorMessage = "As instruções devem possuir entre 3 e 200 caracteres")]
    public string Instrucoes { get; set; }

    [Required(ErrorMessage = "A duração do exame é obrigatória")]
    [Range(1, 600, ErrorMessage = "A duração deve estar entre 1 e 600 minutos")]
    public int DuracaoMinutos { get; set; } 
    
}
