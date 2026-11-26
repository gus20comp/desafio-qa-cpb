
describe("API - Cenarios negativos", () => {

  const cenarios = [
    {
      id: "API-NEG-01",
      descricao: "deve rejeitar POST na listagem de produtos",
      method: "POST",
      url: "/api/productsList",
      dados: {},
      codigoEsperado: 405,
      mensagemEsperada: "This request method is not supported."
    },
    {
      id: "API-NEG-02",
      descricao: "deve rejeitar pesquisa sem parametro obrigatorio",
      method: "POST",
      url: "/api/searchProduct",
      dados: {},
      codigoEsperado: 400,
      mensagemEsperada: "search_product parameter is missing"
    },
    {
      id: "API-NEG-03",
      descricao: "deve rejeitar login sem email",
      method: "POST",
      url: "/api/verifyLogin",
      dados: {
        password: "TesteQA@2026"
      },
      codigoEsperado: 400,
      mensagemEsperada: "email or password parameter is missing"
    },
    {
      id: "API-NEG-04",
      descricao: "deve rejeitar login sem senha",
      method: "POST",
      url: "/api/verifyLogin",
      dados: {
        email: "teste@example.com"
      },
      codigoEsperado: 400,
      mensagemEsperada: "email or password parameter is missing"
    },
    {
      id: "API-NEG-05",
      descricao: "deve rejeitar login com credenciais invalidas",
      method: "POST",
      url: "/api/verifyLogin",
      dados: {
        email: `inexistente.${Date.now()}@example.com`,
        password: "SenhaInvalida123"
      },
      codigoEsperado: 404,
      mensagemEsperada: "User not found!"
    },
    {
      id: "API-NEG-06",
      descricao: "deve rejeitar DELETE no endpoint de login",
      method: "DELETE",
      url: "/api/verifyLogin",
      dados: {},
      codigoEsperado: 405,
      mensagemEsperada: "This request method is not supported."
    },
    {
      id: "API-NEG-07",
      descricao: "deve rejeitar PUT na listagem de marcas",
      method: "PUT",
      url: "/api/brandsList",
      dados: {},
      codigoEsperado: 405,
      mensagemEsperada: "This request method is not supported."
    }
  ];

  cenarios.forEach((cenario) => {

    it(`[${cenario.id}] ${cenario.descricao}`, () => {

      cy.request({
        method: cenario.method,
        url: cenario.url,
        form: true,
        body: cenario.dados,
        failOnStatusCode: false
      }).then((response) => {

        const body = typeof response.body === "string"
          ? JSON.parse(response.body)
          : response.body;

        // Validacao do status HTTP
        expect(response.status, "Status HTTP").to.eq(200);

        // Validacao da estrutura da resposta
        expect(body).to.be.an("object");
        expect(body).to.have.property("responseCode");
        expect(body).to.have.property("message");

        expect(body.responseCode).to.be.a("number");
        expect(body.message).to.be.a("string");

        // Validacao do contrato da API
        expect(body.responseCode, "Codigo de negocio")
          .to.eq(cenario.codigoEsperado);

        expect(body.message, "Mensagem de retorno")
          .to.include(cenario.mensagemEsperada);

      });

    });

  });

});
