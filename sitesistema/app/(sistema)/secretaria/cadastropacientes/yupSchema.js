import * as yup from "yup";

export const Yupschema = yup.object({
  nome: yup
    .string()
    .min(3, "O nome deve possuir no mínimo 3 caracteres")
    .max(100, "O nome deve possuir no máximo 100 caracteres")
    .required("O nome é obrigatório"),

  email: yup
    .string()
    .email("O email deve ser válido")
    .required("O email é obrigatório"),

  senha: yup
    .string()
    .min(7, "A senha deve ter mais de 6 caracteres")
    .required("A senha é obrigatória"),

  cpf: yup
    .string()
    .matches(/^\d{11}$/, "CPF deve conter exatamente 11 dígitos.")
    .required("O CPF é obrigatório para cadastro de Pacientes"),

  datanascimento: yup
    .date()
    .typeError("A data de nascimento deve estar no formato válido (YYYY-MM-DD)")
    .required("A data de nascimento é obrigatória"),
});
