
# Utilização de Inteligência Artificial

**Projeto:** Desafio Prático de QA — Comitê Paralímpico Brasileiro (CPB)
**Responsável:** Gustavo Andrade
**Versão:** 1.0

---

## 1. Objetivo

Documentar de maneira transparente a utilização de
inteligência artificial durante o desenvolvimento
do desafio, apresentando sua contribuição, limitações,
erros identificados e mecanismos de validação humana.

A inteligência artificial foi utilizada como ferramenta
de apoio técnico e estratégico, e não como substituta
da análise crítica do profissional de qualidade.

## 2. Ferramenta utilizada

| Campo | Informação |
|---|---|
| Ferramenta | ChatGPT — OpenAI |
| Modalidade | Assistência conversacional |
| Abordagem | Desenvolvimento incremental e supervisionado |
| Execução dos testes | Realizada pelo responsável no GitHub Codespaces |
| Controle de versão | Git e GitHub |

A IA auxiliou na elaboração de códigos, estratégias,
documentação e investigação de problemas.

A execução dos comandos, a interação com a aplicação,
a análise das evidências e o versionamento foram
realizados pelo responsável pelo desafio.

## 3. Etapas em que a IA foi utilizada

| Etapa | Contribuição da IA |
|---|---|
| Análise do desafio | Interpretação do escopo e identificação dos entregáveis |
| Planejamento | Organização da estratégia orientada a riscos |
| Ambiente | Orientação para configuração do GitHub Codespaces |
| Arquitetura | Proposta de organização modular da automação |
| Cypress | Apoio na elaboração dos testes |
| Page Object Model | Organização dos componentes reutilizáveis |
| API | Construção de requisições e asserções |
| Dados de teste | Implementação da factory de usuários |
| Depuração | Análise de logs, erros e screenshots |
| Refatoração | Redução de duplicações e melhoria da manutenção |
| CI/CD | Elaboração do workflow do GitHub Actions |
| Preflight | Implementação do diagnóstico de disponibilidade |
| Documentação | Estruturação dos entregáveis técnicos |
| Revisão | Conferência de requisitos e identificação de lacunas |

## 4. Método de condução da IA

Foi adotada uma abordagem incremental,
com validação de cada etapa antes de avançar.

O fluxo de trabalho consistiu em:

1. Apresentar o contexto e o objetivo da etapa.
2. Solicitar uma proposta de implementação.
3. Analisar a solução sugerida.
4. Implementar a alteração no ambiente.
5. Executar os testes ou comandos.
6. Analisar os resultados reais.
7. Compartilhar logs e evidências quando necessário.
8. Investigar divergências.
9. Corrigir a implementação.
10. Reexecutar os testes afetados.
11. Versionar as alterações validadas.

Essa abordagem permitiu identificar problemas
nas sugestões antes da consolidação da solução.

Os resultados apresentados pela IA não foram
considerados evidências de execução.

Somente resultados efetivamente obtidos no ambiente
foram utilizados para comprovar a execução dos testes.

## 5. Skills, agentes e instruções

Não foram desenvolvidas skills personalizadas
ou agentes autônomos específicos para este desafio.

Foi utilizada uma abordagem conversacional,
com instruções contextualizadas e progressivas.

As principais diretrizes adotadas foram:

- Trabalhar em etapas pequenas e verificáveis.
- Não avançar sem analisar o resultado da etapa anterior.
- Utilizar Cypress conforme solicitado no desafio.
- Aplicar Page Object Model.
- Utilizar dados dinâmicos.
- Evitar identificadores fixos de produtos.
- Evitar esperas fixas.
- Preservar a independência dos testes.
- Utilizar exclusivamente dados fictícios.
- Realizar a limpeza das contas criadas.
- Investigar falhas antes de modificar a automação.
- Não ocultar defeitos ou falhas inesperadas.
- Preservar evidências.
- Diferenciar fatos observados de hipóteses.
- Versionar alterações incrementalmente.

Essas diretrizes funcionaram como um conjunto
de restrições de engenharia para orientar
as respostas e propostas da IA.

Não houve execução autônoma dos testes pela IA
nem acesso direto ao ambiente de desenvolvimento.

## 6. Erros identificados nas sugestões da IA

