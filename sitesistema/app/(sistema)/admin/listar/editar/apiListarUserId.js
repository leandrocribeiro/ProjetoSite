"use server";

export async function ListarUserId(id, tipo = 3) {
  if (!id) {
    return { success: false, message: "ID do usuário não fornecido." };
  }

  const tipoToUrl = {
    1: "/tipoUserAdmin",
    2: "/tipoUserSecretaria",
    3: "/tipoUserPaciente",
  };

  const caminho = tipoToUrl[tipo]
    ? `${tipoToUrl[tipo]}/${id}`
    : `${tipoToUrl[3]}/${id}`;
  const url = process.env.API_URL + caminho;

  const args = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-api-key": process.env.API_KEY,
    },
  };

  try {
    const response = await fetch(url, args);
    const resultData = await response.json();

    if (response.ok) {
      return { success: true, data: resultData };
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
