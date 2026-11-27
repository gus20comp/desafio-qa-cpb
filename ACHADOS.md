
# Relatório de Bugs, Achados e Melhorias

**Projeto:** Desafio Prático de QA — Comitê Paralímpico Brasileiro (CPB)
**Responsável:** Gustavo Andrade
**Versão:** 1.0
**Sistema avaliado:** Automation Exercise

---

## 1. Objetivo

Apresentar o diagnóstico de qualidade da aplicação,
consolidando os defeitos, inconsistências técnicas e riscos
identificados durante os testes manuais, exploratórios
e automatizados.

O relatório tem como finalidade apoiar a tomada de decisão
sobre a aceitação da entrega e orientar as correções
a serem discutidas com o fornecedor.

## 2. Resumo executivo

Foram identificados cinco achados relevantes durante
a avaliação da aplicação.

| ID | Descrição | Tipo | Severidade | Prioridade |
|---|---|---|---|---|
| BUG-001 | Carrinho aceita produto com quantidade zero | Bug funcional | Média | Alta |
| ACHADO-002 | Erros de negócio retornados com HTTP 200 | Melhoria técnica | Média | Alta |
| ACHADO-003 | JSON retornado com Content-Type text/html | Melhoria técnica | Baixa | Média |
| ACHADO-004 | Indisponibilidade intermitente da aplicação | Risco | Média | Alta |
| ACHADO-005 | Restrição de acesso no GitHub Actions | Risco | Alta para o CI | Alta |

As severidades e prioridades representam propostas de QA
e devem ser validadas com os responsáveis pelo produto.

O BUG-001 está fundamentado em uma premissa de negócio
que ainda precisa ser formalmente confirmada.

## 3. Critérios de classificação

### 3.1 Tipo

- Bug: comportamento divergente do resultado esperado.
- Regra que falta: comportamento sem definição suficiente.
- Melhoria: oportunidade de aprimoramento funcional ou técnico.
- Risco: condição que pode comprometer a qualidade,
  a operação ou a confiabilidade da entrega.

### 3.2 Severidade

- Crítica: comprometimento grave de uma operação essencial,
  perda de dados ou impacto financeiro relevante comprovado.
- Alta: comprometimento significativo de uma funcionalidade
  ou processo essencial.
- Média: comportamento incorreto com impacto relevante,
  mas sem comprometimento integral do sistema.
- Baixa: inconsistência de impacto limitado ou com
  alternativa de tratamento disponível.

### 3.3 Prioridade

- Alta: requer tratamento ou investigação prioritária.
- Média: deve ser planejada para correção.
- Baixa: pode ser tratada em evolução futura.

Severidade representa o impacto do problema.
Prioridade representa a urgência de seu tratamento.

---

## 4. BUG-001 — Carrinho aceita produto com quantidade zero

### Identificação

| Campo | Informação |
|---|---|
| Tipo | Bug funcional baseado em premissa de negócio |
| Frente | Carrinho de visitante |
| Severidade sugerida | Média |
| Prioridade sugerida | Alta |
| Status | Reproduzido |
| Cenário relacionado | CT-009 |
| Risco relacionado | R02 |
| Regra relacionada | Q01 do PLANEJAMENTO.md |

### Pré-condições

- Aplicação disponível.
- Visitante sem autenticação.
- Produto disponível no catálogo.
- Carrinho inicialmente vazio.

### Passos para reprodução

1. Acessar https://www.automationexercise.com/.
2. Acessar a listagem de produtos.
3. Selecionar um produto disponível.
4. Acessar os detalhes do produto.
5. Alterar a quantidade para zero.
6. Clicar em Add to cart.
7. Clicar em View Cart.
8. Verificar a quantidade e o subtotal apresentados.

### Resultado esperado

A aplicação deve impedir a inclusão de produtos com
quantidade inferior a uma unidade.

Uma mensagem de validação deve orientar o visitante
sobre o valor mínimo permitido.

O carrinho não deve conter um item com quantidade zero.

### Resultado obtido

A aplicação permite adicionar o produto ao carrinho
com quantidade zero.

O produto é apresentado com:

- Quantidade: 0.
- Subtotal: Rs. 0.

A opção de prosseguir para o checkout permanece visível.

### Impacto para o negócio

A aceitação de quantidades inválidas compromete
a integridade dos dados do carrinho.

Caso o comportamento seja propagado para outras etapas,
poderá resultar em:

- Inconsistências na composição de pedidos.
- Divergências em cálculos comerciais.
- Registros inválidos de produtos.
- Problemas em integrações com estoque e faturamento.
- Confusão para o consumidor.

