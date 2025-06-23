using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class TipoUserPaciente
{
   [Required]// Define ID como chave primária
    public int Id { get; set; }

     // Define o Tipo de Usuário 1-Admim / 2-Secretaria / 3-Paciente
    [Range(1, 3, ErrorMessage = "O tipo deve estar entre 1 (Admin), 2 (Secretaria) e 3 (Paciente)")]
    public int Tipo { get; set; } = 3;

    [Required(ErrorMessage = "O nome é obrigatório")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "O nome deve possuir entre 3 e 100 caracteres")]
    public string Nome { get; set; }

    [Required(ErrorMessage = "O email é obrigatório")]
    [EmailAddress(ErrorMessage = "O email deve ser válido")]
    public string Email { get; set; }

    [Required]
    [MinLength(7, ErrorMessage = "A senha deve ter mais de 6 caracteres.")]
    [DataType(DataType.Password)]
    public string Senha { get; set; }

    [Required(ErrorMessage = "O CPF do Paciente é obrigatório")]
    [RegularExpression(@"^\d{11}$", ErrorMessage = "CPF deve conter exatamente 11 dígitos.")]
     public string CPF { get; set; }

    [Required(ErrorMessage = "A data de nascimento é obrigatória")]
    [DataType(DataType.Date, ErrorMessage = "A data de nascimento deve estar no formato válido (YYYY-MM-DD)")]
    public DateTime DataNascimento { get; set; }

    [NotMapped]
    public string? Token { get; set; }
}

