
describe("Acesso à loja virtual", () => {
  it("deve carregar a página inicial com os elementos essenciais", () => {
    cy.visit("/");

    // Validar o dominio da aplicacao
    cy.location("hostname")
      .should("eq", "www.automationexercise.com");

    // Validar o titulo da pagina
    cy.title()
      .should("eq", "Automation Exercise");

    // Validar a exibicao do logotipo
    cy.get(".logo img")
      .should("be.visible");

    // Validar o menu de navegacao
    cy.contains("a", "Products")
      .should("be.visible");

    cy.contains("a", "Cart")
      .should("be.visible");

    cy.contains("a", "Signup / Login")
      .should("be.visible");

    // Validar a secao de produtos
    cy.contains("h2", "Features Items")
      .should("be.visible");

    cy.get(".features_items .product-image-wrapper")
      .should("have.length.greaterThan", 0);
  });
});