Esses impactos posteriores são potenciais.
Não foi comprovada a conclusão de um pedido com
quantidade zero.

### Justificativa da severidade

A severidade foi classificada como média porque
o comportamento incorreto foi reproduzido no carrinho,
mas não foi demonstrado comprometimento financeiro
ou operacional nas etapas posteriores.

A prioridade é alta devido à relevância da integridade
das quantidades para o fluxo de compra.

### Sugestão de correção

- Definir formalmente a quantidade mínima permitida.
- Validar a quantidade na interface.
- Validar a quantidade também no servidor.
- Rejeitar valores inválidos antes da inclusão.
- Apresentar mensagem de validação compreensível.
- Revalidar as quantidades durante o checkout.

### Evidências

- [Reprodução manual](evidencias/BUG-001/quantidade-zero-carrinho.png)
- [Reprodução automatizada](evidencias/BUG-001/BUG-001-expected-failure.png)

### Automação

Arquivo:

`cypress/e2e/regression/carrinho-known-bugs.cy.js`

O cenário está identificado como:

`[XFAIL][BUG-001]`

A automação verifica especificamente a reprodução
do comportamento conhecido.

Quando o produto com quantidade zero é encontrado,
a automação confirma a quantidade e o subtotal inválidos,
registra a ocorrência e gera uma evidência.

Caso o carrinho seja apresentado vazio após a tentativa,
o teste sinaliza uma possível correção por meio de XPASS,
solicitando revisão da falha esperada.

Outras falhas não são ignoradas.

O Cypress contabiliza a reprodução controlada como
um teste aprovado tecnicamente.

Isso não significa que o comportamento funcional
da aplicação esteja correto.

### Observação de negócio

A quantidade mínima igual a uma unidade foi adotada
como premissa de QA.

A classificação definitiva deve ser confirmada com o PO.

---

## 5. ACHADO-002 — Erros de negócio retornados com HTTP 200

### Identificação

| Campo | Informação |
|---|---|
| Tipo | Melhoria técnica / inconsistência contratual |
| Frente | API |
| Severidade sugerida | Média |
| Prioridade sugerida | Alta |
| Status | Reproduzido |
| Cenários relacionados | CT-019, CT-020, CT-024, CT-026 a CT-029 |
| Risco relacionado | R09 |

### Pré-condições

- API disponível.
- Ferramenta para realização de requisições HTTP.

### Passos para reprodução

1. Enviar uma requisição POST ao endpoint de listagem
   de produtos.
2. Verificar o status HTTP.
3. Verificar o código e a mensagem no corpo da resposta.
4. Comparar os resultados.

### Requisição

    curl -i -X POST https://www.automationexercise.com/api/productsList

### Resultado esperado

Considerando as convenções de semântica HTTP,
um método não permitido deve retornar um status
HTTP correspondente ao erro.

Para o caso apresentado, recomenda-se HTTP 405.

O corpo da resposta deve complementar o status
com uma mensagem explicativa.

### Resultado obtido

Status HTTP:

    HTTP/2 200

Corpo da resposta:

    {
      "responseCode": 405,
      "message": "This request method is not supported."
    }

Existe uma divergência entre o sucesso informado
pelo status HTTP e o erro informado no corpo.

### Cobertura complementar

O comportamento também foi observado em outros
cenários negativos automatizados.

| Operação | HTTP | Código de negócio |
|---|---:|---:|
| POST productsList | 200 | 405 |
| POST searchProduct sem parâmetro | 200 | 400 |
| POST verifyLogin sem e-mail | 200 | 400 |
| POST verifyLogin sem senha | 200 | 400 |
| POST verifyLogin com credenciais inexistentes | 200 | 404 |
| DELETE verifyLogin | 200 | 405 |
| PUT brandsList | 200 | 405 |

### Impacto para o negócio

Consumidores da API que consideram apenas o status HTTP
podem interpretar operações rejeitadas como bem-sucedidas.

Isso pode comprometer:

- Tratamento de erros em integrações.
- Monitoramento de disponibilidade.
- Indicadores de sucesso e falha.
- Alertas operacionais.
- Confiabilidade dos sistemas consumidores.

### Sugestão de correção

- Alinhar os status HTTP à natureza da resposta.
- Padronizar os códigos e mensagens de negócio.
- Documentar o contrato de erros.
- Revisar os consumidores da API antes de alterar
  um contrato existente.
- Criar testes de contrato para respostas positivas
  e negativas.

