
# Cenários de Teste — Loja Virtual

**Projeto:** Desafio Prático de QA — CPB
**Responsável:** Gustavo Andrade
**Versão:** 1.0

---

## 1. Objetivo

Documentar os cenários de teste definidos para as quatro frentes
do desafio, demonstrando a aplicação de técnicas de teste,
a cobertura automatizada e a rastreabilidade dos riscos.

Os comportamentos esperados foram definidos com base na
documentação pública, na exploração da aplicação e nas
premissas registradas no PLANEJAMENTO.md.

## 2. Convenções

### Prioridade

- P0 — Crítica para a jornada de negócio.
- P1 — Alta relevância funcional ou técnica.
- P2 — Cobertura complementar.

### Tipo de execução

- AUTO — Cenário automatizado.
- MANUAL — Cenário executado manualmente.
- PROPOSTO — Cenário ainda não executado.
- XFAIL — Defeito conhecido cuja reprodução é automatizada.

### Técnicas utilizadas

- PE — Partição de equivalência.
- AVL — Análise de valor limite.
- TD — Tabela de decisão.
- TE — Transição de estado.
- DDT — Data-Driven Testing.
- EXP — Teste exploratório.
- INT — Teste de integração.
- E2E — Teste de ponta a ponta.

## 3. Disponibilidade da aplicação

| ID | Cenário | Resultado esperado | Técnica | Prioridade | Execução |
|---|---|---|---|---|---|
| CT-001 | Acessar a página inicial | Página correta, catálogo e opções essenciais disponíveis | Smoke | P0 | AUTO |

Arquivo:

`cypress/e2e/acesso-loja.cy.js`

Este cenário valida elementos funcionais da página,
não apenas o sucesso da navegação ou o status HTTP.

## 4. Frente 1 — Carrinho de visitante

### 4.1 Objetivo

Garantir que o visitante consiga adicionar, consultar e remover
produtos sem autenticação, preservando a integridade das
quantidades, dos preços e dos subtotais.

### 4.2 Cenários

| ID | Cenário | Resultado esperado | Técnica | Prioridade | Execução |
|---|---|---|---|---|---|
| CT-002 | Adicionar produto sem autenticação | Produto disponível no carrinho com nome, preço, quantidade e subtotal corretos | TE | P0 | AUTO |
| CT-003 | Adicionar uma unidade | Subtotal igual ao preço unitário | AVL / DDT | P0 | AUTO |
| CT-004 | Adicionar duas unidades | Subtotal igual ao preço unitário multiplicado por dois | AVL / DDT | P0 | AUTO |
| CT-005 | Adicionar cinco unidades | Subtotal igual ao preço unitário multiplicado por cinco | PE / DDT | P1 | AUTO |
| CT-006 | Adicionar dois produtos diferentes | Ambos os produtos apresentados com valores corretos | TE | P0 | AUTO |
| CT-007 | Remover um produto de um carrinho com dois itens | Apenas o produto selecionado é removido | TE | P1 | AUTO |
| CT-008 | Remover o último produto | Carrinho vazio e mensagem correspondente | TE | P1 | AUTO |
| CT-009 | Adicionar produto com quantidade zero | Operação rejeitada ou produto não incluído | AVL / EXP | P0 | MANUAL + XFAIL |
| CT-010 | Informar quantidade negativa | Entrada inválida rejeitada | PE / AVL | P1 | PROPOSTO |
| CT-011 | Informar quantidade decimal | Entrada inválida rejeitada | PE | P1 | PROPOSTO |
| CT-012 | Informar quantidade não numérica | Entrada inválida rejeitada | PE | P1 | PROPOSTO |
| CT-013 | Adicionar novamente o mesmo produto | Comportamento conforme regra de soma ou substituição | TD | P1 | PROPOSTO |
| CT-014 | Validar persistência após recarregar a página | Carrinho preservado durante a sessão | TE | P2 | PROPOSTO |
| CT-015 | Validar quantidade máxima permitida | Limites respeitados conforme regra de negócio | AVL | P1 | PROPOSTO |

Arquivos:

- `cypress/e2e/carrinho.cy.js`
- `cypress/e2e/carrinho-known-bugs.cy.js`

### 4.3 Partição de equivalência

