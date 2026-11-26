
import ContaApi from "../api/ContaApi";
import { gerarUsuario } from "../factories/usuarioFactory";
import LoginPage from "../pages/LoginPage";
import ProdutosPage from "../pages/ProdutosPage";
import DetalhesProdutoPage from "../pages/DetalhesProdutoPage";
import CarrinhoPage from "../pages/CarrinhoPage";
import CheckoutPage from "../pages/CheckoutPage";
import PagamentoPage from "../pages/PagamentoPage";
import { converterPreco } from "../utils/moeda";

describe("Compra completa - E2E", () => {
  let usuario;
  let produto;
  let segundoProduto;
  let cadastroSolicitado;

  const quantidade = 2;
  const segundaQuantidade = 1;

  beforeEach(() => {
    usuario = gerarUsuario();
    cadastroSolicitado = false;

    cy.request("GET", "/api/productsList").then((response) => {
      const body = ContaApi.interpretarResposta(response);

      expect(response.status).to.eq(200);
      expect(body.responseCode).to.eq(200);
      expect(body.products).to.be.an("array");
      expect(body.products.length).to.be.at.least(2);

      produto = body.products[0];

      segundoProduto = body.products.find(
        (item) => item.id !== produto.id
      );

      expect(segundoProduto).to.exist;
    });

    cy.then(() => {
      cadastroSolicitado = true;
      return ContaApi.criarConta(usuario);
    });
  });

  afterEach(() => {
  if (cadastroSolicitado) {
    ContaApi.excluirConta(usuario, true);
    ContaApi.validarContaInexistente(usuario.email);
  }
});

  it("deve realizar uma compra completa com sucesso", () => {
    const precoUnitario = converterPreco(produto.price);

    const segundoPrecoUnitario = converterPreco(segundoProduto.price);

    const totalEsperado =
      precoUnitario * quantidade +
      segundoPrecoUnitario * segundaQuantidade;

    const cartao = {
      nome: `${usuario.firstname} ${usuario.lastname}`,
      numero: "4111111111111111",
      cvc: "123",
      mes: "12",
      ano: String(new Date().getFullYear() + 2)
    };

    // 1. Realizar login
    LoginPage.acessar();
    LoginPage.realizarLogin(usuario);
    LoginPage.validarUsuarioAutenticado(usuario.name);

    // 2. Adicionar o primeiro produto
    ProdutosPage.acessar();
    ProdutosPage.visualizarProduto(produto.id);
    DetalhesProdutoPage.alterarQuantidade(quantidade);
    DetalhesProdutoPage.adicionarAoCarrinho();
    DetalhesProdutoPage.visualizarCarrinho();

    // 3. Adicionar o segundo produto
    ProdutosPage.acessar();
    ProdutosPage.adicionarAoCarrinho(segundoProduto.id);
    ProdutosPage.visualizarCarrinho();

    // 4. Validar o carrinho
    cy.url().should("include", "/view_cart");

    CarrinhoPage.obterProdutos()
      .should("have.length", 2);

    CarrinhoPage.obterQuantidade(produto.id)
      .should("have.text", String(quantidade));

    CarrinhoPage.obterQuantidade(segundoProduto.id)
      .should("have.text", String(segundaQuantidade));

    // 5. Validar checkout
    CheckoutPage.prosseguirParaCheckout();
    CheckoutPage.validarEnderecos(usuario);
    CheckoutPage.validarProduto(produto, quantidade);
    CheckoutPage.validarProduto(
      segundoProduto,
      segundaQuantidade
    );
    CheckoutPage.validarTotalCompra(totalEsperado);

    cy.screenshot("E2E-01-checkout-validado");

    // 6. Realizar pedido
    CheckoutPage.preencherComentario(
      "Pedido ficticio realizado por automacao de QA."
    );

    CheckoutPage.realizarPedido();

    // 7. Efetuar pagamento ficticio
    PagamentoPage.preencherDadosPagamento(cartao);
    PagamentoPage.confirmarPagamento();

    // 8. Validar confirmacao
    PagamentoPage.validarPedidoConfirmado();

    cy.screenshot("E2E-02-pedido-confirmado");
  });
});
