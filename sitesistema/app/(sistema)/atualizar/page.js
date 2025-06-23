"use client";

import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
// Importação dos Componentes do yup
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  tipo: yup
    .number()
    .integer("O tipo deve ser um número inteiro")
    .min(1, "O tipo deve estar entre 1 (Admin), 2 (Secretaria) e 3 (Paciente)")
    .max(3, "O tipo deve estar entre 1 (Admin), 2 (Secretaria) e 3 (Paciente)")
    .required("O tipo de usuário é obrigatório"),

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

  cpf: yup.string().when("tipo", {
    is: (tipo) => tipo !== 1 && tipo !== "1", // trata tanto número quanto string
    then: (schema) =>
      schema
        .matches(/^\d{11}$/, "CPF deve conter exatamente 11 dígitos.")
        .required("O CPF é obrigatório para cadastro de Pacientes"),
    otherwise: (schema) => schema.strip(), // remove do schema se tipo for 1
  }),

  //  cpf: yup
  //    .string()
  //   .matches(/^\d{11}$/, "CPF deve conter exatamente 11 dígitos.")
  //    .required("O CPF é obrigatório para cadastro de Pacientes"),

  datanascimento: yup
    .date()
    .typeError("A data de nascimento deve estar no formato válido (YYYY-MM-DD)")
    .required("A data de nascimento é obrigatória"),
});

export default function Cadastrar() {
  const [dados, setDados] = useState({
    tipo: "",
    nome: "",
    email: "",
    senha: "",
    datanascimento: "",
    cpf: "", // Usado para Pacientes
  });

  const handleReset = () => {
    setDados({
      tipo: "",
      nome: "",
      email: "",
      senha: "",
      datanascimento: "",
      cpf: "", // Usado para Pacientes
    });
  };

  const handleChange = (event) => {
    setDados((dados) => ({
      ...dados,
      [event.target.name]: event.target.value,
    }));
    console.log(event);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipo: "",
      nome: "",
      email: "",
      senha: "",
      datanascimento: "",
      cpf: "", // Usado para Pacientes
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Dados do formulário:", data);
  };

  const router = useRouter();

  return (
    <div className="flex items-start justify-center bg-gray-100 pt-4 pb-8 min-h-screen">
      <div className="w-full max-w-2xl rounded-xl bg-white p-4 shadow-lg">
        <p className="text-center text-2xl font-bold text-gray-700 mb-1">
          Atualização de Usuários
        </p>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          onReset={handleReset}
        >
          <div>
            <Label htmlFor="ddlTipo">Tipo de Usuário:</Label>
            <Select
              id="ddlTipo"
              {...register("tipo")}
              onChange={(e) => {
                handleChange(e);
                reset({
                  tipo: e.target.value,
                  nome: "",
                  email: "",
                  senha: "",
                  datanascimento: "",
                  cpf: "",
                });
              }}
              name="tipo"
            >
              <option value="" disabled>
                [Escolha]
              </option>
              <option value={1}>Administrador</option>
              <option value={2}>Secretaria</option>
              <option value={3}>Paciente</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="nome">Nome do Usuário:</Label>
            <TextInput
              id="nome"
              type="text"
              placeholder="Informe o nome completo"
              {...register("nome")}
            />
            {errors.nome && (
              <p className="text-red-500 text-sm">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">E-mail:</Label>
            <TextInput
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="senha">Senha:</Label>
            <TextInput
              id="senha"
              type="password"
              placeholder="Informe a senha"
              {...register("senha")}
            />
            {errors.senha && (
              <p className="text-red-500 text-sm">{errors.senha.message}</p>
            )}
          </div>

          {dados.tipo !== "1" && (
            <div>
              <Label htmlFor="cpf">CPF:</Label>
              <TextInput
                id="cpf"
                type="text"
                placeholder="Somente números, ex: 12345678901"
                {...register("cpf")}
              />
              {errors.cpf && (
                <p className="text-red-500 text-sm">{errors.cpf.message}</p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="datanascimento">Data de Nascimento:</Label>
            <TextInput
              id="datanascimento"
              type="date"
              {...register("datanascimento")}
            />
            {errors.datanascimento && (
              <p className="text-red-500 text-sm">
                {errors.datanascimento.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit">Salvar</Button>
            <Button
              color="light"
              type="button"
              onClick={() => {
                reset(), router.back();
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
