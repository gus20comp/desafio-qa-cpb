
const BASE_URL = "https://www.automationexercise.com";

async function verificarAmbiente() {
  console.log("[PREFLIGHT] Iniciando diagnostico do ambiente");

  const verificacoes = [
    {
      nome: "Pagina inicial",
      url: `${BASE_URL}/`,
      tipo: "html"
    },
    {
      nome: "API de produtos",
      url: `${BASE_URL}/api/productsList`,
      tipo: "json"
    }
  ];

  const falhas = [];

  for (const verificacao of verificacoes) {
    console.log(`\n[PREFLIGHT] Verificando: ${verificacao.nome}`);

    try {
      const resposta = await fetch(verificacao.url, {
        signal: AbortSignal.timeout(15000)
      });

      const conteudo = await resposta.text();

      console.log(`Status HTTP: ${resposta.status}`);
      console.log(
        `Content-Type: ${resposta.headers.get("content-type")}`
      );

      if (!resposta.ok) {
        throw new Error(`Resposta HTTP ${resposta.status}`);
      }

      const bloqueioDetectado =
        /One moment, please|request is being verified|under heavy load|queue full/i
          .test(conteudo);

      if (bloqueioDetectado) {
        throw new Error(
          "Pagina de verificacao ou indisponibilidade detectada"
        );
      }

      if (verificacao.tipo === "html") {
        if (!/<title>\s*Automation Exercise\s*<\/title>/i.test(conteudo)) {
          throw new Error("Pagina inicial diferente da esperada");
        }
      }

      if (verificacao.tipo === "json") {
        let dados;

        try {
          dados = JSON.parse(conteudo);
        } catch {
          throw new Error("API retornou conteudo que nao e JSON valido");
        }

        if (
          dados?.responseCode !== 200 ||
          !Array.isArray(dados.products) ||
          dados.products.length === 0
        ) {
          throw new Error("Resposta da API diferente da esperada");
        }

        console.log(`Produtos encontrados: ${dados.products.length}`);
      }

      console.log(`[OK] ${verificacao.nome}`);

    } catch (erro) {
      const mensagem = `${verificacao.nome}: ${erro.message}`;

      falhas.push(mensagem);

      console.error(`[FALHA] ${mensagem}`);
    }
  }

  if (falhas.length > 0) {
    console.error("\n[PREFLIGHT] Ambiente nao validado.");

    falhas.forEach((falha) => {
      console.error(`- ${falha}`);
    });

    process.exitCode = 1;
    return;
  }

  console.log("\n[PREFLIGHT] Ambiente validado com sucesso.");
}

verificarAmbiente().catch((erro) => {
  console.error("[PREFLIGHT] Erro inesperado:", erro.message);
  process.exitCode = 1;
});
