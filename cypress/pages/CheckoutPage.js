
class CheckoutPage {
  prosseguirParaCheckout() {
    cy.contains("a", "Proceed To Checkout")
      .should("be.visible")
      .click();

    cy.url().should("include", "/checkout");
  }

  validarEndereco(seletor, usuario) {
    cy.get(seletor)
      .should("be.visible")
      .within(() => {
        cy.contains(`${usuario.firstname} ${usuario.lastname}`)
          .should("be.visible");

        cy.contains(usuario.company).should("be.visible");
        cy.contains(usuario.address1).should("be.visible");
        cy.contains(usuario.address2).should("be.visible");
        cy.contains(usuario.city).should("be.visible");
        cy.contains(usuario.state).should("be.visible");
        cy.contains(usuario.zipcode).should("be.visible");
        cy.contains(usuario.country).should("be.visible");
        cy.contains(usuario.mobile_number).should("be.visible");
      });
  }

  validarEnderecos(usuario) {
    this.validarEndereco("#address_delivery", usuario);
    this.validarEndereco("#address_invoice", usuario);
  }

  validarProduto(produto, quantidade) {
    const precoUnitario = Number(
      produto.price.replace("Rs.", "").trim()
    );

    const subtotalEsperado = precoUnitario * quantidade;

    cy.get(`#product-${produto.id}`)
      .should("be.visible")
      .within(() => {
        cy.get(".cart_description h4 a")
          .should("have.text", produto.name);

        cy.get(".cart_price p")
          .should("have.text", produto.price);

        cy.get(".cart_quantity")
          .should("contain.text", String(quantidade));

        cy.get(".cart_total_price").should(($subtotal) => {
          const subtotalObtido = Number(
            $subtotal.text().replace("Rs.", "").trim()
          );

          expect(subtotalObtido).to.eq(subtotalEsperado);
        });
      });
  }

  validarTotalCompra(totalEsperado) {
    cy.contains("td", "Total Amount")
      .parent()
      .find(".cart_total_price")
      .should(($total) => {
        const totalObtido = Number(
          $total.text().replace("Rs.", "").trim()
        );

        expect(totalObtido, "Total da compra")
          .to.eq(totalEsperado);
      });
  }

  preencherComentario(comentario) {
    cy.get('textarea[name="message"]')
      .should("be.visible")
      .type(comentario);
  }

  realizarPedido() {
    cy.contains("a", "Place Order")
      .should("be.visible")
      .click();

    cy.url().should("include", "/payment");
  }
}

export default new CheckoutPage();