| Partição | Exemplos | Comportamento esperado | Cobertura |
|---|---|---|---|
| Inteiros positivos | 1, 2, 5 | Aceitar quantidade | Automatizada |
| Quantidade zero | 0 | Rejeitar quantidade | Manual e XFAIL |
| Inteiros negativos | -1, -5 | Rejeitar quantidade | Proposta |
| Valores decimais | 1.5, 2.5 | Rejeitar quantidade | Proposta |
| Valores não numéricos | abc | Rejeitar entrada | Proposta |
| Acima do limite máximo | Limite + 1 | Rejeitar quantidade | Depende de definição |

### 4.4 Análise de valor limite

Considerando a premissa de quantidade mínima igual a 1:

| Valor | Posição | Resultado esperado | Cobertura |
|---|---|---|---|
| 0 | Limite inferior - 1 | Inválido | XFAIL |
| 1 | Limite inferior | Válido | AUTO |
| 2 | Limite inferior + 1 | Válido | AUTO |

O valor máximo não foi definido na documentação disponível.

Não foram realizados testes com quantidades excessivas,
considerando as restrições do ambiente compartilhado.

### 4.5 Transição de estado

| Estado inicial | Ação | Estado esperado | Cenário |
|---|---|---|---|
| Carrinho vazio | Adicionar produto | Carrinho com um produto | CT-002 |
| Carrinho com um produto | Adicionar outro produto | Carrinho com dois produtos | CT-006 |
| Carrinho com dois produtos | Remover um produto | Carrinho com um produto | CT-007 |
| Carrinho com um produto | Remover último produto | Carrinho vazio | CT-008 |
| Carrinho vazio | Adicionar quantidade zero | Carrinho permanece vazio | CT-009 |

### 4.6 Exemplo de cenário em Gherkin

Cenário: Validar subtotal de um produto

    Dado que o visitante acessou um produto do catálogo
    E que o preço unitário foi obtido pela API
    Quando informar uma quantidade válida
    E adicionar o produto ao carrinho
    Então o produto deverá ser apresentado no carrinho
    E a quantidade deverá corresponder ao valor informado
    E o subtotal deverá ser igual ao preço multiplicado pela quantidade
    E o visitante deverá permanecer sem autenticação

Os valores 1, 2 e 5 são utilizados na automação data-driven.

### 4.7 Defeito conhecido

O CT-009 está relacionado ao BUG-001.

Resultado observado:

- A aplicação permite adicionar um produto com quantidade zero.
- O carrinho apresenta quantidade zero.
- O subtotal apresentado é Rs. 0.

A automação identifica especificamente esse comportamento
como falha esperada.

O Cypress contabiliza a reprodução controlada como um teste
aprovado tecnicamente. Isso não representa aprovação funcional.

A regra de quantidade mínima deve ser confirmada pelo PO.

## 5. Frente 2 — Catálogo e busca

### 5.1 Objetivo

Validar a disponibilidade, a estrutura e a consistência dos
dados apresentados pela interface e pela API.

### 5.2 Cenários

| ID | Cenário | Resultado esperado | Técnica | Prioridade | Execução |
|---|---|---|---|---|---|
| CT-016 | Consultar lista de produtos pela API | HTTP 200, código de negócio 200 e estrutura válida | PE | P0 | AUTO |
| CT-017 | Pesquisar produtos pela API | HTTP 200 e lista de resultados válida | PE | P1 | AUTO |
| CT-018 | Comparar pesquisa da interface com a API | Conjuntos de nomes equivalentes para o termo pesquisado | INT | P0 | AUTO |
| CT-019 | Pesquisar sem parâmetro obrigatório pela API | Código de negócio 400 e mensagem correspondente | PE | P1 | AUTO |
| CT-020 | Utilizar POST na listagem de produtos | Código de negócio 405 e mensagem correspondente | TD | P1 | AUTO |
| CT-021 | Pesquisar termo inexistente | Nenhum resultado e comportamento adequado | PE | P1 | PROPOSTO |
| CT-022 | Pesquisar com diferenças de capitalização | Comportamento conforme regra de normalização | PE | P2 | PROPOSTO |
| CT-023 | Pesquisar com espaços adicionais | Comportamento conforme regra de normalização | PE | P2 | PROPOSTO |
| CT-024 | Utilizar PUT na listagem de marcas | Código de negócio 405 e mensagem correspondente | TD | P1 | AUTO |

Arquivos:

- `cypress/e2e/catalogo-api.cy.js`
- `cypress/e2e/catalogo-ui-api.cy.js`
- `cypress/e2e/api-negativos.cy.js`

