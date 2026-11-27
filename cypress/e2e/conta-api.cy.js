
import ContaApi from "../api/ContaApi";
import { gerarUsuario } from "../factories/usuarioFactory";

describe("API - Ciclo de vida da conta", () => {
  let usuario;
  let cadastroSolicitado;

  function validarDadosUsuario(dadosObtidos, dadosEsperados) {
    const mapeamentoCampos = {
      name: "name",
      email: "email",
      title: "title",
      birth_day: "birth_date",
      birth_month: "birth_month",
      birth_year: "birth_year",
      first_name: "firstname",
      last_name: "lastname",
      company: "company",
      address1: "address1",
      address2: "address2",
      country: "country",
      zipcode: "zipcode",
      state: "state",
      city: "city"
    };

    expect(dadosObtidos).to.have.property("id");
    expect(dadosObtidos.id).not.to.be.null;
    expect(dadosObtidos.id).not.to.be.undefined;

    Object.entries(mapeamentoCampos).forEach(
      ([campoResposta, campoCadastro]) => {
        expect(dadosObtidos, `Campo: ${campoResposta}`)
          .to.have.property(campoResposta);

        expect(
          dadosObtidos[campoResposta],
          `Valor: ${campoResposta}`
        ).to.eq(dadosEsperados[campoCadastro]);
      }
    );
  }

  beforeEach(() => {
    usuario = gerarUsuario();
    cadastroSolicitado = false;
  });

  afterEach(() => {
    if (cadastroSolicitado) {
      ContaApi.excluirConta(usuario, true);
      ContaApi.validarContaInexistente(usuario.email);
    }
  });

  it("deve executar o ciclo de vida completo da conta", () => {
    const usuarioAtualizado = {
      ...usuario,
      name: "QA_Usuario Atualizado",
      lastname: "Atualizado",
      company: "Empresa QA Atualizada",
      address1: "Rua Atualizada, 200",
      address2: "Apartamento 20",
      zipcode: "54321",
      city: "Ottawa"
    };

    // 1. Criar conta
    cy.then(() => {
      cadastroSolicitado = true;
      return ContaApi.criarConta(usuario);
    });

    // 2. Validar os dados cadastrados
    ContaApi.consultarConta(usuario.email)
      .then((dadosObtidos) => {
        validarDadosUsuario(dadosObtidos, usuario);
      });

    // 3. Validar autenticacao
    ContaApi.verificarLogin(usuario);

    // 4. Atualizar dados pessoais
    ContaApi.atualizarConta(usuarioAtualizado);

    // 5. Confirmar persistencia das alteracoes
    ContaApi.consultarConta(usuario.email)
      .then((dadosObtidos) => {
        validarDadosUsuario(
          dadosObtidos,
          usuarioAtualizado
        );
      });

    // 6. Excluir conta
    ContaApi.excluirConta(usuarioAtualizado);

    // 7. Confirmar que a conta nao existe mais
    ContaApi.validarContaInexistente(usuario.email);

    // 8. Validar cleanup idempotente
    ContaApi.excluirConta(usuarioAtualizado, true)
      .then((body) => {
        expect(body.responseCode).to.eq(404);
      });

  // 9. Confirmar ausencia de dados residuais
  ContaApi.validarContaInexistente(usuario.email)
    .then(() => {
      cadastroSolicitado = false;
    });
  });
});
