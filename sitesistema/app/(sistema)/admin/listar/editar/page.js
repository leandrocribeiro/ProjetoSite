"use client";

import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Yupschema } from "./yupSchema";
import { toast } from "react-toastify";
import { ListarUserId } from "./apiListarUserId";
import { EditarUsuario } from "./apieditarUsuario";

export default function Editarusuarios() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const usuarioId = searchParams.get("id");
  const tipoParam = searchParams.get("tipo");

  const [busy, setBusy] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipo: "",
      nome: "",
      email: "",
      datanascimento: "",
      cpf: "",
      senha: "", // armazenará o hash
    },
    resolver: yupResolver(Yupschema),
  });

  useEffect(() => {
    if (usuarioId && tipoParam) {
      async function carregarUsuario() {
        const resultado = await ListarUserId(usuarioId, tipoParam);
        if (resultado.success) {
          const usuario = resultado.data;
          setTipoUsuario(tipoParam);

          reset({
            tipo: tipoParam,
            nome: usuario.nome || "",
            email: usuario.email || "",
            datanascimento: usuario.dataNascimento?.substring(0, 10) || "",
            cpf: usuario.cpf || "",
            senha: usuario.senha || "", // ← recebe hash diretamente
          });
        } else {
          toast.error("Erro ao carregar usuário: " + resultado.message);
        }
      }
      carregarUsuario();
    }
  }, [usuarioId, tipoParam, reset]);

  const onSubmit = async (data) => {
    setBusy(true);

    const payload = {
      ...data,
      id: usuarioId,
      tipo: tipoUsuario,
    };

    const resultado = await EditarUsuario(payload);

    if (resultado.success) {
      toast.success("Usuário atualizado com sucesso");
      router.back();
    } else {
      toast.error("Erro ao salvar: " + resultado.message);
    }
    setBusy(false);
  };

  const handleReset = () => {
    reset({
      tipo: tipoUsuario,
      nome: "",
      email: "",
      datanascimento: "",
      cpf: "",
      senha: "", // também limpa
    });
  };

  return (
    <div className="flex items-start justify-center bg-gray-100 pt-4 pb-8 min-h-screen">
      <div className="w-full max-w-2xl rounded-xl bg-white p-4 shadow-lg">
        <p className="text-center text-2xl font-bold text-gray-700 mb-1">
          Editar Usuário
        </p>

        {tipoUsuario && (
          <p className="text-center text-sm text-gray-600 mb-2">
            Tipo de usuário:{" "}
            {tipoUsuario === "1"
              ? "Administrador"
              : tipoUsuario === "2"
              ? "Secretaria"
              : "Paciente"}
          </p>
        )}

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          onReset={handleReset}
        >
          <div>
            <Label htmlFor="nome">Nome do Usuário:</Label>
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

          {tipoUsuario === "3" && (
            <div>
              <Label htmlFor="cpf">CPF:</Label>
              <TextInput id="cpf" type="text" {...register("cpf")} />
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

          {/* Campo de senha só com o hash, oculto ao usuário */}
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
