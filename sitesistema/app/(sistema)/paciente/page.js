"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { ListarAgendamentosCPF } from "./apiListarAgendamentosCPF";
import { EditarAgendamentoId } from "../secretaria/listaragendamentos/editaragendamentos/apiEditarAgendamentoId";

const schema = yup.object().shape({
  cpf: yup
    .string()
    .required("O CPF é obrigatório.")
    .matches(/^\d{11}$/, "O CPF deve conter exatamente 11 dígitos numéricos."),
});

function formatarCPF(cpf) {
  const numeros = cpf.replace(/\D/g, "").slice(0, 11);
  return numeros
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export default function PainelPaciente() {
  const [agendamentosFiltrados, setAgendamentosFiltrados] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [busy, setBusy] = useState(false);
  const [cpfInput, setCpfInput] = useState("");

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { cpf: "" },
    resolver: yupResolver(schema),
  });

  async function buscarPorCPF(cpfParam) {
    setBusy(true);
    try {
      const resultado = await ListarAgendamentosCPF(cpfParam);
      if (resultado.success && resultado.data) {
        const filtrados = resultado.data.filter(
          (item) =>
            item.tipoUserPaciente?.cpf?.replace(/\D/g, "") ===
            cpfParam.replace(/\D/g, "")
        );
        setAgendamentosFiltrados(filtrados);
      } else {
        setAgendamentosFiltrados([]);
      }
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setAgendamentosFiltrados([]);
    }
    setBusy(false);
  }

  async function handleConfirmarComparecimento() {
    if (!agendamentoSelecionado) return;

    const dadosAtualizados = {
      id: agendamentoSelecionado.id,
      tipoUserPacienteId: agendamentoSelecionado.tipoUserPacienteId,
      tipoExameId: agendamentoSelecionado.tipoExameId,
      horario: agendamentoSelecionado.horario,
      statusAgendamento: 2,
    };

    const resultado = await EditarAgendamentoId(dadosAtualizados);

    if (resultado.success) {
      setModalAberto(false);
      buscarPorCPF(cpfInput);
    } else {
      alert("Erro ao atualizar o agendamento: " + resultado.message);
    }
  }

  function traduzirStatus(status) {
    switch (status) {
      case 1:
        return "Agendado";
      case 2:
        return "Compareceu";
      case 3:
        return "Cancelado";
      default:
        return "Desconhecido";
    }
  }

  function handleDigito(d) {
    if (cpfInput.length < 11) setCpfInput((prev) => prev + d.toString());
  }

  function handleApagar() {
    setCpfInput((prev) => prev.slice(0, -1));
  }

  function handleLimpar() {
    setCpfInput("");
    setAgendamentosFiltrados([]);
    reset();
  }

  return (
    <div className="flex items-start justify-center bg-gray-100 pt-4 pb-8 min-h-screen text-sm">
      <div className="w-full max-w-4xl rounded-xl bg-white p-4 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
          Painel do Paciente
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            buscarPorCPF(cpfInput);
          }}
          className="mb-6 flex flex-col items-center gap-3"
        >
          <div className="flex flex-col items-center">
            <Label htmlFor="cpf" className="font-semibold mb-1">
              Digite seu CPF:
            </Label>
            <input
              type="text"
              id="cpf"
              value={formatarCPF(cpfInput)}
              readOnly
              className="text-center border rounded px-4 py-2 text-lg tracking-widest w-64 bg-gray-50"
            />
            {errors.cpf && (
              <p className="text-red-500 text-xs mt-1">{errors.cpf.message}</p>
            )}
          </div>

          {/* Teclado numérico */}
          <div className="grid grid-cols-3 gap-2 w-64">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleDigito(num)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xl py-1.5 rounded"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleApagar}
              className="bg-yellow-500 hover:bg-yellow-600 text-white text-xl py-1.5 rounded"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => handleDigito(0)}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xl py-1.5 rounded"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleLimpar}
              className="bg-red-500 hover:bg-red-600 text-white text-xl py-1.5 rounded"
            >
              Limpar
            </button>
          </div>

          {/* Botão Buscar com largura total */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold w-64 py-2 rounded mt-2"
          >
            Buscar
          </button>
        </form>

        {busy ? (
          <div className="text-center py-5">Carregando...</div>
        ) : agendamentosFiltrados.length > 0 ? (
          <Table striped hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>Paciente</TableHeadCell>
                <TableHeadCell>Exame</TableHeadCell>
                <TableHeadCell>Data</TableHeadCell>
                <TableHeadCell>Hora</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Ações</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {agendamentosFiltrados.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.tipoUserPaciente?.nome}</TableCell>
                  <TableCell>{item.tipoExame?.nome}</TableCell>
                  <TableCell>
                    {new Date(item.horario).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    {new Date(item.horario).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    {traduzirStatus(item.statusAgendamento)}
                  </TableCell>
                  <TableCell>
                    {item.statusAgendamento === 1 && (
                      <Button
                        size="xs"
                        onClick={() => {
                          setAgendamentoSelecionado(item);
                          setModalAberto(true);
                        }}
                      >
                        Confirmar Presença
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center">Nenhum agendamento encontrado.</p>
        )}

        <Modal show={modalAberto} onClose={() => setModalAberto(false)}>
          <ModalHeader>Confirmar Comparecimento</ModalHeader>
          <ModalBody>
            Tem certeza que deseja confirmar o comparecimento do paciente{" "}
            <strong>{agendamentoSelecionado?.tipoUserPaciente?.nome}</strong>?
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleConfirmarComparecimento}>Confirmar</Button>
            <Button color="gray" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
