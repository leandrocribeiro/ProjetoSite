"use client";

import { RiHealthBookFill } from "react-icons/ri";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gray-50 px-4 pt-10 pb-16">
      <section className="max-w-3xl bg-white rounded-xl shadow-md p-10 text-center">
        <RiHealthBookFill color="red" size={64} className="mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Bem-vindo(a) ao Sistema de Agendamento de Consultas
        </h1>
        <p className="text-gray-700 text-lg mb-2">
          Facilite o agendamento e acompanhamento dos seus exames e consultas.
        </p>
        <p className="text-gray-700 text-lg">
          Use as opções no menu para navegar entre as áreas do sistema.
        </p>
      </section>
    </main>
  );
}
