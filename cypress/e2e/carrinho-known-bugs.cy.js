
import ProdutosPage from "../pages/ProdutosPage";
import DetalhesProdutoPage from "../pages/DetalhesProdutoPage";
import CarrinhoPage from "../pages/CarrinhoPage";

describe("Carrinho - Defeitos conhecidos", () => {
  let produto;

  beforeEach(() => {
    cy.request("GET", "/api/productsList")
      .then((response) => {
        expect(response.status, "Status HTTP").to.eq(200);

        const body = typeof response.body === "string"
          ? JSON.parse(response.body)
          : response.body;

        expect(body.responseCode).to.eq(200);
        expect(body.products).to.be.an("array").and.not.be.empty;

        produto = body.products[0];
      });
  });

  it("[XFAIL][BUG-001] nao deve permitir produto com quantidade zero no carrinho", () => {
    // 1. Acessar produto
    ProdutosPage.acessar();
    ProdutosPage.visualizarProduto(produto.id);

    // 2. Informar quantidade invalida
    DetalhesProdutoPage.alterarQuantidade(0);
    DetalhesProdutoPage.adicionarAoCarrinho();
    DetalhesProdutoPage.visualizarCarrinho();

    // 3. Confirmar carregamento do carrinho
    cy.url().should("include", "/view_cart");

    cy.get("#cart_items").should("be.visible");

    // 4. Identificar o comportamento apresentado
    cy.get("#cart_items").should(($carrinho) => {
      const produtoNoCarrinho = $carrinho.find(
        `#product-${produto.id}`
      );

      const carrinhoVazio = $carrinho.find(
        "#empty_cart:visible"
      );

      expect(
        produtoNoCarrinho.length > 0 ||
        carrinhoVazio.length > 0,
        "Estado reconhecido do carrinho"
      ).to.eq(true);
    }).then(($carrinho) => {
      const produtoNoCarrinho = $carrinho.find(
        `#product-${produto.id}`
      );

      if (produtoNoCarrinho.length === 0) {
        throw new Error(
          "[XPASS][BUG-001] Defeito possivelmente corrigido. Revisar Expected Failure."
        );
      }

      // 5. Confirmar exclusivamente o defeito conhecido
      CarrinhoPage.obterQuantidade(produto.id)
        .should("have.text", "0");

      CarrinhoPage.obterSubtotal(produto.id)
        .should("have.text", "Rs. 0");

      cy.log("[XFAIL][BUG-001] Defeito conhecido reproduzido");

      cy.screenshot("BUG-001-expected-failure");
    });
  });
});
