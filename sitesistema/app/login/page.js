"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, TextInput } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import NovoUsuario from "./novo";
import "react-toastify/dist/ReactToastify.css";
import { AutenticarUsers } from "./apiAutenticarUsers";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false); // controla estado de carregamento

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Senha sem hash para a API aplicar o hash
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
      <div className="flex flex-col items-center justify-center h-screen bg-neutral-100 dark:bg-neutral-900">
        <div>
          <span className="text-black dark:text-white">
            Bem-vindo ao sistema!
          </span>
          <div className="mt-4">
            <form onSubmit={handleLogin}>
              <div className="mb-2">
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
              <div className="mb-2">
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
          </div>
          <div className="mt-4">
            <NovoUsuario />
          </div>
        </div>
      </div>
    </>
  );
}
