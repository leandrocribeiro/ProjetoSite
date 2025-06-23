"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeadCell,
  Button,
  Modal,
} from "flowbite-react";
import { ListarUsers } from "@/app/(sistema)/admin/listar/apiListarUsers";
import { DeletarUsers } from "@/app/(sistema)/admin/listar/apiDeletarUsers";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Listar() {
  const router = useRouter();
  const [dados, setDados] = useState([]);
  const [busy, setBusy] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  async function carregarDados() {
    setBusy(true);
    try {
      const resultado = await ListarUsers(3); // Tipo fixo: 3 (Paciente)
      if (resultado.success && resultado.data) {
        setDados(resultado.data);
      } else {
        console.error("Erro na resposta:", resultado.message);
        setDados([]);
      }
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
      setDados([]);
    }
    setBusy(false);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function confirmarExclusao(id) {
    setIdParaExcluir(id);
    setShowModal(true);
  }

  function cancelarExclusao() {
    setIdParaExcluir(null);
    setShowModal(false);
  }

  async function excluir(id) {
    try {
      const resultado = await DeletarUsers(id, 3); // Tipo fixo: 3 (Paciente)
      if (resultado.success) {
        const novosDados = dados.filter((item) => item.id !== id);
        setDados(novosDados);
        console.log("Excluído ID:", id);
      } else {
        console.error("Erro ao excluir:", resultado.message);
        alert("Erro ao excluir: " + resultado.message);
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro desconhecido ao excluir");
    } finally {
      setShowModal(false);
      setIdParaExcluir(null);
    }
  }

  return (
    <div className="flex items-start justify-center bg-gray-100 pt-4 pb-8 min-h-screen text-sm">
      <div className="w-full max-w-3xl rounded-xl bg-white p-4 shadow-lg">
        <div className="flex flex-col items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Lista de Pacientes
          </h1>
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
                  <TableHeadCell className="text-left">Nome</TableHeadCell>

                  <TableHeadCell className="text-center w-28">
                    Editar
                  </TableHeadCell>

                  <TableHeadCell className="text-center w-28">
                    Remover
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="text-sm">
                {dados.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nome}</TableCell>

                    <TableCell className="text-center">
                      <Link
                        href={`/secretaria/listarpacientes/editarpacientes?id=${item.id}`}
                      >
                        <Button size="xs" className="w-20">
                          Editar
                        </Button>
                      </Link>
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        size="xs"
                        color="failure"
                        className="w-20"
                        onClick={() => confirmarExclusao(item.id)}
                      >
                        Remover
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>Não há dados disponíveis</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" color="light" onClick={() => router.back()}>
            Sair
          </Button>
        </div>

        {/* Modal de Confirmação */}
        <Modal show={showModal} size="md" onClose={cancelarExclusao}>
          <div className="p-6 text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-700">
              Tem certeza que deseja excluir este usuário?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => excluir(idParaExcluir)}>
                Confirmar
              </Button>
              <Button color="gray" onClick={cancelarExclusao}>
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
