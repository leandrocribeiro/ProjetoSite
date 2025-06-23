"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeadCell,
  Label,
} from "flowbite-react";

import { ListarAgendamentos } from "../secretaria/listaragendamentos/apiListarAgendamentos";
import { useRouter } from "next/navigation";

export default function Listar() {
  const router = useRouter();
  const [dados, setDados] = useState([]);
  const [todosAgendamentos, setTodosAgendamentos] = useState([]);
  const [busy, setBusy] = useState(true);

  const [dataFiltro, setDataFiltro] = useState(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  });

  const [exameFiltro, setExameFiltro] = useState("todos");

  async function carregarTodos() {
    setBusy(true);
    try {
      const resultado = await ListarAgendamentos();
      if (resultado.success && resultado.data) {
        setTodosAgendamentos(resultado.data);
      } else {
        console.error("Erro na resposta:", resultado.message);
        setTodosAgendamentos([]);
      }
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
      setTodosAgendamentos([]);
    }
    setBusy(false);
  }

  const aplicarFiltros = useCallback(() => {
    const filtrados = todosAgendamentos.filter((item) => {
      const dataItem = new Date(item.horario);
      const dataItemFormatada = `${dataItem.getFullYear()}-${String(
        dataItem.getMonth() + 1
      ).padStart(2, "0")}-${String(dataItem.getDate()).padStart(2, "0")}`;

      const statusValido = [1, 2, 3].includes(item.statusAgendamento);
      const dataConfere = dataItemFormatada === dataFiltro;
      const exameConfere =
        exameFiltro === "todos" ||
        item.tipoExame?.id?.toString() === exameFiltro;

      return dataConfere && statusValido && exameConfere;
    });

    setDados(filtrados);
  }, [todosAgendamentos, dataFiltro, exameFiltro]);

  useEffect(() => {
    carregarTodos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [aplicarFiltros]);

  function handleDataChange(e) {
    setDataFiltro(e.target.value);
  }

  function handleExameChange(e) {
    setExameFiltro(e.target.value);
  }

  const examesDisponiveis = [
    ...new Map(
      todosAgendamentos
        .filter((item) => item.tipoExame)
        .map((item) => [item.tipoExame.id, item.tipoExame])
    ).values(),
  ];

  return (
    <div className="flex items-start justify-center bg-gray-100 pt-4 pb-8 min-h-screen text-sm">
      <div className="w-full max-w-4xl rounded-xl bg-white p-4 shadow-lg">
        <div className="flex flex-col items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Painel de Consultas:{" "}
            {exameFiltro === "todos"
              ? "Todos os Exames"
              : examesDisponiveis.find((ex) => ex.id.toString() === exameFiltro)
                  ?.nome || ""}
          </h1>

          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Filtro por Data */}
            <div className="flex items-center gap-2">
              <Label htmlFor="dataFiltro" className="font-semibold">
                Data:
              </Label>
              <input
                type="date"
                id="dataFiltro"
                value={dataFiltro}
                onChange={handleDataChange}
                className="border rounded px-2 py-1"
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>

            {/* Filtro por Exame */}
            <div className="flex items-center gap-2">
              <Label htmlFor="exameFiltro" className="font-semibold">
                Tipo de Exame:
              </Label>
              <select
                id="exameFiltro"
                value={exameFiltro}
                onChange={handleExameChange}
                className="border rounded px-2 py-1"
              >
                <option value="todos">Todos</option>
                {examesDisponiveis.map((exame) => (
                  <option key={exame.id} value={exame.id}>
                    {exame.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-2">
          {busy ? (
            <div className="flex justify-center py-5">
              <div>Carregando...</div>
            </div>
          ) : dados && dados.length > 0 ? (
            <Table striped hoverable>
              <TableHead className="text-xs">
                <TableRow>
                  <TableHeadCell>Paciente</TableHeadCell>
                  <TableHeadCell>Exame</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Data</TableHeadCell>
                  <TableHeadCell>Hora</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="text-sm">
                {dados.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.tipoUserPaciente?.nome}</TableCell>
                    <TableCell>{item.tipoExame?.nome}</TableCell>
                    <TableCell>
                      {{
                        1: "Paciente Agendado",
                        2: "Compareceu e Aguardando",
                        3: "Chamado para Exame",
                        4: "Exame Finalizado",
                        5: "Desistiu",
                        6: "Faltou",
                      }[item.statusAgendamento] || "Desconhecido"}
                    </TableCell>
                    <TableCell>
                      {new Date(item.horario).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      {new Date(item.horario).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>Não há dados disponíveis</p>
          )}
        </div>
      </div>
    </div>
  );
}