### Evidência

- [Requisição e resposta HTTP](evidencias/ACHADO-002/metodo-http-invalido.txt)

### Automação

Arquivo:

`cypress/e2e/regression/api-negativos.cy.js`

Os testes validam simultaneamente o status HTTP,
o código de negócio e a mensagem de retorno.

O comportamento atual foi preservado nas asserções
para caracterizar a implementação observada.

### Observação

A documentação e o contrato oficial devem ser confirmados
com o fornecedor antes de classificar o comportamento
como violação definitiva de requisito.

---

## 6. ACHADO-003 — Resposta JSON com Content-Type text/html

### Identificação

| Campo | Informação |
|---|---|
| Tipo | Melhoria técnica |
| Frente | API |
| Severidade sugerida | Baixa |
| Prioridade sugerida | Média |
| Status | Reproduzido |
| Risco relacionado | R12 |

### Passos para reprodução

1. Realizar uma requisição à API de produtos.
2. Inspecionar os cabeçalhos da resposta.
3. Inspecionar o conteúdo retornado.
4. Comparar o formato do conteúdo com o Content-Type.

### Resultado esperado

Respostas cujo conteúdo é JSON devem utilizar
um tipo de mídia compatível, preferencialmente:

    Content-Type: application/json

### Resultado obtido

A API retorna conteúdo JSON com o cabeçalho:

    Content-Type: text/html; charset=utf-8

Esse comportamento foi observado em requisições
ao catálogo e em respostas de erro.

### Impacto para o negócio

Bibliotecas e ferramentas de integração podem não
interpretar automaticamente a resposta como JSON.

Consequências potenciais:

- Necessidade de conversões adicionais.
- Aumento da complexidade dos consumidores.
- Falhas de interpretação.
- Menor interoperabilidade.
- Maior custo de manutenção.

### Impacto observado na automação

Foi necessário implementar tratamento explícito
para interpretar respostas recebidas como texto.

A conversão condicional permite trabalhar tanto
com objetos quanto com strings contendo JSON.

### Sugestão de correção

- Padronizar a serialização das respostas.
- Retornar Content-Type application/json.
- Validar os cabeçalhos em testes de contrato.
- Garantir consistência entre respostas de sucesso
  e respostas de erro.

### Evidência

- [Cabeçalhos e conteúdo da resposta](evidencias/ACHADO-002/metodo-http-invalido.txt)

### Observação

O ACHADO-002 e o ACHADO-003 compartilham a mesma
evidência HTTP, mas representam problemas distintos.

O primeiro está relacionado à semântica do status HTTP.

O segundo está relacionado ao formato declarado
no cabeçalho da resposta.

---

## 7. ACHADO-004 — Indisponibilidade intermitente da aplicação

### Identificação

| Campo | Informação |
|---|---|
| Tipo | Risco ambiental |
| Frente | Transversal |
| Severidade sugerida | Média |
| Prioridade sugerida | Alta |
| Status | Ocorrência intermitente observada |
| Risco relacionado | R06 |

### Contexto

Durante a execução da regressão automatizada,
foram observadas falhas de disponibilidade
no ambiente público utilizado pelo desafio.

### Passos para tentativa de reprodução

1. Executar a regressão automatizada.

       npm run test:regression

2. Acompanhar as requisições ao catálogo.
3. Acompanhar o carregamento das páginas de produtos.
4. Verificar eventuais respostas de indisponibilidade.

A ocorrência é intermitente e não possui reprodução
determinística confirmada.

### Resultado esperado

A aplicação deve permanecer disponível durante
a execução dos testes.

A API deve retornar os dados esperados e as páginas
devem disponibilizar seus elementos funcionais.

### Resultado obtido

Durante uma execução da regressão, a API retornou:

    HTTP 503 — Service Unavailable

Também foi observada a mensagem:

    This website is under heavy load (queue full)

A indisponibilidade ocorreu durante a preparação
dos dados necessários para os testes de carrinho.

Na reexecução isolada, foram observadas novas ocorrências,
incluindo o carregamento de uma página de indisponibilidade
em vez dos detalhes do produto.

### Resultado da execução afetada

Na regressão realizada quando a suíte possuía 20 testes:

| Indicador | Quantidade |
|---|---:|
| Testes previstos | 20 |
| Testes contabilizados como aprovados | 13 |
| Falhas | 1 |
| Testes não executados | 6 |

Entre os 13 testes contabilizados como aprovados,
estava a reprodução controlada do BUG-001.

### Investigação

