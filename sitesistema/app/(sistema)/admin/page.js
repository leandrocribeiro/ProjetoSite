"use client";
import { Button, Card } from "flowbite-react";
import Link from "next/link";

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Painel do Administrador
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Grupo: Usuários */}
          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">
              Usuários
            </h2>
            <div className="flex flex-col gap-2">
              <Link href="/admin/listar">
                <Button fullSized>Listar Usuários</Button>
              </Link>
              <Link href="/admin/cadastrar">
                <Button fullSized>Cadastrar Usuários</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
