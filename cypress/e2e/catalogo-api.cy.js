describe("API - Catálogo de produtos", () => {
  it("deve retornar a lista de produtos com dados válidos", () => {
    cy.request({
      method: "GET",
      url: "/api/productsList"
    }).then((response) => {
      const body = typeof response.body === "string"
        ? JSON.parse(response.body)
        : response.body;

      expect(response.status).to.eq(200);
      expect(body.responseCode).to.eq(200);
      expect(body.products).to.be.an("array").and.not.be.empty;

      body.products.forEach((product) => {
        expect(product).to.have.all.keys(
          "id",
          "name",
          "price",
          "brand",
          "category"
        );

        expect(product.id).to.be.a("number");
        expect(product.name).to.be.a("string").and.not.be.empty;
        expect(product.price).to.be.a("string").and.not.be.empty;
        expect(product.brand).to.be.a("string").and.not.be.empty;
        expect(product.category.usertype.usertype).to.be.a("string");
        expect(product.category.category).to.be.a("string");
      });
    });
  });
  it("deve pesquisar produtos pela API", () => {
  cy.request({
    method: "POST",
    url: "/api/searchProduct",
    form: true,
    body: {
      search_product: "top"
    }
  }).then((response) => {
    const body = typeof response.body === "string"
      ? JSON.parse(response.body)
      : response.body;

    expect(response.status).to.eq(200);
    expect(body.responseCode).to.eq(200);
    expect(body.products).to.be.an("array").and.not.be.empty;

    body.products.forEach((product) => {
      expect(product.name).to.be.a("string").and.not.be.empty;
    });
  });
});
});
