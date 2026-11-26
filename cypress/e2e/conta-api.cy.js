
describe("API - Ciclo de vida da conta", () => {
  let email;
  let contaCriada = false;

  const senha = "TesteQA@2026";

  afterEach(() => {
    if (contaCriada) {
      cy.request({
        method: "DELETE",
        url: "/api/deleteAccount",
        form: true,
        body: { email, password: senha }
      }).then((response) => {
        const body = typeof response.body === "string"
          ? JSON.parse(response.body)
          : response.body;

        expect(response.status).to.eq(200);
        expect(body.responseCode).to.eq(200);

        contaCriada = false;
      });
    }
  });

  it("deve executar o ciclo de vida da conta", () => {
    email = `teste.qa.${Date.now()}@exemplo.com`;

    // 1. Cadastro
    cy.request({
      method: "POST",
      url: "/api/createAccount",
      form: true,
      body: {
        name: "Usuario QA",
        email,
        password: senha,
        title: "Mr",
        birth_date: "15",
        birth_month: "5",
        birth_year: "1995",
        firstname: "Usuario",
        lastname: "QA",
        company: "Teste",
        address1: "Rua de Teste, 100",
        address2: "",
        country: "Canada",
        zipcode: "12345",
        state: "Ontario",
        city: "Toronto",
        mobile_number: "1234567890"
      }
    }).then((response) => {
      const body = typeof response.body === "string"
        ? JSON.parse(response.body)
        : response.body;

      if (response.status === 200 && body.responseCode === 201) {
        contaCriada = true;
      }

      expect(response.status).to.eq(200);
      expect(body.responseCode).to.eq(201);
      expect(body.message).to.include("User created");
    });

    // 2. Login
    cy.request({
      method: "POST",
      url: "/api/verifyLogin",
      form: true,
      body: { email, password: senha }
    }).then((response) => {
      const body = typeof response.body === "string"
        ? JSON.parse(response.body)
        : response.body;

      expect(response.status).to.eq(200);
      expect(body.responseCode).to.eq(200);
      expect(body.message).to.include("User exists");
    });

    // 3. Consulta inicial
    cy.request({
      method: "GET",
      url: "/api/getUserDetailByEmail",
      qs: { email }
    }).then((response) => {
      const body = typeof response.body === "string"
        ? JSON.parse(response.body)
        : response.body;

      expect(response.status).to.eq(200);
      expect(body.responseCode).to.eq(200);
      expect(body.user).to.have.property("email", email);
      expect(body.user).to.have.property("name", "Usuario QA");
    });
    
    // 4. Atualização
    cy.request({
      method: "PUT",
      url: "/api/updateAccount",
      form: true,
      body: {
        name: "Usuario QA Atualizado",
        email,
        password: senha,
        title: "Mr",
        birth_date: "15",
        birth_month: "5",
        birth_year: "1995",
        firstname: "Usuario",
        lastname: "Atualizado",
        company: "Teste QA",
        address1: "Rua Atualizada, 200",
        address2: "",
        country: "Canada",
        zipcode: "54321",
        state: "Ontario",
        city: "Toronto",
        mobile_number: "1234567890"
      }
    }).then((response) => {
      const body = typeof response.body === "string"
        ? JSON.parse(response.body)
        : response.body;

      expect(response.status).to.eq(200);
      expect(body.responseCode).to.eq(200);
      expect(body.message).to.include("User updated");
    });

    // 5. Consulta após atualização
    cy.request({
      method: "GET",
      url: "/api/getUserDetailByEmail",
      qs: { email }
    }).then((response) => {
      const body = typeof response.body === "string"
        ? JSON.parse(response.body)
        : response.body;

      expect(response.status).to.eq(200);
      expect(body.responseCode).to.eq(200);
      expect(body.user).to.have.property(
        "name",
        "Usuario QA Atualizado"
      );
    });
  });
});
