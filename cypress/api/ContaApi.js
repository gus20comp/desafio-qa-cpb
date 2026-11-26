
class ContaApi {
  interpretarResposta(response) {
    expect(response.status, "Status HTTP").to.eq(200);

    const body = typeof response.body === "string"
      ? JSON.parse(response.body)
      : response.body;

    expect(body).to.be.an("object");
    expect(body.responseCode).to.be.a("number");

    return body;
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

      expect(body.responseCode).to.eq(201);
      expect(body.message).to.include("User created");

      return body;
    });
  }

  verificarLogin(usuario) {
    return cy.request({
      method: "POST",
      url: "/api/verifyLogin",
      form: true,
      body: {
        email: usuario.email,
        password: usuario.password
      },
      failOnStatusCode: false
    }).then((response) => {
      const body = this.interpretarResposta(response);

      expect(body.responseCode).to.eq(200);
      expect(body.message).to.include("User exists");

      return body;
    });
  }

  consultarConta(email) {
    return cy.request({
      method: "GET",
      url: "/api/getUserDetailByEmail",
      qs: { email },
      failOnStatusCode: false
    }).then((response) => {
      const body = this.interpretarResposta(response);

      expect(body.responseCode).to.eq(200);
      expect(body.user).to.be.an("object");

      return body.user;
    });
  }

  atualizarConta(usuario) {
    return cy.request({
      method: "PUT",
      url: "/api/updateAccount",
      form: true,
      body: usuario,
      failOnStatusCode: false
    }).then((response) => {
      const body = this.interpretarResposta(response);

      expect(body.responseCode).to.eq(200);
      expect(body.message).to.include("User updated");

      return body;
    });
  }

  excluirConta(usuario, permitirInexistente = false) {
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

      if (permitirInexistente && body.responseCode === 404) {
        expect(body.message).to.include("Account not found");
        return body;
      }

      expect(body.responseCode).to.eq(200);
      expect(body.message).to.include("Account deleted");

      return body;
    });
  }

  validarContaInexistente(email) {
    return cy.request({
      method: "GET",
      url: "/api/getUserDetailByEmail",
      qs: { email },
      failOnStatusCode: false
    }).then((response) => {
      const body = this.interpretarResposta(response);

      expect(body.responseCode).to.eq(404);
      expect(body.user).not.to.exist;

      return body;
    });
  }
}

export default new ContaApi();
