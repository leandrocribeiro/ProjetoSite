"use server";

export async function Inserir(data) {
  const args = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY,
    },
    body: JSON.stringify(data),
  };

  const tipoToUrl = {
    1: "/tipoUserAdmin",
    2: "/tipoUserSecretaria",
    3: "/tipoUserPaciente",
  };

  const returnmessage = {
    1: "Usuário tipo Administrador salvo com sucesso",
    2: "Usuário tipo Secretaria salvo com sucesso",
    3: "Usuário tipo Paciente salvo com sucesso",
  };

  const url = process.env.API_URL + tipoToUrl[data.tipo];

  try {
    // Faz uma requisição HTTP para a URL, espera a resposta e guarda na variável response.
    const response = await fetch(url, args);
    // Lê o conteúdo da resposta, interpreta como JSON, e guarda como objeto na variável resultData.
    const resultData = await response.json();

    if (response.ok) {
      return { success: true, message: returnmessage[data.tipo] };
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