A ausência de elementos esperados foi analisada
por meio das evidências geradas pelo Cypress.

As imagens demonstraram que a aplicação apresentava
uma página de indisponibilidade, e não a página
funcional esperada.

Portanto, não havia evidência suficiente para atribuir
a falha a um seletor incorreto da automação.

Execuções posteriores de testes isolados foram
concluídas com sucesso.

### Impacto para o negócio

- Interrupção de jornadas de usuários.
- Impossibilidade temporária de consultar produtos.
- Potencial interrupção de compras.
- Redução da confiabilidade da execução automatizada.
- Atrasos na homologação.
- Dificuldade de obtenção de resultados consistentes.

Os impactos comerciais representam riscos potenciais,
não perdas financeiras comprovadas.

### Sugestão de melhoria

- Investigar capacidade e disponibilidade do ambiente.
- Monitorar respostas HTTP 503.
- Disponibilizar ambiente dedicado para homologação.
- Definir critérios de disponibilidade.
- Separar falhas ambientais de falhas funcionais.
- Realizar novas execuções controladas após
  a normalização do ambiente.

Não se recomenda aumentar indiscriminadamente os timeouts
ou inserir esperas fixas para ocultar a indisponibilidade.

### Evidências

- [Indisponibilidade HTTP 503](evidencias/ACHADO-004/indisponibilidade-http-503.png)
- [Página indisponível durante validação do produto](evidencias/ACHADO-004/reexecucao/Carrinho%20de%20compras%20-%20Visitante%20--%20deve%20validar%20o%20subtotal%20para%201%20unidade%28s%29%20%28failed%29.png)
- [Falha durante preparação dos dados](evidencias/ACHADO-004/reexecucao/Carrinho%20de%20compras%20-%20Visitante%20--%20deve%20validar%20o%20subtotal%20para%202%20unidade%28s%29%20--%20before%20each%20hook%20%28failed%29.png)

### Observação

O ambiente pertence a terceiros e é compartilhado.

Não foi possível determinar a causa raiz
da indisponibilidade.

O problema não foi classificado como defeito
funcional confirmado da loja virtual.

---

## 8. ACHADO-005 — Restrição de acesso no GitHub Actions

### Identificação

| Campo | Informação |
|---|---|
| Tipo | Risco ambiental / infraestrutura |
| Frente | Integração contínua |
| Severidade sugerida | Alta para o CI |
| Prioridade sugerida | Alta |
| Status | Impedimento observado |
| Risco relacionado | R06 |

### Contexto

Foi implementado um pipeline no GitHub Actions
para execução automatizada dos testes Cypress.

A instalação das dependências, a verificação do Cypress
e a inicialização do navegador Chrome foram realizadas.

Entretanto, a aplicação apresentou comportamento
diferente daquele observado no GitHub Codespaces.

### Passos para reprodução

1. Acessar o repositório do desafio.
2. Acessar a aba Actions.
3. Selecionar o workflow QA Pipeline - Cypress.
4. Executar o workflow ou realizar um push na branch main.
5. Acompanhar o diagnóstico de disponibilidade.
6. Verificar os resultados e os artefatos publicados.

### Resultado esperado

O ambiente de integração contínua deve conseguir:

- Acessar a página inicial da aplicação.
- Consultar os endpoints da API.
- Executar os testes automatizados.
- Publicar os resultados e as evidências.

### Resultado obtido

Na primeira execução do Smoke Testing,
a página inicial apresentou o título:

    One moment, please...

Em vez do título esperado:

    Automation Exercise

A evidência visual apresentou a mensagem:

    Please wait while your request is being verified...

Os testes de API também receberam conteúdo HTML
que não pôde ser interpretado como JSON.

### Resultado da primeira execução

| Indicador | Quantidade |
|---|---:|
| Testes executados | 3 |
| Aprovados | 0 |
| Falhas | 3 |
| Screenshots gerados | 3 |

### Investigação

As evidências indicam que a execução encontrou
uma página intermediária de verificação.

O comportamento é compatível com uma restrição
de acesso automatizado.

Entretanto, não foi possível confirmar:

- O fornecedor responsável pelo mecanismo.
- A causa raiz da restrição.
- Se existe bloqueio permanente.
- Se a restrição está associada exclusivamente ao IP.
- Se o comportamento ocorre em todos os runners.

### Ação implementada

Foi criado um diagnóstico prévio de disponibilidade:

`scripts/preflight.js`

O diagnóstico verifica:

- A página inicial.
- A API de produtos.
- O status HTTP.
- O Content-Type.
- A presença de indicadores de verificação
  ou indisponibilidade.
