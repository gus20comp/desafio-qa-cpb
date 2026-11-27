
describe("Comparação entre catálogo da API e interface", () => {
  it("deve apresentar na tela os mesmos produtos retornados pela API", () => {
    const termoPesquisa = "top";

    cy.request({
      method: "POST",
      url: "/api/searchProduct",
      form: true,
      body: {
        search_product: termoPesquisa
      }
    }).then((response) => {
      const body = typeof response.body === "string"
        ? JSON.parse(response.body)
        : response.body;

      expect(response.status).to.eq(200);
      expect(body.responseCode).to.eq(200);

      const nomesDaApi = body.products
        .map((product) => product.name.trim())
        .sort();

      cy.visit("/products");

      cy.get("#search_product")
        .should("be.visible")
        .type(termoPesquisa);

      cy.get("#submit_search").click();

      cy.get(".features_items .productinfo p")
        .should("have.length.greaterThan", 0)
        .then(($produtos) => {
          const nomesDaTela = $produtos
            .toArray()
            .map((produto) => produto.innerText.trim())
            .sort();

          expect(nomesDaTela).to.deep.equal(nomesDaApi);
        });
    });
  });
});
