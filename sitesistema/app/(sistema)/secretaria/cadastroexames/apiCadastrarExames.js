"use server";

export async function CadastrarExames(data) {
  const args = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY,
    },
    body: JSON.stringify(data),
  };

  const url = process.env.API_URL + "/tipoExame";

  try {
    const response = await fetch(url, args);
    const resultData = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: "Tipo de Exame salvo com sucesso",
      };
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
