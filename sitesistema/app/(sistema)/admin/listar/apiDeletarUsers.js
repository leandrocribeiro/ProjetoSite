"use server";

export async function DeletarUsers(id, tipo = 1) {
  if (!id) {
    return {
      success: false,
      message: "Obrigatório informar um ID para Deletar.",
    };
  }

  const args = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "x-api-key": process.env.API_KEY,
    },
  };

  const tipoToUrl = {
    1: "/tipoUserAdmin",
    2: "/tipoUserSecretaria",
    3: "/tipoUserPaciente",
  };

  const caminho = tipoToUrl[tipo] || tipoToUrl[1];
  const url = `${process.env.API_URL}${caminho}/${id}`;

  try {
    const response = await fetch(url, args);
    const resultData = await response.json();

    if (response.ok) {
      return { success: true, data: resultData };
    } else {
      const errormessage = resultData.errors
        ? Object.values(resultData.errors).join(" ")
        : resultData;
      return { success: false, message: errormessage };
    }
  } catch (ex) {
    return { success: false, message: ex.message || "Erro desconhecido" };
  }
}
