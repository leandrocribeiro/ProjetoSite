"use client";
import { Button, Card } from "flowbite-react";
import Link from "next/link";

export default function Secretaria() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Painel da Secretaria
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Grupo: Pacientes */}
          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">
              Pacientes
            </h2>
            <div className="flex flex-col gap-2">
              <Link href="/secretaria/listarpacientes">
                <Button fullSized>Listar Pacientes</Button>
              </Link>
              <Link href="/secretaria/cadastropacientes">
                <Button fullSized>Cadastro de Pacientes</Button>
              </Link>
            </div>
          </div>

          {/* Grupo: Exames */}
          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">
              Exames
            </h2>
            <div className="flex flex-col gap-2">
              <Link href="/secretaria/listarexames">
                <Button fullSized>Listar Exames</Button>
              </Link>
              <Link href="/secretaria/cadastroexames">
                <Button fullSized>Cadastro de Exames</Button>
              </Link>
            </div>
          </div>

          {/* Grupo: Agendamentos */}
          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">
              Agendamentos
            </h2>
            <div className="flex flex-col gap-2">
              <Link href="/secretaria/listaragendamentos">
                <Button fullSized>Listar Agendamentos</Button>
              </Link>
              <Link href="/secretaria/agendamento">
                <Button fullSized>Agendamento de Exames</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
