"use client";

import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
// Importação dos Componentes do yup
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { yupSchemaAgendamento } from "./yupSchemaAgendamento";
import { ListarUsers } from "@/app/(sistema)/admin/listar/apiListarUsers";
import { ListarExames } from "../listarexames/apiListarExames";
import { CadastrarAgendamentos } from "./apiCadastrarAgendamentos";

export default function Agendamento() {
  const [datapacientes, setDatapacientes] = useState([]);
  const [dataexames, setDataexames] = useState([]);
  const [busy, setBusy] = useState(true);
  const hoje = new Date();
  const hora = hoje.getHours();
  const minuto = hoje.getMinutes();
  const dia = hoje.getDay();
  const mes = hoje.getMonth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nome: "",
      tipoexame: "",
      data: "",
      hora: "",
      statusagendamento: "1",
    },
    resolver: yupResolver(yupSchemaAgendamento),
  });

  const onSubmit = async (data) => {
    const horarioCompleto = `${data.data}T${data.hora}:00`;
    const dadosFinal = {
      TipoUserPacienteId: parseInt(data.nome),
      TipoExameId: parseInt(data.tipoexame),
      Horario: horarioCompleto,
      StatusAgendamento: parseInt(data.statusagendamento),
    };

    setBusy(true);
    try {
      const resultado = await CadastrarAgendamentos(dadosFinal);
      console.log("Resultado da API:", resultado);

      if (resultado.success) {
        toast.success(
          resultado.message || "Agendamento realizado com sucesso!"
        );

        // Limpa o formulário após sucesso
        reset({
          nome: "",
          tipoexame: "",
          data: "",
          hora: "",
          statusagendamento: "1",
        });
      } else {
        toast.error(resultado.message || "Erro ao cadastrar Agendamento.");
      }
    } catch (error) {
      toast.error("Erro inesperado: " + error.message);
      console.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleReset = () => {
    reset({
      TipoUserPacienteId: "",
      TipoExameId: "",
      Horario: "",
      StatusAgendamento: "",
    });
  };

  const router = useRouter();

  async function carregarPacientes() {
    setBusy(true);
    try {
      const resultado = await ListarUsers(3); // Tipo fixo: 3 (Paciente)
      console.log("Pacientes:", resultado.data);
      if (resultado.success && resultado.data) {
        setDatapacientes(resultado.data);
      } else {
        console.error("Erro na resposta dos Pacientes:", resultado.message);
        setDatapacientes([]);
      }
    } catch (error) {
      console.error("Erro ao fazer a requisição dos Pacientes:", error);
      setDatapacientes([]);
    }
    setBusy(false);
  }

  async function carregarExames() {
    setBusy(true);
    try {
      const resultado = await ListarExames();
      console.log("Exames:", resultado.data);
      if (resultado.success && resultado.data) {
        setDataexames(resultado.data);
      } else {
        console.error("Erro na resposta dos Pacientes:", resultado.message);
        setDataexames([]);
      }
    } catch (error) {
      console.error("Erro ao fazer a requisição dos Pacientes:", error);
      setDataexames([]);
    }
    setBusy(false);
  }

  useEffect(() => {
    carregarPacientes();
    carregarExames();
  }, []);

  return (
    <div className="flex items-start justify-center bg-gray-100 pt-4 pb-8 min-h-screen">
      <div className="w-full max-w-2xl rounded-xl bg-white p-4 shadow-lg">
        <p className="text-center text-2xl font-bold text-gray-700 mb-1">
          Agendamento de Exames
        </p>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          onReset={() => reset()}
        >
          <div>
            <Label htmlFor="nome">Nome do Paciente:</Label>
            <Select id="nome" {...register("nome")}>
              <option value="">Selecione um paciente</option>
              {datapacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.nome}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="tipoexame">Tipo de Exame:</Label>
            <Select id="tipoexame" {...register("tipoexame")}>
              <option value="">Selecione o exame</option>
              {dataexames.map((exame) => (
                <option key={exame.id} value={exame.id}>
                  {exame.nome}
                </option>
              ))}
            </Select>
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
            <Label htmlFor="statusagendamento">Status do Agendamento:</Label>
            <Select id="statusagendamento" {...register("statusagendamento")}>
              <option value="">Selecione o status</option>
              <option value="1">1 - Paciente Agendado</option>
              <option value="2">2 - Paciente Compareceu e Aguardando</option>
              <option value="3">3 - Paciente Chamado para Exame</option>
              <option value="4">4 - Exame Finalizado</option>
              <option value="5">5 - Paciente Desistiu</option>
              <option value="6">6 - Paciente Faltou</option>
            </Select>
            {errors.statusagendamento && (
              <p className="text-red-500 text-sm">
                {errors.statusagendamento.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit">Salvar</Button>
            <Button
              color="light"
              type="button"
              onClick={() => {
                reset();
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
