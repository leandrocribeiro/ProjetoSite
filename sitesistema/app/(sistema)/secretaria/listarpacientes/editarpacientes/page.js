"use client";

import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Yupschema } from "./yupSchema";
import { toast } from "react-toastify";
import { ListarUserId } from "./apiListarUserId";
import { EditarPaciente } from "./apieditarpaciente";

export default function Editarpacientes() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pacienteid = searchParams.get("id");

  const [busy, setBusy] = useState(false);

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
      datanascimento: "",
      cpf: "",
      senha: "",
    },
    resolver: yupResolver(Yupschema),
  });

  useEffect(() => {
    if (pacienteid) {
      async function carregarPaciente() {
        const resultado = await ListarUserId(pacienteid);
        if (resultado.success) {
          const paciente = resultado.data;

          reset({
            tipo: "3",
            nome: paciente.nome || "",
            email: paciente.email || "",
            datanascimento: paciente.dataNascimento?.substring(0, 10) || "",
            cpf: paciente.cpf || "",
            senha: paciente.senha || "", // ← recebe a senha hasheada
          });
        } else {
          toast.error("Erro ao carregar paciente: " + resultado.message);
        }
      }
      carregarPaciente();
    }
  }, [pacienteid, reset]);

  const onSubmit = async (data) => {
    setBusy(true);
    const resultado = await EditarPaciente({ ...data, id: pacienteid });

    if (resultado.success) {
      toast.success("Paciente atualizado com sucesso");
      router.back();
    } else {
      toast.error("Erro ao salvar: " + resultado.message);
    }
    setBusy(false);
  };

  const handleReset = () => {
    reset({
      tipo: "3",
      nome: "",
      email: "",
      datanascimento: "",
      cpf: "",
      senha: "",
    });
  };

  return (
    <div className="flex items-start justify-center bg-gray-100 pt-4 pb-8 min-h-screen">
      <div className="w-full max-w-2xl rounded-xl bg-white p-4 shadow-lg">
        <p className="text-center text-2xl font-bold text-gray-700 mb-1">
          Editar Paciente
        </p>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          onReset={handleReset}
        >
          <div>
            <Label htmlFor="nome">Nome do Paciente:</Label>
            <TextInput id="nome" type="text" {...register("nome")} />
            {errors.nome && (
              <p className="text-red-500 text-sm">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">E-mail:</Label>
            <TextInput id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cpf">CPF:</Label>
            <TextInput id="cpf" type="text" {...register("cpf")} />
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

          {/* Campo hidden para manter o hash da senha invisível */}
          <input type="hidden" {...register("senha")} />

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

export const dynamic = "force-dynamic";
