"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  TextInput,
  Spinner,
} from "flowbite-react";
import { toast } from "react-toastify";

import { Inserir } from "../(sistema)/admin/cadastrar/apiAdmin";
import { Yupschema } from "../(sistema)/admin/cadastrar/yupschema";

const crypto = require("crypto");

function createSHA256Hash(inputString) {
  const hash = crypto.createHash("sha256");
  hash.update(inputString);
  return hash.digest("hex");
}

export default function NovoUsuario() {
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);

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

  const onSubmit = async (data) => {
    setBusy(true);

    // Hash da senha com um "sal" fixo
    data.senha = createSHA256Hash(data.senha + "khadfhyf388");

    try {
      const resultado = await Inserir(data);

      if (resultado.success) {
        toast.success(resultado.message || "Usuário cadastrado com sucesso!");
        closeModal();
      } else {
        toast.error(resultado.message || "Erro ao cadastrar usuário.");
      }
    } catch (error) {
      toast.error("Erro inesperado: " + error.message);
    } finally {
      setBusy(false);
    }
  };

  const closeModal = () => {
    reset({
      tipo: "",
      nome: "",
      email: "",
      senha: "",
      datanascimento: "",
      cpf: "",
    });
    setModalOpen(false);
  };

  return (
    <>
      <span
        className="text-gray-800 dark:text-gray-400 text-sm cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        Clique aqui para registrar um novo usuário
      </span>

      <Modal show={modalOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Novo Usuário</ModalHeader>
          <ModalBody>
            <div className="mb-2">
              <Label>
                Tipo de usuário
                <Select {...register("tipo")}>
                  <option value="" disabled>
                    [Escolha]
                  </option>
                  <option value="1">Administrador</option>
                  <option value="2">Secretaria</option>
                  <option value="3">Paciente</option>
                </Select>
              </Label>
              <span className="text-sm text-red-600">
                {errors?.tipo?.message}
              </span>
            </div>

            <div className="mb-2">
              <Label>
                Nome
                <TextInput
                  placeholder="Informe o nome completo"
                  {...register("nome")}
                />
              </Label>
              <span className="text-sm text-red-600">
                {errors?.nome?.message}
              </span>
            </div>

            <div className="mb-2">
              <Label>
                E-mail
                <TextInput
                  placeholder="email@exemplo.com"
                  {...register("email")}
                />
              </Label>
              <span className="text-sm text-red-600">
                {errors?.email?.message}
              </span>
            </div>

            <div className="mb-2">
              <Label>
                Senha
                <TextInput
                  type="password"
                  placeholder="Informe a senha"
                  {...register("senha")}
                />
              </Label>
              <span className="text-sm text-red-600">
                {errors?.senha?.message}
              </span>
            </div>

            {tipoSelecionado === "3" && (
              <div className="mb-2">
                <Label>
                  CPF
                  <TextInput
                    placeholder="Somente números, ex: 12345678901"
                    {...register("cpf")}
                  />
                </Label>
                <span className="text-sm text-red-600">
                  {errors?.cpf?.message}
                </span>
              </div>
            )}

            <div className="mb-2">
              <Label>
                Data de Nascimento
                <TextInput type="date" {...register("datanascimento")} />
              </Label>
              <span className="text-sm text-red-600">
                {errors?.datanascimento?.message}
              </span>
            </div>
          </ModalBody>

          <ModalFooter className="justify-end">
            <Button
              size="sm"
              type="submit"
              className="items-center gap-1"
              disabled={busy}
            >
              {busy && <Spinner size="md" />}
              <span>Salvar</span>
            </Button>
            <Button size="sm" color="gray" onClick={closeModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
