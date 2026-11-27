
# Resultado da Regressão Pós-Refatoração

## 1. Identificação

- Projeto: Desafio Prático de QA — CPB
- Responsável: Gustavo Andrade
- Ambiente: GitHub Codespaces
- Commit base: 5105a04
- Versão executada: alterações locais posteriores ao commit base
- Framework: Cypress 16.4.0
- Node.js: 24.22.2
- Navegador: Electron 150 — Headless

## 2. Objetivo

Validar a integridade da automação após a reorganização
das suítes Smoke e Regression, atendendo ao requisito
de separação física estabelecido pelo desafio.

## 3. Alterações realizadas

- Separação dos testes em pastas smoke e regression.
- Movimentação dos oito arquivos de teste.
- Atualização dos imports relativos.
- Atualização dos comandos de execução.
- Configuração explícita de testIsolation.
- Atualização das referências na documentação.
- Reorganização da matriz de riscos por frente.

A lógica funcional dos testes foi preservada.

## 4. Validações preliminares

| Validação | Resultado |
|---|---|
| Preflight da página inicial | Aprovado |
| Preflight da API de produtos | Aprovado |
| Produtos retornados pela API | 34 |
| Imports relativos verificados | 19 |
| Imports válidos | 19 |
| Imports inválidos | 0 |
| Smoke Testing | 3/3 aprovados |

## 5. Comando executado

    npm run test:regression

## 6. Resultado consolidado

| Indicador | Resultado |
|---|---:|
| Arquivos executados | 8 |
| Arquivos aprovados | 8 |
| Testes executados | 21 |
| Testes contabilizados como aprovados | 21 |
| Testes convencionais aprovados | 20 |
| Expected Failure reproduzido | 1 |
| Falhas inesperadas | 0 |
| Testes pendentes | 0 |
| Testes ignorados | 0 |
| Screenshots gerados | 3 |
| Duração total | 1 minuto e 11 segundos |

## 7. Resultado por arquivo

| Arquivo | Testes | Aprovados |
|---|---:|---:|
| regression/api-negativos.cy.js | 7 | 7 |
| regression/carrinho-known-bugs.cy.js | 1 | 1 |
| regression/carrinho.cy.js | 7 | 7 |
| regression/catalogo-ui-api.cy.js | 1 | 1 |
| regression/compra-e2e.cy.js | 1 | 1 |
| regression/conta-api.cy.js | 1 | 1 |
| smoke/acesso-loja.cy.js | 1 | 1 |
| smoke/catalogo-api.cy.js | 2 | 2 |
| Total | 21 | 21 |

## 8. Evidências

- [Log completo da execução](resultado-cypress.txt)
- [Reprodução do BUG-001](BUG-001-expected-failure.png)
- [Checkout validado](E2E-01-checkout-validado.png)
- [Pedido confirmado](E2E-02-pedido-confirmado.png)

## 9. Expected Failure

O BUG-001 permanece reproduzível.

O teste utiliza uma estratégia personalizada de
Expected Failure, contabilizada pelo Cypress como
aprovação quando o comportamento defeituoso conhecido
é reproduzido conforme as condições verificadas.

A aprovação desse teste não significa que o defeito
foi corrigido.

## 10. Limitações

A execução foi realizada em GitHub Codespaces.

A restrição externa anteriormente observada no
GitHub Actions permanece documentada e não foi
revalidada nesta execução.

O navegador Electron apresentou aviso de depreciação,
sem impedir a execução dos testes.

Os resultados representam o comportamento observado
durante esta execução, não uma garantia de estabilidade
permanente do ambiente público.

## 11. Conclusão

A reorganização das suítes foi validada com sucesso.

Os 21 testes foram executados sem falhas inesperadas,
preservando a cobertura automatizada anteriormente
estabelecida.

A regressão anterior permanece disponível como
evidência histórica da arquitetura original.

A aprovação técnica da automação não representa
aceitação definitiva do produto, considerando os
achados e riscos documentados.

## 12. Referências

- [README](../../README.md)
- [Planejamento](../../PLANEJAMENTO.md)
- [Cenários](../../CENARIOS.md)
- [Achados](../../ACHADOS.md)
- [Decisões técnicas](../../DECISOES.md)
- [Uso de inteligência artificial](../../USO-IA.md)
- [Regressão anterior](../REGRESSAO-FINAL/RESULTADO.md)
