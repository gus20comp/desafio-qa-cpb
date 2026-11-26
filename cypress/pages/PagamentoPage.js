
class PagamentoPage {
  preencherDadosPagamento(cartao) {
    cy.get('[data-qa="name-on-card"]')
      .should("be.visible")
      .type(cartao.nome);

    cy.get('[data-qa="card-number"]')
      .should("be.visible")
      .type(cartao.numero, { log: false });

    cy.get('[data-qa="cvc"]')
      .should("be.visible")
      .type(cartao.cvc, { log: false });

    cy.get('[data-qa="expiry-month"]')
      .should("be.visible")
      .type(cartao.mes);

    cy.get('[data-qa="expiry-year"]')
      .should("be.visible")
      .type(cartao.ano);
  }

  confirmarPagamento() {
    cy.get('[data-qa="pay-button"]')
      .should("be.visible")
      .click();
  }

  validarPedidoConfirmado() {
    cy.url().should("include", "/payment_done/");

    cy.get('[data-qa="order-placed"]')
      .should("be.visible")
      .and("contain.text", "Order Placed!");

    cy.contains("Congratulations! Your order has been confirmed!")
      .should("be.visible");
  }
}

export default new PagamentoPage();
