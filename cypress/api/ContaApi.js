
class ContaApi {
  interpretarResposta(response) {
    return typeof response.body === "string"
      ? JSON.parse(response.body)
      : response.body;
  }

  criarConta(usuario) {
    return cy.request({
      method: "POST",
      url: "/api/createAccount",
      form: true,
      body: usuario,
      failOnStatusCode: false
    }).then((response) => {
      const body = this.interpretarResposta(response);

      expect(response.status, "Status HTTP").to.eq(200);
      expect(body.responseCode, "Codigo de negocio").to.eq(201);
      expect(body.message).to.include("User created");

      return body;
    });
  }

  excluirConta(usuario) {
    return cy.request({
      method: "DELETE",
      url: "/api/deleteAccount",
      form: true,
      body: {
        email: usuario.email,
        password: usuario.password
      },
      failOnStatusCode: false
    }).then((response) => {
      const body = this.interpretarResposta(response);

      expect(response.status, "Status HTTP").to.eq(200);
      expect(body.responseCode, "Codigo de negocio").to.eq(200);
      expect(body.message).to.include("Account deleted");

      return body;
    });
  }
}

export default new ContaApi();