### 5.3 Partição de equivalência da busca

| Entrada | Classe | Cobertura |
|---|---|---|
| Termo existente: top | Válida | Automatizada |
| Parâmetro ausente | Inválida | Automatizada |
| Termo inexistente | Válida sem correspondência | Proposta |
| Termo vazio | Depende do contrato | Proposta |
| Diferenças de capitalização | Depende da regra | Proposta |
| Espaços adicionais | Depende da regra | Proposta |

### 5.4 Exemplo de cenário em Gherkin

Cenário: Comparar resultados da pesquisa

    Dado que a API retornou produtos para um termo de pesquisa
    Quando pesquisar o mesmo termo na interface
    Então os nomes dos produtos apresentados deverão corresponder
    aos nomes retornados pela API

A automação ordena os nomes antes da comparação,
evitando dependência da ordem de apresentação.

A cobertura não garante a equivalência de todos os atributos
do catálogo nem de todos os termos possíveis de pesquisa.

## 6. Frente 3 — API de conta

### 6.1 Objetivo

Validar o ciclo de vida da conta, a persistência dos dados,
a autenticação e a exclusão dos registros fictícios.

### 6.2 Cenários

| ID | Cenário | Resultado esperado | Técnica | Prioridade | Execução |
|---|---|---|---|---|---|
| CT-025 | Criar, consultar, autenticar, atualizar e excluir conta | Todas as transições válidas e dados consistentes | TE | P0 | AUTO |
| CT-026 | Verificar login sem e-mail | Código de negócio 400 | TD / PE | P1 | AUTO |
| CT-027 | Verificar login sem senha | Código de negócio 400 | TD / PE | P1 | AUTO |
| CT-028 | Verificar login com credenciais inexistentes | Código de negócio 404 | TD / PE | P1 | AUTO |
| CT-029 | Utilizar DELETE no endpoint de login | Código de negócio 405 | TD | P1 | AUTO |
| CT-030 | Consultar conta após exclusão | Código de negócio 404 e ausência do objeto user | TE | P0 | AUTO — CT-025 |
| CT-031 | Excluir novamente uma conta já removida | Código de negócio 404 e conta permanece inexistente | TE | P1 | AUTO — CT-025 |
| CT-032 | Criar conta com e-mail duplicado | Duplicidade rejeitada | PE | P1 | PROPOSTO |
| CT-033 | Criar conta com campos obrigatórios ausentes | Cadastro rejeitado | TD | P1 | PROPOSTO |
| CT-034 | Atualizar conta com dados inválidos | Atualização rejeitada e dados preservados | PE | P1 | PROPOSTO |
| CT-035 | Consultar dados pessoais sem autorização | Acesso conforme política de privacidade | TD | P0 | PROPOSTO |
| CT-036 | Verificar ausência de senha na resposta de consulta | Dados sensíveis não expostos | EXP | P0 | PROPOSTO |

Arquivos:

- `cypress/e2e/conta-api.cy.js`
- `cypress/e2e/api-negativos.cy.js`
- `cypress/api/ContaApi.js`
- `cypress/factories/usuarioFactory.js`

### 6.3 Transição de estado da conta

| Estado inicial | Operação | Estado esperado | Código de negócio |
|---|---|---|---:|
| Inexistente | Criar conta | Criada | 201 |
| Criada | Consultar conta | Criada | 200 |
| Criada | Verificar login | Credenciais validadas | 200 |
| Criada | Atualizar conta | Atualizada | 200 |
| Atualizada | Consultar conta | Dados atualizados | 200 |
| Atualizada | Excluir conta | Excluída | 200 |
| Excluída | Consultar conta | Inexistente | 404 |
| Excluída | Excluir novamente | Inexistente | 404 |

O fluxo é executado em um único teste independente.

As operações não dependem de outros testes para preparar
ou remover os dados.

### 6.4 Tabela de decisão — Verificação de login

| Condição | Regra 1 | Regra 2 | Regra 3 | Regra 4 | Regra 5 |
|---|---|---|---|---|---|
| Método POST | Sim | Sim | Sim | Sim | Não |
| E-mail informado | Sim | Não | Sim | Sim | — |
| Senha informada | Sim | Sim | Não | Sim | — |
| Credenciais válidas | Sim | — | — | Não | — |
| Código de negócio | 200 | 400 | 400 | 404 | 405 |
| Cenário | CT-025 | CT-026 | CT-027 | CT-028 | CT-029 |

