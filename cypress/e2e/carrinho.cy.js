import ProdutosPage from "../pages/ProdutosPage";
import CarrinhoPage from "../pages/CarrinhoPage";
import DetalhesProdutoPage from "../pages/DetalhesProdutoPage";

describe("Carrinho de compras - Visitante", () => {

  let produto;
  let segundoProduto;

  beforeEach(() => {
    cy.request("GET", "/api/productsList")
      .then((response) => {

        const body = typeof response.body === "string"
          ? JSON.parse(response.body)
          : response.body;

        expect(response.status).to.eq(200);
        expect(body.responseCode).to.eq(200);
        expect(body.products).to.be.an("array").and.not.be.empty;

        expect(body.products.length).to.be.at.least(2);

        produto = body.products[0];

        segundoProduto = body.products.find(
        (item) => item.id !== produto.id
        );

        expect(segundoProduto).to.exist;

      });
  });

  it("deve adicionar um produto ao carrinho sem autenticacao", () => {

    ProdutosPage.acessar();

    ProdutosPage.adicionarAoCarrinho(produto.id);

    ProdutosPage.visualizarCarrinho();

    cy.url().should("include", "/view_cart");

    CarrinhoPage.obterProduto(produto.id)
      .should("be.visible");

    CarrinhoPage.obterNome(produto.id)
      .should("have.text", produto.name);

    CarrinhoPage.obterPreco(produto.id)
      .should("have.text", produto.price);

    CarrinhoPage.obterQuantidade(produto.id)
      .should("have.text", "1");

    CarrinhoPage.obterSubtotal(produto.id)
      .should("have.text", produto.price);

    cy.contains("a", "Signup / Login")
      .should("be.visible");

  });
  const quantidades = [1, 2, 5];

quantidades.forEach((quantidade) => {

  it(`deve validar o subtotal para ${quantidade} unidade(s)`, () => {

    const precoUnitario = Number(
    produto.price.replace("Rs.", "").trim()
    );

    const subtotalEsperado = precoUnitario * quantidade;

    ProdutosPage.acessar();

    ProdutosPage.visualizarProduto(produto.id);

    DetalhesProdutoPage.alterarQuantidade(quantidade);

    DetalhesProdutoPage.adicionarAoCarrinho();

    DetalhesProdutoPage.visualizarCarrinho();

    cy.url().should("include", "/view_cart");

    CarrinhoPage.obterQuantidade(produto.id)
      .should("have.text", String(quantidade));

    CarrinhoPage.obterPreco(produto.id)
      .should("have.text", produto.price);

    CarrinhoPage.obterSubtotal(produto.id)
      .should(($subtotal) => {

        const subtotalObtido = Number(
        $subtotal.text().replace("Rs.", "").trim()
        );

        expect(subtotalObtido).to.eq(subtotalEsperado);

      });

  });

});

        it("deve adicionar multiplos produtos ao carrinho", () => {

        ProdutosPage.acessar();

        ProdutosPage.adicionarAoCarrinho(produto.id);

        ProdutosPage.continuarComprando();

        ProdutosPage.adicionarAoCarrinho(segundoProduto.id);

        ProdutosPage.visualizarCarrinho();

        cy.url().should("include", "/view_cart");

        CarrinhoPage.obterProdutos()
            .should("have.length", 2);

        const produtos = [produto, segundoProduto];

        produtos.forEach((item) => {

            CarrinhoPage.obterNome(item.id)
            .should("have.text", item.name);

            CarrinhoPage.obterPreco(item.id)
            .should("have.text", item.price);

            CarrinhoPage.obterQuantidade(item.id)
            .should("have.text", "1");

            CarrinhoPage.obterSubtotal(item.id)
            .should("have.text", item.price);

        });

        cy.contains("a", "Signup / Login")
            .should("be.visible");

        });

        it("deve remover um produto e manter os demais no carrinho", () => {

            ProdutosPage.acessar();

            ProdutosPage.adicionarAoCarrinho(produto.id);

            ProdutosPage.continuarComprando();

            ProdutosPage.adicionarAoCarrinho(segundoProduto.id);

            ProdutosPage.visualizarCarrinho();

            CarrinhoPage.obterProdutos()
                .should("have.length", 2);

            CarrinhoPage.removerProduto(produto.id);

            CarrinhoPage.obterProduto(produto.id)
                .should("not.exist");

            CarrinhoPage.obterProdutos()
                .should("have.length", 1);

            CarrinhoPage.obterProduto(segundoProduto.id)
                .should("be.visible");

            CarrinhoPage.obterNome(segundoProduto.id)
                .should("have.text", segundoProduto.name);

            CarrinhoPage.obterPreco(segundoProduto.id)
                .should("have.text", segundoProduto.price);

            CarrinhoPage.obterQuantidade(segundoProduto.id)
                .should("have.text", "1");

            CarrinhoPage.obterSubtotal(segundoProduto.id)
                .should("have.text", segundoProduto.price);

            });
            it("deve apresentar o carrinho vazio apos remover o ultimo produto", () => {

        ProdutosPage.acessar();

        ProdutosPage.adicionarAoCarrinho(produto.id);

        ProdutosPage.visualizarCarrinho();

        CarrinhoPage.obterProduto(produto.id)
            .should("be.visible");

        CarrinhoPage.removerProduto(produto.id);

        CarrinhoPage.obterProduto(produto.id)
            .should("not.exist");

        CarrinhoPage.obterMensagemCarrinhoVazio()
            .should("be.visible")
            .and("contain.text", "Cart is empty!");

        cy.contains("a", "Signup / Login")
            .should("be.visible");

        });

});