"use client";

import { Button, Label, TextInput, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { yupSchemaEditarAgendamento } from "./yupSchemaAgendamento";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { ListarAgendamentoId } from "./apiListarAgendamentoId";
import { EditarAgendamentoId } from "./apiEditarAgendamentoId";

export default function EditarAgendamento() {
  const [busy, setBusy] = useState(true);
  const [pacienteId, setPacienteId] = useState(null);
  const [exameId, setExameId] = useState(null);
  const [cpfPaciente, setCpfPaciente] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const agendamentoId = searchParams.get("id");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchemaEditarAgendamento),
  });

  useEffect(() => {
    async function carregarAgendamento() {
      setBusy(true);
      try {
        console.log("Buscando agendamento ID:", agendamentoId);
        const result = await ListarAgendamentoId(agendamentoId);
        if (result.success && result.data) {
          const agendamento = result.data;
          console.log("Dados do agendamento recebidos:", agendamento);

          const [data, hora] = agendamento.horario.split("T");

          setValue("id", agendamento.id);
          setValue("nomePaciente", agendamento.tipoUserPaciente.nome);
          setValue("tipoExame", agendamento.tipoExame.nome);
          setValue("data", data);
          setValue("hora", hora.substring(0, 5));
          setValue(
            "statusagendamento",
            agendamento.statusAgendamento.toString()
          );

          // IDs para o envio
          setPacienteId(agendamento.tipoUserPacienteId);
          setExameId(agendamento.tipoExameId);

          // CPF do paciente para exibir
          setCpfPaciente(agendamento.tipoUserPaciente.cpf || "");
          setValue("cpfPaciente", agendamento.tipoUserPaciente.cpf || "");
        } else {
          toast.error("Erro ao carregar dados do agendamento.");
        }
      } catch (err) {
        toast.error("Erro ao carregar agendamento: " + err.message);
      } finally {
        setBusy(false);
      }
    }

    if (agendamentoId) {
      carregarAgendamento();
    }
  }, [agendamentoId, setValue]);

  // Para garantir que os campos do schema estejam sempre atualizados
  useEffect(() => {
    if (pacienteId) setValue("nome", pacienteId);
    if (exameId) setValue("tipoexame", exameId);
  }, [pacienteId, exameId, setValue]);

  const onSubmit = async (data) => {
    console.log("Tentando enviar dados do formulário:", data);

    const dadosFinal = {
      id: agendamentoId,
      tipoUserPacienteId: pacienteId,
      tipoExameId: exameId,
      horario: `${data.data}T${data.hora}:00`,
      statusAgendamento: parseInt(data.statusagendamento),
    };

    console.log("Enviando dados para API:", dadosFinal);

    setBusy(true);
    try {
      const resultado = await EditarAgendamentoId(dadosFinal);

      if (resultado.success) {
        toast.success("Agendamento atualizado com sucesso!");
        router.push("/secretaria/listaragendamentos");
      } else {
        toast.error(resultado.message);
      }
    } catch (error) {
      toast.error("Erro inesperado: " + error.message);
    } finally {
      setBusy(false);
    }
  };

  // Para capturar erros de validação e mostrar no console e toast
  const onError = (errors) => {
    console.error("Erros de validação:", errors);
    toast.error("Preencha todos os campos obrigatórios corretamente.");
  };

  return (
    <div className="flex items-start justify-center bg-gray-100 pt-4 pb-8 min-h-screen">
      <div className="w-full max-w-2xl rounded-xl bg-white p-4 shadow-lg">
        <p className="text-center text-2xl font-bold text-gray-700 mb-1">
          Editar Agendamento de Exame
        </p>

        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="flex flex-col gap-4"
        >
          <input type="hidden" {...register("id")} />
          {/* Campos ocultos para satisfazer validação */}
          <input type="hidden" {...register("nome")} value={pacienteId ?? 0} />
          <input
            type="hidden"
            {...register("tipoexame")}
            value={exameId ?? 0}
          />
          <input
            type="hidden"
            {...register("cpfPaciente")}
            value={cpfPaciente}
          />

          <div>
            <Label>Nome do Paciente:</Label>
            <TextInput disabled {...register("nomePaciente")} />
          </div>

          <div>
            <Label>CPF do Paciente:</Label>
            <TextInput disabled value={cpfPaciente} />
          </div>

          <div>
            <Label>Tipo de Exame:</Label>
            <TextInput disabled {...register("tipoExame")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data">Data:</Label>
              <TextInput id="data" type="date" {...register("data")} />
              {errors.data && (
                <p className="text-red-500 text-sm">{errors.data.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hora">Hora:</Label>
              <TextInput id="hora" type="time" {...register("hora")} />
              {errors.hora && (
                <p className="text-red-500 text-sm">{errors.hora.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Status do Agendamento:</Label>
            <Select {...register("statusagendamento")}>
              <option value="">Selecione o status</option>
              <option value="1">1 - Paciente Agendado</option>
              <option value="2">2 - Compareceu e Aguardando</option>
              <option value="3">3 - Chamado para Exame</option>
              <option value="4">4 - Exame Finalizado</option>
              <option value="5">5 - Desistiu</option>
              <option value="6">6 - Faltou</option>
            </Select>
            {errors.statusagendamento && (
              <p className="text-red-500 text-sm">
                {errors.statusagendamento.message}
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
              onClick={() => router.back()}
              disabled={busy}
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
