"use server";

export async function ListarExameId(exameid) {
  if (!exameid) {
    return { success: false, message: "ID do exame não fornecido" };
  }

  const args = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-api-key": process.env.API_KEY,
    },
  };

  const caminho = `/tipoExame/${exameid}`;
  const url = process.env.API_URL + caminho;

  try {
    // Faz uma requisição HTTP para a URL
    const response = await fetch(url, args);
    // Lê e interpreta o JSON da resposta
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
