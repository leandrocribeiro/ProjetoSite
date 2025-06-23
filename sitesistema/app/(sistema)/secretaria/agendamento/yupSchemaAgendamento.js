import * as yup from "yup";

export const yupSchemaAgendamento = yup.object({
  nome: yup
    .number()
    .typeError("Selecione um paciente válido")
    .required("O paciente é obrigatório"),

  tipoexame: yup
    .number()
    .typeError("Selecione um exame válido")
    .required("O tipo de exame é obrigatório"),

  data: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "A data deve estar no formato YYYY-MM-DD")
    .required("A data do agendamento é obrigatória"),

  hora: yup
    .string()
    .matches(
      /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
      "A hora deve estar no formato HH:mm"
    )
    .required("A hora do agendamento é obrigatória"),

  statusagendamento: yup
    .number()
    .typeError("Selecione um status válido")
    .min(1, "O Status deve ser maior que 1")
    .max(6, "O Status deve ser menor que 6")
    .required("O status do agendamento é obrigatório"),
});