### 6.5 Validação dos dados pessoais

O teste de ciclo de vida compara os valores cadastrados
e atualizados com os valores recuperados pela API.

Campos validados:

- name
- email
- title
- birth_day
- birth_month
- birth_year
- first_name
- last_name
- company
- address1
- address2
- country
- zipcode
- state
- city

Também é validada a existência do identificador da conta.

O campo mobile_number não foi disponibilizado na resposta
de consulta observada. Seu valor é validado nos endereços
apresentados durante o checkout.

A ausência desse campo na consulta não foi classificada
automaticamente como defeito, pois o contrato não estabelece
claramente sua obrigatoriedade na resposta.

A cobertura atual não constitui uma auditoria de privacidade
ou segurança. Testes adicionais devem ser realizados em
ambiente autorizado, utilizando somente contas próprias.

## 7. Frente 4 — Compra de ponta a ponta

### 7.1 Objetivo

Validar a integração entre cadastro, autenticação,
catálogo, carrinho, checkout e confirmação do pedido.

### 7.2 Cenários

| ID | Cenário | Resultado esperado | Técnica | Prioridade | Execução |
|---|---|---|---|---|---|
| CT-037 | Realizar compra completa com conta criada pela API | Pedido confirmado e dados consistentes durante a jornada | E2E / TE | P0 | AUTO |
| CT-038 | Validar endereço de entrega e cobrança | Dados correspondentes ao cadastro fictício | INT | P0 | AUTO — CT-037 |
| CT-039 | Validar subtotal e total do checkout | Valores calculados a partir dos preços da API | INT | P0 | AUTO — CT-037 |
| CT-040 | Tentar finalizar compra sem autenticação | Solicitação de autenticação conforme regra | TD | P1 | PROPOSTO |
| CT-041 | Tentar finalizar compra com dados de pagamento ausentes | Pedido não confirmado | PE / TD | P1 | PROPOSTO |
| CT-042 | Verificar persistência independente do pedido | Pedido recuperável por mecanismo autorizado | INT | P1 | PROPOSTO |

Arquivo:

`cypress/e2e/compra-e2e.cy.js`

### 7.3 Fluxo automatizado

1. Gerar usuário fictício com e-mail único e prefixo QA_.
2. Consultar o catálogo pela API.
3. Selecionar dois produtos distintos.
4. Criar a conta pela API.
5. Realizar login pela interface.
6. Confirmar a autenticação.
7. Adicionar o primeiro produto com duas unidades.
8. Adicionar o segundo produto com uma unidade.
9. Validar os produtos e as quantidades no carrinho.
10. Prosseguir para o checkout.
11. Validar os endereços de entrega e cobrança.
12. Validar preços e subtotais.
13. Validar o total geral.
14. Realizar o pedido.
15. Informar dados fictícios de pagamento.
16. Confirmar o pedido.
17. Validar a mensagem de confirmação.
18. Excluir a conta criada.
19. Validar a inexistência da conta após a exclusão.

### 7.4 Regra de cálculo

Subtotal = preço unitário x quantidade

Total = soma dos subtotais

Os preços e identificadores são obtidos dinamicamente pela API.

Não são utilizados valores monetários fixos como resultado
esperado dos produtos selecionados.

### 7.5 Evidências

- [Checkout validado](evidencias/E2E-001/E2E-01-checkout-validado.png)
- [Pedido confirmado](evidencias/E2E-001/E2E-02-pedido-confirmado.png)

A confirmação visual comprova o encerramento da jornada
simulada, mas não comprova processamento financeiro real
nem persistência independente do pedido.

## 8. Validação dos contratos HTTP

Os testes negativos comparam o status HTTP com os códigos
e mensagens de negócio presentes no corpo da resposta.

| Operação | HTTP observado | Código no corpo |
|---|---:|---:|
| POST productsList | 200 | 405 |
| POST searchProduct sem parâmetro | 200 | 400 |
| POST verifyLogin sem e-mail | 200 | 400 |
| POST verifyLogin sem senha | 200 | 400 |
| POST verifyLogin com credenciais inexistentes | 200 | 404 |
| DELETE verifyLogin | 200 | 405 |
| PUT brandsList | 200 | 405 |

O comportamento observado foi preservado nas asserções
para caracterizar o contrato atual.

Isso não representa aprovação da semântica HTTP utilizada.

