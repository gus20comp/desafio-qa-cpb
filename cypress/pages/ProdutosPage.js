class ProdutosPage {

  acessar() {
    cy.visit("/products");
  }

  visualizarProduto(id) {
    cy.get(`a[href="/product_details/${id}"]`)
      .should("be.visible")
      .click();
  }

  adicionarAoCarrinho(id) {
    cy.get(`.productinfo a[data-product-id="${id}"]`)
      .should("be.visible")
      .click();
  }

  continuarComprando() {
    cy.contains("button", "Continue Shopping")
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

export default new ProdutosPage();