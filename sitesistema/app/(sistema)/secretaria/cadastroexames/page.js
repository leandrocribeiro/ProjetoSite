"use client";

import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CadastrarExames } from "./apiCadastrarExames";
import { yupResolver } from "@hookform/resolvers/yup";
import { yupSchemaExames } from "./yupSchemaExames";

export default function CadastroExames() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nome: "",
      descricao: "",
      instrucoes: "",
      duracaoMinutos: 0,
    },
    resolver: yupResolver(yupSchemaExames),
  });

  const onSubmit = async (data) => {
    setBusy(true);

    const resultado = await CadastrarExames(data);

    if (resultado.success) {
      if (resultado.message !== "") toast.success(resultado.message);

      // Limpa o formulário após sucesso
      reset({
        nome: "",
        descricao: "",
        instrucoes: "",
        duracaoMinutos: 0,
      });
    } else {
      if (resultado.message !== "") toast.error(resultado.message);
    }

    setBusy(false);
  };

  const handleReset = () => {
    reset({
      nome: "",
      descricao: "",
      instrucoes: "",
      duracaoMinutos: "",
    });
  };

  return (
    <div className="flex items-start justify-center bg-gray-100 pt-4 pb-8 min-h-screen">
      <div className="w-full max-w-2xl rounded-xl bg-white p-4 shadow-lg">
        <p className="text-center text-2xl font-bold text-gray-700 mb-1">
          Cadastro de Exames
        </p>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          onReset={handleReset}
        >
          <div>
            <Label htmlFor="nome">Nome do Exame:</Label>
            <TextInput
              id="nome"
              type="text"
              placeholder="Informe o nome do Exame"
              {...register("nome")}
            />
            {errors.nome && (
              <p className="text-red-500 text-sm">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="descricao">Descrição do Exame:</Label>
            <Textarea
              id="descricao"
              rows={3}
              placeholder="Informe a descrição do exame"
              {...register("descricao")}
            />
            {errors.descricao && (
              <p className="text-red-500 text-sm">{errors.descricao.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="instrucoes">Instruções do Exame:</Label>
            <Textarea
              id="instrucoes"
              rows={3}
              placeholder="Informe as instruções do exame"
              {...register("instrucoes")}
            />
            {errors.instrucoes && (
              <p className="text-red-500 text-sm">
                {errors.instrucoes.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="duracaoMinutos">Duração do Exame (minutos):</Label>
            <TextInput
              id="duracaoMinutos"
              type="number"
              min={1} // mínimo permitido no input
              max={600} // opcional, máximo permitido
              step={1} // incrementa de 1 em 1
              {...register("duracaoMinutos", { valueAsNumber: true })}
            />
            {errors.duracaoMinutos && (
              <p className="text-red-500 text-sm">
                {errors.duracaoMinutos.message}
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
