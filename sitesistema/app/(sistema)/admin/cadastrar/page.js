"use client";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Inserir } from "./apiAdmin";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Yupschema } from "./yupschema";

export default function Cadastrar() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipo: "",
      nome: "",
      email: "",
      senha: "",
      datanascimento: "",
      cpf: "",
    },
    resolver: yupResolver(Yupschema),
  });

  const tipoSelecionado = watch("tipo");

  const handleReset = () => {
    console.log("Resetando formulário...");
    reset({
      tipo: "",
      nome: "",
      email: "",
      senha: "",
      datanascimento: "",
      cpf: "",
    });
  };

  const onSubmit = async (data) => {
    setBusy(true);
    try {
      const resultado = await Inserir(data);
      console.log("Resultado da API:", resultado);

      if (resultado.success) {
        toast.success(resultado.message || "Cadastro realizado com sucesso!");
        reset({
          tipo: data.tipo,
          nome: "",
          email: "",
          senha: "",
          datanascimento: "",
          cpf: "",
        });
      } else {
        toast.error(resultado.message || "Erro ao cadastrar.");
      }
    } catch (error) {
      toast.error("Erro inesperado: " + error.message);
      console.error("Erro no cadastro:", error);
    } finally {
      setBusy(false);
    }
  };

  const handleCancelar = () => {
    console.log("Cancelando cadastro, voltando para página anterior...");
    handleReset();
    router.back();
  };

  return (
    <div className="flex items-start justify-center bg-gray-100 pt-4 pb-8 min-h-screen">
      <div className="w-full max-w-2xl rounded-xl bg-white p-4 shadow-lg">
        <p className="text-center text-2xl font-bold text-gray-700 mb-1">
          Cadastro de Usuários
        </p>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          onReset={handleReset}
        >
          <div>
            <Label htmlFor="ddlTipo">Tipo de Usuário:</Label>
            <Select
              id="ddlTipo"
              {...register("tipo")}
              onChange={(e) => {
                reset({
                  tipo: e.target.value,
                  nome: "",
                  email: "",
                  senha: "",
                  datanascimento: "",
                  cpf: "",
                });
              }}
              name="tipo"
            >
              <option value="" disabled>
                [Escolha]
              </option>
              <option value="1">Administrador</option>
              <option value="2">Secretaria</option>
              <option value="3">Paciente</option>
            </Select>
            {errors.tipo && (
              <p className="text-red-500 text-sm">{errors.tipo.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="nome">Nome do Usuário:</Label>
            <TextInput
              id="nome"
              type="text"
              placeholder="Informe o nome completo"
              {...register("nome")}
            />
            {errors.nome && (
              <p className="text-red-500 text-sm">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">E-mail:</Label>
            <TextInput
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="senha">Senha:</Label>
            <TextInput
              id="senha"
              type="password"
              placeholder="Informe a senha"
              {...register("senha")}
            />
            {errors.senha && (
              <p className="text-red-500 text-sm">{errors.senha.message}</p>
            )}
          </div>

          {tipoSelecionado === "3" && (
            <div>
              <Label htmlFor="cpf">CPF:</Label>
              <TextInput
                id="cpf"
                type="text"
                placeholder="Somente números, ex: 12345678901"
                {...register("cpf")}
              />
              {errors.cpf && (
                <p className="text-red-500 text-sm">{errors.cpf.message}</p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="datanascimento">Data de Nascimento:</Label>
            <TextInput
              id="datanascimento"
              type="date"
              {...register("datanascimento")}
            />
            {errors.datanascimento && (
              <p className="text-red-500 text-sm">
                {errors.datanascimento.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit" disabled={busy}>
              Salvar
            </Button>
            <Button color="light" type="button" onClick={handleCancelar}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
