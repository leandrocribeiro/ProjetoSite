import * as yup from "yup";

export const yupSchemaExames = yup.object({
  nome: yup
    .string()
    .min(3, "O nome deve possuir no mínimo 3 caracteres")
    .max(100, "O nome deve possuir no máximo 100 caracteres")
    .required("O nome é obrigatório"),

  descricao: yup
    .string()
    .min(3, "A descrição do exame deve ter no mínimo 3 caracteres")
    .max(200, "A descrição do exame deve possuir no máximo 200 caracteres")
    .required("A descrição do Exame é obrigatória"),

  instrucoes: yup
    .string()
    .min(3, "A instrução do exame deve ter no mínimo 3 caracteres")
    .max(200, "A instrução do exame deve possuir no máximo 200 caracteres")
    .required("A descrição do Exame é obrigatória"),

  duracaoMinutos: yup
    .number()
    .typeError("A duração deve ser um número válido")
    .integer("A duração deve ser um número inteiro")
    .positive("A duração deve ser maior que zero")
    .min(1, "O tempo mínimo de um exame deve ser de 1 minuto")
    .max(600, "O tempo máximo de um exame deve ser 600 minutos")
    .required("A duração do Exame é obrigatória"),
});