As inconsistências são registradas como ACHADO-002
e ACHADO-003.

## 9. Matriz de rastreabilidade

| Risco | Cenários relacionados | Cobertura |
|---|---|---|
| R01 — Valor incorreto no pedido | CT-037, CT-039 | Automatizada |
| R02 — Quantidade inválida | CT-009 a CT-012, CT-015 | Parcial / XFAIL |
| R03 — Dados pessoais | CT-025, CT-035, CT-036, CT-038 | Parcial |
| R04 — Falha na conclusão da compra | CT-037, CT-040 a CT-042 | Parcial |
| R05 — Subtotal incorreto | CT-003 a CT-005, CT-039 | Automatizada |
| R06 — Indisponibilidade | CT-001 e Preflight Check | Parcial |
| R07 — Ciclo de vida da conta | CT-025, CT-030 a CT-034 | Parcial |
| R08 — Divergência UI/API | CT-016 a CT-018 | Automatizada no recorte |
| R09 — Semântica HTTP | CT-019, CT-020, CT-024, CT-026 a CT-029 | Caracterização automatizada |
| R10 — Remoção incorreta | CT-007, CT-008 | Automatizada |
| R11 — Busca inconsistente | CT-017 a CT-023 | Parcial |
| R12 — Content-Type inadequado | CT-016, CT-020 | Evidência técnica |

Os riscos são definidos no PLANEJAMENTO.md.

## 10. Inventário da automação

| Arquivo | Testes | Cenários relacionados |
|---|---:|---|
| acesso-loja.cy.js | 1 | CT-001 |
| carrinho.cy.js | 7 | CT-002 a CT-008 |
| carrinho-known-bugs.cy.js | 1 | CT-009 |
| catalogo-api.cy.js | 2 | CT-016, CT-017 |
| catalogo-ui-api.cy.js | 1 | CT-018 |
| api-negativos.cy.js | 7 | CT-019, CT-020, CT-024, CT-026 a CT-029 |
| conta-api.cy.js | 1 | CT-025, CT-030, CT-031 |
| compra-e2e.cy.js | 1 | CT-037 a CT-039 |
| **Total** | **21** | |

## 11. Resumo da cobertura

| Indicador | Quantidade |
|---|---:|
| Cenários documentados | 42 |
| Cenários cobertos pela automação | 25 |
| Cenários propostos para execução futura | 17 |
| Testes automatizados independentes | 21 |
| Arquivos de testes | 8 |
| Testes funcionais e técnicos convencionais | 20 |
| Teste de falha esperada | 1 |

O número de cenários documentados é diferente do número
de testes implementados, pois um teste encadeado pode
validar múltiplos cenários relacionados.

O CT-009 também foi executado manualmente e posteriormente
automatizado como reprodução de defeito conhecido.

## 12. Organização das suítes

| Suíte | Comando | Testes |
|---|---|---:|
| Smoke | npm run test:smoke | 3 |
| API | npm run test:api | 10 |
| E2E/UI | npm run test:e2e | 11 |
| Regression | npm run test:regression | 21 |

A suíte Smoke é um subconjunto da regressão.

As suítes API e E2E/UI, em conjunto, abrangem os 21 testes.

## 13. Critérios para automação

Foram priorizados cenários com:

- Alto impacto para o negócio.
- Resultados verificáveis objetivamente.
- Necessidade de execução recorrente.
- Dados disponíveis dinamicamente.
- Potencial de reaproveitamento.
- Integração entre componentes.

Cenários dependentes de regras não confirmadas, autorização
adicional ou infraestrutura específica foram mantidos como
propostas de cobertura futura.

## 14. Limitações e riscos residuais

- Limite máximo de quantidade não definido.
- Cobertura parcial de entradas inválidas.
- Pesquisa automatizada com um termo representativo.
- Ausência de auditoria completa de privacidade.
- Ausência de testes de pagamento real.
- Ausência de validação independente da persistência do pedido.
- Ausência de auditoria completa de acessibilidade.
- Instabilidade do ambiente público.
- Restrição de acesso observada no GitHub Actions.

Os cenários propostos não são contabilizados como executados
ou aprovados.

## 15. Referências internas

- [Planejamento de testes](PLANEJAMENTO.md)
- [Bugs e achados](ACHADOS.md)
- [Decisões técnicas](DECISOES.md)
- [Uso de inteligência artificial](USO-IA.md)
- [Instruções de execução](README.md)
