"use server";

export async function ListarAgendamentosCPF(cpf) {
  const args = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-api-key": process.env.API_KEY,
    },
  };

  const url = `${process.env.API_URL}/tipoAgendamento/pesquisaCPF/${cpf}`;

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
    return {
      success: false,
      message: ex.message || "Erro desconhecido",
    };
  }
}