Durante o desenvolvimento, foram identificados
problemas em implementações inicialmente sugeridas.

Esses casos demonstram a importância da validação
prática e da supervisão humana.

---

### 6.1 IA-001 — Conversão incorreta de valores monetários

**Contexto:** validação dos subtotais do carrinho.

A implementação inicial utilizava uma expressão
regular para remover caracteres não numéricos,
preservando pontos.

Trecho inicialmente utilizado:

    .replace(/[^\d.]/g, "")

O formato monetário da aplicação utiliza o prefixo Rs.

A expressão preservava o ponto existente nesse prefixo,
produzindo conversões incorretas.

Exemplos:

| Valor original | Conversão incorreta | Valor correto |
|---|---:|---:|
| Rs. 500 | 0.5 | 500 |
| Rs. 1000 | 0.1 | 1000 |
| Rs. 2500 | 0.25 | 2500 |

**Como o problema foi identificado:**

Os testes de subtotal para duas e cinco unidades
apresentaram falhas.

A inspeção visual do carrinho demonstrou que
a aplicação calculava corretamente os valores.

Portanto, a divergência estava na automação,
e não na regra de cálculo da aplicação.

**Correção realizada:**

O prefixo monetário passou a ser removido
explicitamente antes da conversão.

Posteriormente, a lógica foi centralizada em:

    cypress/utils/moeda.js

A função passou a validar o formato recebido
e rejeitar valores inválidos.

**Validação:**

- Reexecução dos testes de carrinho.
- Reexecução do fluxo de compra.
- Validação isolada de entradas válidas e inválidas.

**Aprendizado:**

Uma falha de asserção não comprova,
isoladamente, um defeito na aplicação.

É necessário verificar também a construção
do resultado esperado.

---

### 6.2 IA-002 — Falso positivo na validação de quantidade zero

**Contexto:** investigação do BUG-001.

Durante a exploração manual, foi identificado
que a aplicação permitia adicionar um produto
ao carrinho com quantidade zero.

Entretanto, a primeira implementação automatizada
não reproduziu o comportamento observado.

A estratégia inicial acessava diretamente
a página do carrinho após a inclusão.

O teste indicou ausência do produto,
produzindo um resultado aparentemente positivo.

**Como o problema foi identificado:**

O resultado automatizado contradizia
a evidência obtida manualmente.

A divergência motivou uma revisão do fluxo
de navegação utilizado no teste.

**Correção realizada:**

A automação passou a utilizar o modal
apresentado após a inclusão do produto,
clicando na opção View Cart.

Essa abordagem reproduziu o fluxo real
executado durante a investigação manual.

O produto com quantidade zero passou
a ser identificado no carrinho.

**Hipótese técnica:**

A navegação direta poderia estar ocorrendo
antes da conclusão da operação de inclusão.

A causa exata dessa divergência não foi comprovada.

**Validação:**

O teste com a expectativa funcional original
apresentou falha ao encontrar o produto no carrinho.

Posteriormente, foi implementada a reprodução
controlada do defeito conhecido.

**Evidências:**

- [Reprodução manual](evidencias/BUG-001/quantidade-zero-carrinho.png)
- [Reprodução automatizada](evidencias/BUG-001/BUG-001-expected-failure.png)

**Aprendizado:**

Um teste aprovado também pode estar incorreto.

A automação precisa reproduzir adequadamente
o comportamento que pretende validar.

---

### 6.3 IA-003 — Tratamento incorreto de elementos jQuery

**Contexto:** comparação dos resultados de pesquisa
entre a interface e a API.

A implementação inicialmente sugerida utilizava
o operador spread diretamente sobre a coleção
de elementos retornada pelo Cypress.

Trecho inicial:

    [...$produtos]

A coleção recebida não apresentou o comportamento
de iteração esperado pela implementação.

**Como o problema foi identificado:**

O teste de integração apresentou erro
durante o processamento dos elementos da interface.

A análise do erro indicou que o problema estava
na manipulação da coleção, e não nos dados do catálogo.

**Correção realizada:**

A coleção passou a ser convertida explicitamente
em um array.

    const nomesDaTela = $produtos
      .toArray()
      .map((produto) => produto.innerText.trim())
      .sort();

**Validação:**

O teste de comparação entre interface e API
foi reexecutado com sucesso.

