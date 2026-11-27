
# Planejamento de Testes — Loja Virtual

**Projeto:** Desafio Prático de QA — Comitê Paralímpico Brasileiro (CPB)
**Responsável:** Gustavo Andrade
**Versão:** 1.0
**Sistema avaliado:** Automation Exercise

---

## 1. Objetivo

Avaliar a qualidade, a confiabilidade e a consistência funcional
do módulo de loja virtual disponibilizado pelo fornecedor,
identificando defeitos, riscos e oportunidades de melhoria que
possam comprometer a aceitação da entrega.

A estratégia é orientada a riscos, priorizando funcionalidades
com maior impacto para o negócio e para a experiência do usuário.

## 2. Escopo

### 2.1 Funcionalidades contempladas

- Carrinho de compras para visitantes.
- Inclusão e remoção de produtos.
- Validação de quantidades e subtotais.
- Catálogo e pesquisa de produtos.
- Consistência entre interface e API.
- Ciclo de vida da conta via API.
- Validação de dados pessoais fictícios.
- Métodos HTTP e parâmetros inválidos.
- Fluxo completo de compra.
- Autenticação pela interface.
- Validação de endereços e valores no checkout.
- Confirmação do pedido.
- Disponibilidade básica da aplicação.

### 2.2 Funcionalidades fora do escopo

- Testes de carga, estresse e desempenho.
- Testes invasivos de segurança.
- Integração com meios de pagamento reais.
- Compatibilidade completa entre navegadores.
- Responsividade em diferentes dispositivos.
- Auditoria completa de acessibilidade.
- Funcionalidades administrativas.
- Gestão de estoque, entrega e cancelamento de pedidos.

Esses itens não foram priorizados por não integrarem diretamente
as quatro frentes solicitadas e pelas limitações de um ambiente
público, compartilhado e pertencente a terceiros.

A acessibilidade é especialmente relevante no contexto do CPB
e deve ser considerada em uma futura etapa de homologação.

## 3. Estratégia de testes

A abordagem combina testes manuais, exploratórios e automatizados,
com foco na identificação antecipada de riscos de negócio.

### 3.1 Testes funcionais

Validar os comportamentos observáveis da aplicação,
considerando fluxos positivos, negativos e condições de contorno.

### 3.2 Testes de API

Validar:

- Status HTTP.
- Código de resposta no corpo.
- Mensagens de retorno.
- Estrutura das respostas.
- Métodos e parâmetros inválidos.
- Persistência e atualização dos dados.
- Exclusão das contas criadas.

### 3.3 Testes de integração

Comparar os dados apresentados na interface com os retornados
pela API, utilizando o catálogo como fonte dinâmica de dados.

A API não é considerada uma fonte infalível de verdade.
A comparação permite identificar divergências entre camadas,
mas não substitui a validação das regras de negócio.

### 3.4 Testes exploratórios

Investigar comportamentos não documentados, especialmente
quantidades inválidas, estados do carrinho e inconsistências
entre o comportamento esperado e o observado.

### 3.5 Testes de ponta a ponta

Validar a jornada de compra desde a criação da conta pela API
até a confirmação do pedido pela interface, utilizando dados
exclusivamente fictícios.

### 3.6 Smoke Testing

Executar verificações rápidas sobre:

- Disponibilidade da página inicial.
- Listagem de produtos pela API.
- Pesquisa de produtos pela API.

### 3.7 Regression Testing

Executar todos os testes automatizados para identificar
regressões nas funcionalidades contempladas.

## 4. Priorização baseada em riscos

Os riscos foram classificados considerando probabilidade
estimada e impacto para o negócio.

### 4.1 Critérios

Probabilidade:

- 1 — Baixa.
- 2 — Média.
- 3 — Alta.

Impacto:

- 1 — Baixo.
- 2 — Médio.
- 3 — Alto.

Pontuação = Probabilidade x Impacto.

Classificação:

- 1 a 2: Baixo.
- 3 a 4: Médio.
- 6 a 9: Alto.

As classificações representam estimativas qualitativas de QA,
não indicadores estatísticos de produção.

### 4.2 Matriz de riscos

