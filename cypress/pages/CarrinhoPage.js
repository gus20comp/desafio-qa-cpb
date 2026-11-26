class CarrinhoPage {

  acessar() {
    cy.visit("/view_cart");
  }

  obterProduto(id) {
    return cy.get(`#product-${id}`);
  }

  obterNome(id) {
    return this.obterProduto(id)
      .find(".cart_description h4 a");
  }

  obterPreco(id) {
    return this.obterProduto(id)
      .find(".cart_price p");
  }

  obterQuantidade(id) {
    return this.obterProduto(id)
      .find(".cart_quantity button");
  }

  obterSubtotal(id) {
    return this.obterProduto(id)
      .find(".cart_total_price");
  }

  removerProduto(id) {
    this.obterProduto(id)
      .find(".cart_quantity_delete")
      .should("be.visible")
      .click();
  }

  obterMensagemCarrinhoVazio() {
    return cy.get("#empty_cart");
  }

  obterProdutos() {
    return cy.get("#cart_info_table tbody tr");
  }

}

export default new CarrinhoPage();