**Arquivo relacionado:**

    cypress/e2e/catalogo-ui-api.cy.js

**Aprendizado:**

É necessário considerar os tipos de objetos
retornados pelas ferramentas utilizadas.

Uma implementação válida para arrays JavaScript
não é necessariamente válida para coleções jQuery.

---

### 6.4 IA-004 — Mapeamento incorreto dos campos da API

**Contexto:** ampliação da validação dos dados pessoais
no ciclo de vida da conta.

A implementação inicial considerava que os nomes
dos campos enviados no cadastro seriam iguais
aos nomes retornados pela consulta da conta.

Essa premissa não correspondia ao contrato observado.

**Como o problema foi identificado:**

O teste apresentou falha ao procurar propriedades
que não estavam presentes com a nomenclatura esperada.

Foi realizada uma inspeção controlada das chaves
do objeto retornado pela API.

A investigação permitiu identificar a estrutura real
da resposta sem necessidade de utilizar dados pessoais reais.

**Correção realizada:**

Foi implementado um mapeamento explícito
entre os campos de entrada e de saída.

| Campo enviado | Campo retornado |
|---|---|
| firstname | first_name |
| lastname | last_name |
| birth_date | birth_day |

A validação passou a comparar os campos
considerando a nomenclatura efetivamente utilizada
pela API.

Também foi ampliada a cobertura para 15 campos,
além da verificação da existência do identificador.

**Validação:**

O teste de ciclo de vida da conta foi reexecutado
com sucesso, incluindo criação, consulta,
autenticação, atualização e exclusão.

**Arquivo relacionado:**

    cypress/e2e/conta-api.cy.js

**Aprendizado:**

O contrato de uma API deve ser validado
a partir de evidências e respostas reais.

Não se deve presumir que os objetos de entrada
e saída possuem estruturas idênticas.

---

### 6.5 IA-005 — Não atendimento inicial ao prefixo obrigatório

**Contexto:** revisão dos requisitos originais do desafio.

O documento do CPB estabelece que os nomes
das contas criadas devem começar com QA_.

A implementação inicial utilizava:

    name: "Usuario QA"

Embora o nome fosse fictício, ele não atendia
ao padrão explicitamente solicitado.

**Como o problema foi identificado:**

Durante a revisão do documento original,
foi realizada uma conferência dos requisitos
em relação à implementação existente.

A divergência foi identificada mesmo após
os testes funcionais terem sido aprovados.

**Correção realizada:**

A factory passou a utilizar:

    name: "QA_Usuario"

O teste de atualização da conta também foi ajustado:

    name: "QA_Usuario Atualizado"

**Arquivos relacionados:**

- cypress/factories/usuarioFactory.js
- cypress/e2e/conta-api.cy.js

**Validação:**

| Teste | Resultado |
|---|---|
| Ciclo de vida da conta | Aprovado |
| Compra completa E2E | Aprovado |

As evidências da compra foram atualizadas
após a correção.

Commit relacionado:

    a580e95

**Aprendizado:**

A aprovação funcional dos testes não garante
o atendimento integral aos requisitos do projeto.

A revisão de conformidade deve considerar também
as restrições operacionais e os padrões solicitados.

---

## 7. Resumo dos erros identificados

| ID | Problema | Consequência | Tratamento |
|---|---|---|---|
| IA-001 | Conversão monetária incorreta | Falsa falha | Corrigido e refatorado |
| IA-002 | Navegação inadequada no carrinho | Falsa aprovação | Fluxo revisado |
| IA-003 | Manipulação incorreta de coleção jQuery | Erro de execução | Conversão explícita para array |
| IA-004 | Suposição incorreta sobre campos da API | Falha de validação | Mapeamento dos campos |
| IA-005 | Prefixo obrigatório não atendido | Não conformidade com o desafio | Factory e teste corrigidos |

Esses problemas foram identificados por meio
de execução prática, análise de evidências
e revisão dos requisitos.

## 8. Situações que não foram classificadas como erros da IA

Durante o desenvolvimento, também foram observadas
falhas relacionadas ao ambiente externo.

Entre elas:

- Respostas HTTP 503.
- Páginas de indisponibilidade.
- Respostas HTML inesperadas.
- Página intermediária de verificação no GitHub Actions.

