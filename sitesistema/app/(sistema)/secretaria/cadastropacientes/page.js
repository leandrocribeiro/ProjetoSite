"use client";

import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Inserir } from "./apiSecretariaPaciente";
// Importação dos Componentes do yup
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Yupschema } from "./yupSchema";

export default function Cadastropacientes() {
  const [busy, setBusy] = useState(false);
  const handleReset = () => {
    reset({
      tipo: "3",
      nome: "",
      email: "",
      senha: "",
      datanascimento: "",
      cpf: "",
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
      tipo: "3",
      nome: "",
      email: "",
      senha: "",
      datanascimento: "",
      cpf: "",
    },
    resolver: yupResolver(Yupschema),
  });

  const onSubmit = async (data) => {
    setBusy(true);

    const resultado = await Inserir(data);

    if (resultado.success) {
      if (resultado.message !== "") toast.success(resultado.message);

      // Limpa o formulário após sucesso
      reset({
        tipo: "3",
        nome: "",
        email: "",
        senha: "",
        datanascimento: "",
        cpf: "",
      });
    } else {
      if (resultado.message !== "") toast.error(resultado.message);
    }

    setBusy(false);
  };
  const router = useRouter();

  return (
    <div className="flex items-start justify-center bg-gray-100 pt-4 pb-8 min-h-screen">
      <div className="w-full max-w-2xl rounded-xl bg-white p-4 shadow-lg">
        <p className="text-center text-2xl font-bold text-gray-700 mb-1">
          Cadastro de Pacientes
        </p>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          onReset={handleReset}
        >
          <div>
            <Label htmlFor="nome">Nome do Paciente:</Label>
            <TextInput
              id="nome"
              type="text"
              placeholder="Informe o nome completo do Paciente"
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
            <Button type="submit" disabled={busy}>
              Salvar
            </Button>
            <Button
              color="light"
              type="button"
              onClick={() => {
                handleReset();
                router.back();
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
