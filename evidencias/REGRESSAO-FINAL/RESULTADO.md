
# Resultado da Regressão Final

**Projeto:** Desafio Prático de QA — CPB
**Responsável:** Gustavo Andrade
**Ambiente:** GitHub Codespaces
**Commit de referência:** 587c3ca
**Branch:** main

## 1. Configuração da execução

| Componente | Versão |
|---|---|
| Cypress | 16.4.0 |
| Node.js | 24.22.2 |
| Navegador | Electron 150 |
| Modo | Headless |

Comando executado:

    npm run test:regression

## 2. Diagnóstico prévio de disponibilidade

| Verificação | Resultado |
|---|---|
| Página inicial | Aprovado |
| API de produtos | Aprovado |
| Status HTTP da página inicial | 200 |
| Status HTTP da API | 200 |
| Produtos encontrados | 34 |
| Preflight | Aprovado |

## 3. Resultado consolidado

| Indicador | Resultado |
|---|---:|
| Arquivos de teste | 8 |
| Testes previstos | 21 |
| Testes executados | 21 |
| Testes contabilizados como aprovados | 21 |
| Testes convencionais aprovados | 20 |
| Expected Failure reproduzido | 1 |
| Falhas inesperadas | 0 |
| Testes pendentes | 0 |
| Testes ignorados | 0 |
| Screenshots gerados | 3 |
| Duração total | 1 minuto e 5 segundos |
| Taxa de aprovação técnica | 100% |

## 4. Resultado por arquivo

| Arquivo | Executados | Aprovados | Falhas |
|---|---:|---:|---:|
| acesso-loja.cy.js | 1 | 1 | 0 |
| api-negativos.cy.js | 7 | 7 | 0 |
| carrinho-known-bugs.cy.js | 1 | 1 | 0 |
| carrinho.cy.js | 7 | 7 | 0 |
| catalogo-api.cy.js | 2 | 2 | 0 |
| catalogo-ui-api.cy.js | 1 | 1 | 0 |
| compra-e2e.cy.js | 1 | 1 | 0 |
| conta-api.cy.js | 1 | 1 | 0 |
| Total | 21 | 21 | 0 |

## 5. Cobertura do planejamento

| Indicador | Quantidade |
|---|---:|
| Cenários levantados | 42 |
| Cenários cobertos pela automação | 25 |
| Cenários complementares propostos | 17 |
| Cobertura dos cenários levantados | 59,5% |
| Testes automatizados implementados | 21 |

Um teste automatizado pode validar mais de um cenário.

O percentual representa a cobertura dos cenários
levantados no planejamento, não a cobertura de código
ou a cobertura integral da aplicação.

## 6. Expected Failure

O BUG-001 foi reproduzido durante a regressão.

A aplicação continua permitindo a inclusão de um
produto com quantidade zero no carrinho.

A automação caracteriza especificamente esse
comportamento conhecido.

O Cypress contabiliza a reprodução controlada
como um teste aprovado tecnicamente.

Portanto, a aprovação da suíte não significa
que o defeito foi corrigido.

## 7. Evidências

- [Log original da regressão](resultado-cypress.txt)
- [Reprodução do BUG-001](BUG-001-expected-failure.png)
- [Checkout validado](E2E-01-checkout-validado.png)
- [Confirmação do pedido](E2E-02-pedido-confirmado.png)

## 8. Limitações

- A execução foi realizada no GitHub Codespaces.
- A aprovação integral no GitHub Actions permanece
  não comprovada devido à restrição de acesso observada.
- O Electron apresentou advertência de descontinuação,
  sem impedir a execução dos testes.
- O ambiente público possui histórico de indisponibilidade.
- A execução bem-sucedida não elimina os riscos
  anteriormente identificados.
- Não foi comprovada a realização de pagamento real.

## 9. Conclusão

A regressão completa foi executada com sucesso,
com todos os oito arquivos de teste processados
e nenhuma falha inesperada.

O resultado demonstra a execução bem-sucedida
da cobertura automatizada nas condições observadas.

O parecer de qualidade permanece condicionado
ao tratamento ou à aceitação formal dos riscos
registrados no relatório de achados.

## 10. Documentação relacionada

- [Planejamento](../../PLANEJAMENTO.md)
- [Cenários de teste](../../CENARIOS.md)
- [Relatório de achados](../../ACHADOS.md)
- [Decisões técnicas](../../DECISOES.md)
- [Utilização de IA](../../USO-IA.md)