- O título esperado da aplicação.
- A estrutura básica dos dados do catálogo.

Caso o ambiente não seja validado,
o processo retorna código de saída diferente de zero.

A execução dos testes é interrompida e o diagnóstico
é disponibilizado como evidência.

### Resultado após implementação

No GitHub Codespaces, o diagnóstico foi executado
com sucesso.

No GitHub Actions, foram observadas respostas HTTP 200
contendo indicadores de verificação ou indisponibilidade.

O diagnóstico retornou código de saída 1,
impedindo a execução das suítes.

O HTTP 200, isoladamente, não foi suficiente
para comprovar a disponibilidade funcional.

### Impacto para o negócio

- Impossibilidade de validar integralmente a entrega via CI.
- Redução da confiabilidade da integração contínua.
- Necessidade de execução em ambiente alternativo.
- Potenciais atrasos na homologação.
- Limitação da utilização dos testes como quality gate.

### Sugestão de melhoria

- Disponibilizar ambiente dedicado de homologação.
- Definir uma infraestrutura autorizada para automação.
- Alinhar as políticas de acesso com o fornecedor.
- Monitorar a disponibilidade antes das suítes.
- Preservar evidências de falhas ambientais.
- Diferenciar impedimentos externos de regressões funcionais.

Não foram realizadas tentativas de contornar
o mecanismo de verificação da aplicação.

### Evidências

- [Página intermediária de verificação](evidencias/ACHADO-005/bloqueio-github-actions.png)
- [Log do diagnóstico de disponibilidade](evidencias/ACHADO-005/preflight-github-actions.txt)

### Arquivos relacionados

- `.github/workflows/qa-pipeline.yml`
- `scripts/preflight.js`

### Limitações

O Preflight Check utiliza requisições HTTP diretas.

Seu resultado não garante que o navegador receberá
exatamente o mesmo conteúdo.

O pipeline foi implementado, mas a aprovação integral
das suítes no GitHub Actions não foi comprovada.

---

## 9. Recomendações ao fornecedor

| Ordem | Recomendação | Achado relacionado |
|---|---|---|
| 1 | Confirmar e corrigir a regra de quantidade mínima | BUG-001 |
| 2 | Disponibilizar ambiente autorizado e estável para automação | ACHADO-004 e ACHADO-005 |
| 3 | Revisar o contrato de erros HTTP | ACHADO-002 |
| 4 | Padronizar o Content-Type das respostas JSON | ACHADO-003 |
| 5 | Formalizar regras de negócio e critérios de aceite | PLANEJAMENTO.md |
| 6 | Ampliar a cobertura de privacidade e acessibilidade | CENARIOS.md |

## 10. Evidências de fluxos bem-sucedidos

Além das evidências de problemas, foram armazenadas
evidências da execução bem-sucedida da compra simulada.

- [Checkout validado](evidencias/E2E-001/E2E-01-checkout-validado.png)
- [Confirmação do pedido](evidencias/E2E-001/E2E-02-pedido-confirmado.png)

Essas evidências demonstram a execução da jornada
de compra no recorte avaliado.

Não representam comprovação de pagamento financeiro real
ou de persistência independente do pedido.

## 11. Parecer de qualidade

A aplicação apresentou resultados positivos nos fluxos
automatizados de catálogo, carrinho, ciclo de vida
da conta e compra de ponta a ponta.

Entretanto, foram identificados comportamentos
e riscos que devem ser considerados antes do aceite.

**Recomendação: não conceder aceite definitivo
sem tratamento ou aprovação formal dos riscos residuais.**

Para uma eventual aceitação condicionada, recomenda-se:

- Confirmar a regra de quantidade mínima com o PO.
- Corrigir o BUG-001 caso a premissa seja confirmada.
- Revisar as inconsistências do contrato da API.
- Disponibilizar ambiente estável e autorizado para CI.
- Executar novamente as suítes de regressão.
- Validar os requisitos de privacidade e acessibilidade
  aplicáveis ao contexto do CPB.
- Formalizar a aceitação dos riscos remanescentes.

A aprovação da automação não deve ser confundida
com a aprovação integral do produto.

O parecer está limitado ao escopo e às condições
de execução deste desafio.

## 12. Referências internas

- [Planejamento de testes](PLANEJAMENTO.md)
- [Cenários e rastreabilidade](CENARIOS.md)
- [Decisões técnicas](DECISOES.md)
- [Uso de inteligência artificial](USO-IA.md)
- [Instruções de execução](README.md)
