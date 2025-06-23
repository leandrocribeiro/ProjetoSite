"use client";

import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { yupSchemaExames } from "../../cadastroexames/yupSchemaExames";
import { ListarExameId } from "./apiListarExameId";
import { EditarExameId } from "./apiEditarExameId";

export default function EditarExames() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const exameid = searchParams.get("id"); // pega o id do exame pela URL

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

  // Carregar dados do exame para preencher o formulário
  useEffect(() => {
    async function carregarExame() {
      if (!exameid) return;

      const resultado = await ListarExameId(exameid);
      if (resultado.success) {
        const exame = resultado.data;
        reset({
          nome: exame.nome || "",
          descricao: exame.descricao || "",
          instrucoes: exame.instrucoes || "",
          duracaoMinutos: exame.duracaoMinutos || 0,
        });
      } else {
        toast.error("Erro ao carregar exame: " + resultado.message);
      }
    }

    carregarExame();
  }, [exameid, reset]);

  const onSubmit = async (data) => {
    setBusy(true);

    // Adiciona o id para atualizar o exame correto
    const resultado = await EditarExameId({ ...data, id: exameid });

    if (resultado.success) {
      toast.success(resultado.message || "Exame atualizado com sucesso");
      router.back();
    } else {
      toast.error(resultado.message || "Erro ao atualizar exame");
    }

    setBusy(false);
  };

  const handleReset = () => {
    reset({
      nome: "",
      descricao: "",
      instrucoes: "",
      duracaoMinutos: 0,
    });
  };

  return (
    <div className="flex items-start justify-center bg-gray-100 pt-4 pb-8 min-h-screen">
      <div className="w-full max-w-2xl rounded-xl bg-white p-4 shadow-lg">
        <p className="text-center text-2xl font-bold text-gray-700 mb-1">
          Editar Exames
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
              min={1}
              max={600}
              step={1}
              {...register("duracaoMinutos", { valueAsNumber: true })}
            />
            {errors.duracaoMinutos && (
              <p className="text-red-500 text-sm">
                {errors.duracaoMinutos.message}
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
export const dynamic = "force-dynamic";
