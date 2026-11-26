describe("Acesso à loja virtual", () => {
  it("deve carregar a página inicial", () => {
    cy.visit("/");
    cy.url().should("include", "automationexercise.com");
    cy.get("body").should("be.visible");
  });
});