Essas situações foram investigadas antes
de qualquer alteração na automação.

Não havia evidência suficiente para atribuí-las
diretamente a erros de implementação da IA.

As ocorrências foram registradas como riscos ambientais
no relatório de achados.

## 9. Revisões e refatorações antes da entrega

As propostas iniciais foram revisadas
e aprimoradas durante o desenvolvimento.

| Componente | Revisão realizada |
|---|---|
| Carrinho | Revisão dos cálculos e da navegação |
| Conversão monetária | Centralização e validação de entradas |
| Conta API | Centralização das operações |
| Dados pessoais | Ampliação da validação de campos |
| Factory | Adequação ao prefixo obrigatório |
| Limpeza | Tratamento de exclusão e validação de inexistência |
| Expected Failure | Restrição ao comportamento conhecido |
| Smoke Testing | Fortalecimento das validações da página inicial |
| Pipeline | Inclusão do diagnóstico de disponibilidade |
| Evidências | Organização e validação dos caminhos |
| Documentação | Revisão de requisitos, riscos e limitações |

As alterações foram desenvolvidas de maneira
incremental e submetidas a novas execuções
quando aplicável.

## 10. Participação humana

A participação humana foi essencial
para a condução do desafio.

Entre as atividades realizadas pelo responsável:

- Configuração do ambiente de desenvolvimento.
- Execução dos comandos no terminal.
- Implementação das alterações propostas.
- Exploração manual da aplicação.
- Identificação de comportamentos divergentes.
- Coleta de screenshots.
- Compartilhamento dos logs de execução.
- Conferência dos resultados dos testes.
- Investigação das falhas observadas.
- Versionamento das alterações.
- Validação da existência das evidências.

A IA contribuiu com sugestões e análises,
mas não substituiu a execução prática.

A responsabilidade pela revisão e aprovação
da solução permanece com o profissional
que apresenta o desafio.

## 11. Limitações da inteligência artificial

Durante a utilização da ferramenta,
foram consideradas as seguintes limitações:

- Possibilidade de gerar código aparentemente correto,
  mas incompatível com o comportamento real.
- Suposições incorretas sobre contratos de API.
- Interpretação incompleta de requisitos.
- Propostas de implementação que exigem validação prática.
- Ausência de acesso direto ao estado do ambiente.
- Dependência dos logs e evidências fornecidos.
- Possibilidade de conclusões prematuras.

Essas limitações foram tratadas por meio
de desenvolvimento incremental, revisão
e execução dos testes.

## 12. Segurança e privacidade

A utilização da IA foi limitada ao contexto
técnico do desafio e aos dados fictícios utilizados.

Não foram necessárias credenciais reais,
dados financeiros reais ou informações
de contas de terceiros.

Não foram solicitadas técnicas para contornar
os mecanismos de proteção da aplicação.

A investigação de indisponibilidade foi realizada
com foco em diagnóstico e preservação de evidências.

## 13. Benefícios obtidos

A utilização supervisionada da IA contribuiu para:

- Organização do desenvolvimento.
- Apoio na elaboração dos testes.
- Identificação de alternativas de implementação.
- Investigação de erros.
- Refatoração de componentes.
- Estruturação da documentação.
- Revisão dos requisitos.
- Registro das limitações.
- Reaproveitamento de soluções.

Não foi realizada uma medição formal
de ganho de produtividade ou redução de tempo.

Portanto, os benefícios são apresentados
de maneira qualitativa.

## 14. Considerações finais

A inteligência artificial foi utilizada como
uma ferramenta de colaboração técnica.

O processo demonstrou que sugestões geradas por IA
precisam ser verificadas em relação aos requisitos,
ao comportamento da aplicação e aos resultados
efetivamente observados.

A identificação e a correção dos erros apresentados
reforçam a importância do pensamento crítico,
da investigação e da validação humana.

O objetivo não foi produzir uma automação
aparentemente perfeita, mas construir uma solução
rastreável, verificável e transparente sobre
seus resultados e limitações.

## 15. Referências internas

- [Planejamento de testes](PLANEJAMENTO.md)
- [Cenários e rastreabilidade](CENARIOS.md)
- [Bugs e achados](ACHADOS.md)
- [Decisões técnicas](DECISOES.md)
- [Instruções de execução](README.md)
