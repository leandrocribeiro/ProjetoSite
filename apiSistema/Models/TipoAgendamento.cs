using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class TipoAgendamento
{
    [Required]// Define ID como chave primária
    public int Id { get; set; }

    // *****  Chave estrangeira para TipoUserPaciente  *****
    [Required(ErrorMessage = "Usuário do Tipo Paciente é obrigatório")]
    public int TipoUserPacienteId { get; set; }
    public TipoUserPaciente? TipoUserPaciente { get; set; }


    // *****  Chave estrangeira para TipoExame  *****
    [Required(ErrorMessage = "Tipo de Exame é obrigatório")]
    public int TipoExameId { get; set; }
    public TipoExame? TipoExame { get; set; }

    [Required(ErrorMessage = "A Data e o Horário do exame são obrigatórios")]
    [DataType(DataType.DateTime, ErrorMessage = "Data/Hora inválido")]
    public DateTime Horario { get; set; }
 

    // **********    Define o Status de Agendamento    **********
    // 0 - Status não definido                 1 - Paciente Agendado
    // 2 - Paciente Compareceu e Aguardando    3 - Paciente Chamado para Exame  
    // 4 - Exame Finalizado                    5 - Paciente Desistiu
    // 6 - Paciente Faltou

    [Required(ErrorMessage = "O status de comparecimento é obrigatório")]
    [Range(0, 6, ErrorMessage = "O Status deve estar entre 0 e 6")]
    public int StatusAgendamento { get; set; } = 1;

}

 
