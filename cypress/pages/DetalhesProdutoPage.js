class DetalhesProdutoPage {

  alterarQuantidade(quantidade) {
    cy.get("#quantity")
      .should("be.visible")
      .clear()
      .type(String(quantidade))
      .should("have.value", String(quantidade));
  }

  adicionarAoCarrinho() {
    cy.get("button.cart")
      .should("be.visible")
      .click();
  }

  visualizarCarrinho() {
    cy.get("#cartModal")
      .contains("View Cart")
      .should("be.visible")
      .click();
  }

}

export default new DetalhesProdutoPage();