| ID | Frente | Risco | Prob. | Impacto | Pontos | Nível |
|---|---|---|---:|---:|---:|---|
| R01 | Compra E2E | Pedido confirmado com valor incorreto | 3 | 3 | 9 | Alto |
| R02 | Carrinho | Aceitação de quantidade inválida | 3 | 3 | 9 | Alto |
| R03 | Conta API | Exposição ou alteração indevida de dados pessoais | 2 | 3 | 6 | Alto |
| R04 | Compra E2E | Falha na conclusão do pedido | 2 | 3 | 6 | Alto |
| R05 | Carrinho | Cálculo incorreto de subtotal | 2 | 3 | 6 | Alto |
| R06 | Ambiente | Indisponibilidade ou restrição de acesso | 3 | 3 | 9 | Alto |
| R07 | Conta API | Falha na criação, atualização ou exclusão da conta | 2 | 3 | 6 | Alto |
| R08 | Catálogo | Divergência entre interface e API | 2 | 3 | 6 | Alto |
| R09 | API | Erros de negócio retornados com HTTP 200 | 3 | 2 | 6 | Alto |
| R10 | Carrinho | Remoção incorreta de produtos | 2 | 2 | 4 | Médio |
| R11 | Catálogo | Pesquisa com resultados inconsistentes | 2 | 2 | 4 | Médio |
| R12 | API | JSON retornado com Content-Type inadequado | 3 | 1 | 3 | Médio |

### 4.3 Ordem de prioridade por frente

1. Compra de ponta a ponta:
   maior impacto financeiro e operacional, pois representa
   a conclusão da jornada do consumidor.

2. Carrinho de visitante:
   concentra regras de quantidade, cálculo e remoção que
   influenciam diretamente a integridade da compra.

3. API de conta:
   envolve persistência, autenticação e tratamento de dados
   pessoais, exigindo atenção especial à privacidade.

4. Catálogo e busca:
   inconsistências podem comprometer a seleção dos produtos
   e a confiança do consumidor.

A disponibilidade do ambiente é um risco transversal e constitui
uma condição necessária para a execução das quatro frentes.

A ordem representa prioridade de negócio, não necessariamente
a sequência técnica de implementação.

## 5. Perguntas ao PO e aos desenvolvedores

| ID | Destinatário | Pergunta | Como a resposta altera os testes |
|---|---|---|---|
| Q01 | PO | Qual é a quantidade mínima permitida por produto? | Define os limites válidos e inválidos e a classificação do BUG-001. |
| Q02 | PO | Existe quantidade máxima por produto ou pedido? | Permite testar o limite superior e os valores imediatamente adjacentes. |
| Q03 | PO | Quantidades decimais ou negativas devem ser rejeitadas? | Define novas partições inválidas e validações de entrada. |
| Q04 | PO | Adicionar novamente um produto deve somar ou substituir sua quantidade? | Define o resultado esperado para inclusões repetidas. |
| Q05 | PO | O carrinho deve persistir após fechar o navegador? | Define testes de persistência e expiração da sessão. |
| Q06 | PO | Deve existir um total geral no carrinho de visitante? | Define a necessidade de validar a soma dos subtotais antes do checkout. |
| Q07 | PO | A pesquisa deve considerar nome, categoria, marca ou descrição? | Define os critérios de correspondência e os resultados esperados. |
| Q08 | PO | A busca diferencia maiúsculas, minúsculas e espaços? | Define cenários de normalização e equivalência. |
| Q09 | Dev | Qual é o contrato oficial dos status HTTP da API? | Define se os testes devem exigir códigos HTTP específicos ou validar códigos de negócio no corpo. |
| Q10 | Dev | Qual é o Content-Type esperado nas respostas JSON? | Define a validação obrigatória dos cabeçalhos. |
| Q11 | PO/Dev | Quais campos pessoais podem ser consultados e por quem? | Define testes autorizados de privacidade, autenticação e autorização. |
| Q12 | PO | Quais campos são obrigatórios no cadastro e na atualização? | Define a matriz de campos válidos, ausentes e inválidos. |
| Q13 | Dev | A exclusão da conta é lógica ou física? | Define critérios de consulta após exclusão e retenção dos dados. |
| Q14 | PO | Existem descontos, impostos ou frete no cálculo do pedido? | Altera a fórmula de cálculo do total esperado. |
| Q15 | PO/Dev | Qual evento confirma definitivamente um pedido? | Define se a confirmação visual é suficiente ou se deve existir validação adicional via API. |
| Q16 | Dev | Existe ambiente autorizado para execução automatizada em CI? | Define a infraestrutura de execução e os critérios de bloqueio por indisponibilidade. |
| Q17 | PO | Quais requisitos de acessibilidade devem ser atendidos? | Define critérios de navegação por teclado, leitores de tela, contraste e demais verificações. |

## 6. Premissas adotadas

