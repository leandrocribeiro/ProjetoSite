"use server";

export async function EditarAgendamentoId(data) {
  if (!data.id) {
    return { success: false, message: "ID do Agendamento não informado." };
  }

  const url = `${process.env.API_URL}/tipoAgendamento/${data.id}`;

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
    console.log("Fazendo requisição PUT para:", url);
    console.log("Corpo da requisição:", data);

    const response = await fetch(url, args);
    const resultData = await response.json();

    if (response.ok) {
      console.log("Resposta OK da API:", resultData);
      return {
        success: true,
        message: "Agendamento atualizado com sucesso",
      };
    } else {
      const errormessage = resultData.errors
        ? Object.values(resultData.errors).join(" ")
        : JSON.stringify(resultData);
      console.error("Erro da API:", errormessage);
      return { success: false, message: errormessage };
    }
  } catch (ex) {
    console.error("Erro inesperado na API:", ex.message);
    return { success: false, message: ex.message || "Erro desconhecido" };
  }
}
