import ProdutosPage from "../pages/ProdutosPage";
import DetalhesProdutoPage from "../pages/DetalhesProdutoPage";
import CarrinhoPage from "../pages/CarrinhoPage";

describe("Carrinho - Defeitos conhecidos", () => {

  let produto;

  beforeEach(() => {

    cy.request("GET", "/api/productsList")
      .then((response) => {

        const body = typeof response.body === "string"
          ? JSON.parse(response.body)
          : response.body;

        expect(response.status).to.eq(200);
        expect(body.responseCode).to.eq(200);
        expect(body.products).to.be.an("array").and.not.be.empty;

        produto = body.products[0];

      });

  });

        it("[XFAIL][BUG-001] nao deve permitir produto com quantidade zero no carrinho", () => {

        ProdutosPage.acessar();

        ProdutosPage.visualizarProduto(produto.id);

        DetalhesProdutoPage.alterarQuantidade(0);

        DetalhesProdutoPage.adicionarAoCarrinho();

        DetalhesProdutoPage.visualizarCarrinho();

        cy.url().should("include", "/view_cart");

        cy.get("body").then(($body) => {

            const produtoNoCarrinho = $body.find(
            `#product-${produto.id}`
            );

            if (produtoNoCarrinho.length === 0) {
            throw new Error(
                "[XPASS][BUG-001] Defeito possivelmente corrigido. Revisar Expected Failure."
            );
            }

            CarrinhoPage.obterQuantidade(produto.id)
            .should("have.text", "0");

            CarrinhoPage.obterSubtotal(produto.id)
            .should("have.text", "Rs. 0");

            cy.log("[XFAIL][BUG-001] Defeito conhecido reproduzido");

            cy.screenshot("BUG-001-expected-failure");

        });

        });

  });

