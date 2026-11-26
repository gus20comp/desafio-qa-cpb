
class LoginPage {
  acessar() {
    cy.visit("/login");
  }

  preencherEmail(email) {
    cy.get('[data-qa="login-email"]')
      .should("be.visible")
      .clear()
      .type(email);
  }

  preencherSenha(senha) {
    cy.get('[data-qa="login-password"]')
      .should("be.visible")
      .clear()
      .type(senha, { log: false });
  }

  clicarEntrar() {
    cy.get('[data-qa="login-button"]')
      .should("be.visible")
      .click();
  }

  realizarLogin(usuario) {
    this.preencherEmail(usuario.email);
    this.preencherSenha(usuario.password);
    this.clicarEntrar();
  }

  validarUsuarioAutenticado(nome) {
    cy.contains("a", "Logged in as")
      .should("be.visible")
      .and("contain.text", nome);
  }
}

export default new LoginPage();
