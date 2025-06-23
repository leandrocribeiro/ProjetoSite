"use server";

export async function EditarUsuario(data) {
  if (!data.id) {
    return { success: false, message: "ID do usuário não informado." };
  }

  const tipoToUrl = {
    1: "/tipoUserAdmin",
    2: "/tipoUserSecretaria",
    3: "/tipoUserPaciente",
  };

  const returnMessage = {
    1: "Usuário tipo Administrador atualizado com sucesso",
    2: "Usuário tipo Secretaria atualizado com sucesso",
    3: "Usuário tipo Paciente atualizado com sucesso",
  };

  const tipo = parseInt(data.tipo); // Garante que é número
  const url = `${process.env.API_URL}${tipoToUrl[tipo]}/${data.id}`;

  const args = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, args);
    const resultData = await response.json();

    if (response.ok) {
      return { success: true, message: returnMessage[tipo] };
    } else {
      const errormessage = resultData.errors
        ? Object.values(resultData.errors).join(" ")
        : JSON.stringify(resultData);
      return { success: false, message: errormessage };
    }
  } catch (ex) {
    return { success: false, message: ex.message || "Erro desconhecido" };
  }
}
