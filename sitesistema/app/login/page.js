"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, TextInput } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import { RiHealthBookFill } from "react-icons/ri";
import NovoUsuario from "./novo";
import "react-toastify/dist/ReactToastify.css";
import { AutenticarUsers } from "./apiAutenticarUsers";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resultado = await AutenticarUsers(email, senha.trim());

      if (resultado.success) {
        toast.success("Login realizado com sucesso!");
        const tipo = resultado.tipo;
        if (tipo === 1) router.push("/admin");
        else if (tipo === 2) router.push("/secretaria");
        else if (tipo === 3) router.push("/paciente");
      } else {
        toast.error(resultado.message || "Erro na autenticação.");
      }
    } catch (error) {
      toast.error("Erro inesperado: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        className="text-sm"
        theme="colored"
      />

      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 dark:bg-neutral-900 px-4">
        {/* Ícone e título */}
        <RiHealthBookFill color="red" size={40} className="mb-3" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 text-center">
          Sistema de Agendamento de Consultas
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 text-center">
          Faça login para acessar sua conta
        </p>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="mb-4">
            <Label className="text-sm">
              E-mail
              <TextInput
                placeholder="usuario@usuario.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
              />
            </Label>
          </div>
          <div className="mb-4">
            <Label className="text-sm">
              Senha
              <TextInput
                type="password"
                placeholder="******"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </Label>
          </div>
          <div className="flex justify-center">
            <Button type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </form>

        {/* Registro de novo usuário */}
        <div className="mt-6">
          <NovoUsuario />
        </div>
      </div>
    </>
  );
}