- A quantidade mínima válida de um produto é uma unidade.
- Quantidades representam números inteiros positivos.
- O subtotal corresponde ao preço unitário multiplicado pela quantidade.
- O total do checkout corresponde à soma dos subtotais,
  na ausência de encargos ou descontos identificados.
- A remoção de um produto não deve alterar os demais itens.
- A remoção do último produto deve resultar em carrinho vazio.
- O visitante pode utilizar o carrinho sem autenticação.
- Os dados do catálogo devem ser consistentes entre UI e API.
- Os dados cadastrados devem ser recuperados e atualizados
  corretamente nos campos disponibilizados pela API.
- Uma conta excluída não deve permanecer disponível para consulta.
- A confirmação visual do pedido representa o encerramento
  do fluxo de compra avaliado neste desafio.
- Os códigos de negócio documentados e observados são utilizados
  como referência para os testes de API.
- Não serão utilizadas informações pessoais reais.

As premissas não substituem requisitos formalmente aprovados.
Devem ser confirmadas com o PO e os desenvolvedores.

## 7. Ambiente e ferramentas

| Recurso | Utilização |
|---|---|
| Automation Exercise | Sistema sob teste |
| Cypress | Automação funcional, API e E2E |
| JavaScript | Implementação dos testes |
| Node.js | Ambiente de execução |
| GitHub Codespaces | Desenvolvimento e execução |
| Git | Controle de versão |
| GitHub | Repositório e documentação |
| GitHub Actions | Integração contínua |
| Electron | Execução headless no Codespaces |
| Chrome | Navegador configurado no CI |

Referências:

- https://www.automationexercise.com/
- https://automationexercise.com/api_list
- https://automationexercise.com/test_cases

## 8. Gestão de dados e isolamento

- Contas fictícias com prefixo QA_.
- E-mails únicos em domínio example.com.
- Geração dinâmica de identificadores.
- Produtos e preços obtidos pela API.
- Sessões independentes entre os testes.
- Limpeza das contas por meio da API.
- Tentativa de limpeza também após falhas dos testes.
- Validação da inexistência da conta após exclusão.
- Utilização exclusiva de dados fictícios de pagamento.
- Ausência de credenciais reais no repositório.

A limpeza depende da disponibilidade da API e da execução
dos hooks do Cypress. Interrupções abruptas ou indisponibilidade
externa podem impedir sua conclusão.

## 9. Critérios de entrada

- Aplicação e API acessíveis.
- Dependências instaladas.
- Cypress operacional.
- Catálogo disponível para obtenção dos dados.
- Ambiente adequado para execução dos testes.
- Dados de teste exclusivamente fictícios.

## 10. Critérios de saída

- Execução dos cenários automatizados planejados.
- Registro dos resultados e das evidências.
- Ausência de falhas críticas não justificadas.
- Classificação dos defeitos e riscos identificados.
- Registro das limitações de cobertura.
- Validação da limpeza das contas criadas.
- Comunicação dos impedimentos externos.
- Documentação das decisões técnicas.

A aprovação técnica da automação não implica automaticamente
a aprovação do produto para entrega.

Defeitos conhecidos, riscos residuais e regras não confirmadas
devem ser considerados na decisão de aceite.

## 11. Tratamento de falhas

As falhas devem ser investigadas e classificadas como:

- Defeito funcional da aplicação.
- Inconsistência técnica ou contratual.
- Falha da automação.
- Indisponibilidade do ambiente.
- Regra de negócio não definida.

Falhas ambientais não devem ser confundidas com defeitos
funcionais, nem utilizadas para ocultar falhas da automação.

O pipeline deve manter o resultado de falha quando o ambiente
não estiver disponível, preservando evidências para investigação.

## 12. Limitações conhecidas

- Ausência de documentação formal de requisitos.
- Ambiente público e compartilhado.
- Ocorrências de indisponibilidade HTTP 503.
- Restrições de acesso observadas no GitHub Actions.
- Ausência de confirmação do limite máximo de quantidade.
- Ausência de validação de pagamento financeiro real.
- Cobertura parcial de privacidade e segurança.
- Ausência de confirmação independente do pedido por API.

O diagnóstico de disponibilidade implementado no CI não
garante que o navegador receberá o mesmo conteúdo das
requisições HTTP utilizadas pelo Preflight Check.

## 13. Entregáveis

- Planejamento de testes.
- Cenários e técnicas de teste.
- Automação Cypress.
- Testes de API.
- Registro de bugs, riscos e evidências.
- Documentação das decisões técnicas.
- Documentação da utilização de inteligência artificial.
- Instruções de instalação e execução.
- Pipeline de integração contínua.
