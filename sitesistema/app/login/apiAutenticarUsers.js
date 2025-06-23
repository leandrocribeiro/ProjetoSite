"use server";

export async function AutenticarUsers(email, senha) {
  const args = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": process.env.API_KEY,
    },
    body: JSON.stringify({ email, senha }),
  };

  const urls = [
    { tipo: 1, caminho: "/tipoUserAdmin/autenticar" },
    { tipo: 2, caminho: "/tipoUserSecretaria/autenticar" },
    { tipo: 3, caminho: "/tipoUserPaciente/autenticar" },
  ];

  try {
    for (const { tipo, caminho } of urls) {
      const url = process.env.API_URL + caminho;

      const response = await fetch(url, args);
      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        continue; // ignora se não for resposta JSON
      }

      const resultData = await response.json();

      if (response.ok && resultData.success) {
        return {
          success: true,
          tipo,
          usuario: resultData.usuario,
        };
      }
    }

    return { success: false, message: "E-mail ou senha inválidos." };
  } catch (ex) {
    return { success: false, message: ex.message || "Erro desconhecido" };
  }
}
