
# Decisões Técnicas e Reaproveitamento

**Projeto:** Desafio Prático de QA — Comitê Paralímpico Brasileiro (CPB)
**Responsável:** Gustavo Andrade
**Versão:** 1.0

---

## 1. Objetivo

Registrar as decisões estratégicas e técnicas adotadas
durante o desenvolvimento da solução, suas justificativas,
limitações e possibilidades de evolução.

As decisões consideram o escopo solicitado, os riscos
de negócio e as restrições do ambiente compartilhado.

## 2. Priorização dos testes

A estratégia adotada foi orientada a riscos,
considerando o impacto de uma falha para o consumidor
e para a operação da loja virtual.

| Prioridade | Frente | Justificativa |
|---|---|---|
| 1 | Compra E2E | Representa a conclusão da jornada comercial e concentra riscos financeiros e operacionais. |
| 2 | Carrinho | Quantidades e valores incorretos podem comprometer a integridade do pedido. |
| 3 | API de conta | Envolve autenticação, persistência e tratamento de dados pessoais. |
| 4 | Catálogo e busca | Garante consistência das informações utilizadas na seleção de produtos. |

A disponibilidade do ambiente foi tratada como
um risco transversal às quatro frentes.

A ordem de implementação foi diferente da prioridade
de negócio, pois algumas funcionalidades dependiam
da construção prévia de componentes reutilizáveis.

O catálogo, por exemplo, foi automatizado inicialmente
para permitir a obtenção dinâmica de produtos e preços
nos testes de carrinho e compra.

## 3. O que ficou de fora e por quê

| Item | Justificativa |
|---|---|
| Testes de carga e estresse | Ambiente público, compartilhado e sem autorização para geração de carga. |
| Testes invasivos de segurança | Ausência de autorização e infraestrutura dedicada. |
| Pagamentos reais | Risco financeiro e ausência de ambiente financeiro controlado. |
| Compatibilidade completa entre navegadores | Priorização das quatro frentes solicitadas e limitações de infraestrutura. |
| Responsividade completa | Cobertura complementar não priorizada no recorte atual. |
| Auditoria completa de acessibilidade | Necessidade de critérios específicos e avaliação especializada. |
| Limite máximo de quantidade | Regra de negócio não definida. |
| Gestão de estoque | Fora do escopo solicitado. |
| Cancelamento e entrega de pedidos | Fora do escopo solicitado. |
| Persistência independente do pedido | Ausência de mecanismo autorizado identificado para consulta do pedido. |
| Auditoria completa de privacidade | Necessidade de política de acesso, retenção e autorização formalmente definida. |

A exclusão desses itens não representa ausência de relevância.

A acessibilidade, especialmente no contexto do CPB,
deve ser considerada prioritária em uma futura homologação.

Os cenários complementares estão registrados no CENARIOS.md.

## 4. Escolha do Cypress

O Cypress foi utilizado por ser a ferramenta solicitada
no desafio e por permitir a implementação integrada
de testes de interface e API.

Principais benefícios considerados:

- Execução de testes funcionais e E2E.
- Requisições HTTP por meio de cy.request.
- Asserções integradas.
- Mecanismos de retry para comandos e asserções.
- Captura de screenshots.
- Integração com pipelines de CI.
- Organização modular dos testes.
- Execução headless.

Foi utilizado JavaScript para manter a implementação
direta e reduzir a complexidade de configuração.

TypeScript poderia ser adotado em uma evolução futura,
especialmente para tipagem dos contratos de API,
dos objetos de domínio e das massas de teste.

## 5. Arquitetura da automação

A solução foi organizada em camadas com responsabilidades
distintas.

    cypress/
    ├── api/
    │   └── ContaApi.js
    ├── e2e/
    │   ├── smoke/
    │   │   ├── acesso-loja.cy.js
    │   │   └── catalogo-api.cy.js
    │   └── regression/
    │       ├── api-negativos.cy.js
    │       ├── carrinho-known-bugs.cy.js
    │       ├── carrinho.cy.js
    │       ├── catalogo-ui-api.cy.js
    │       ├── compra-e2e.cy.js
    │       └── conta-api.cy.js
    ├── factories/
    │   └── usuarioFactory.js
    ├── pages/
    │   ├── CarrinhoPage.js
    │   ├── CheckoutPage.js
    │   ├── DetalhesProdutoPage.js
    │   ├── LoginPage.js
    │   ├── PagamentoPage.js
    │   └── ProdutosPage.js
    └── utils/
        └── moeda.js

### 5.1 Page Object Model

Os Page Objects concentram seletores e operações
relacionadas às páginas da aplicação.

Essa separação reduz a duplicação de código
e facilita a manutenção quando a interface sofre alterações.

Os arquivos de teste permanecem responsáveis
pela composição dos cenários e pelas regras
específicas de cada fluxo.

### 5.2 Camada de API

A classe ContaApi centraliza as operações relacionadas
ao ciclo de vida das contas:

- Criação.
- Consulta.
- Autenticação.
- Atualização.
- Exclusão.
- Validação da inexistência após exclusão.

Também concentra o tratamento das respostas
e as validações básicas do contrato observado.

Essa abordagem permite reutilizar as operações
nos testes de API e nos testes E2E.

### 5.3 Factory de usuários

A factory centraliza a geração dos dados fictícios,
permitindo a criação de contas independentes.

A geração utiliza recursos nativos do JavaScript,
sem necessidade de uma biblioteca adicional.

Os dados de endereço são fictícios e previsíveis,
facilitando a comparação com os valores apresentados
durante o checkout.

### 5.4 Utilitários

A conversão de valores monetários foi centralizada
no arquivo moeda.js.

Essa decisão elimina a duplicação da lógica
de tratamento dos preços e subtotais.

A função também rejeita formatos inválidos,
evitando que valores inconsistentes sejam
silenciosamente interpretados.

A implementação atende ao formato monetário
observado na aplicação e não pretende ser
um conversor universal de moedas.

## 6. Dados dinâmicos

Os identificadores e preços dos produtos
são obtidos diretamente pela API de catálogo.

Não são utilizados identificadores fixos
de produtos nos cenários automatizados.

Os valores esperados são calculados
a partir dos dados retornados.

Exemplo conceitual:

    subtotalEsperado = precoUnitario * quantidade

    totalEsperado = somaDosSubtotais

Essa estratégia reduz a dependência de produtos
específicos e permite que os testes acompanhem
alterações nos preços do catálogo.

Entretanto, utilizar a API como referência não garante
que o preço informado esteja correto segundo
as regras comerciais do fornecedor.

A estratégia valida consistência e cálculo,
não a correção absoluta da tabela de preços.

## 7. Dados e isolamento em ambiente compartilhado

### 7.1 Identificação das contas

Todas as contas geradas pela versão final
utilizam nomes iniciados por QA_.

Os e-mails são gerados dinamicamente,
utilizando timestamp e componente aleatório.

O domínio utilizado é example.com.

Nenhuma informação pessoal real é necessária
para executar os testes.

### 7.2 Independência

Cada teste possui sua própria preparação de dados.

Os testes de interface utilizam o isolamento
de sessão do Cypress.

Nenhum cenário depende da execução bem-sucedida
de um teste anterior para funcionar.

O ciclo de vida da conta foi implementado
em um único teste encadeado porque suas operações
representam transições do mesmo registro.

### 7.3 Limpeza

A limpeza das contas é realizada por meio da API.

Os testes que criam contas possuem tratamento
de limpeza no afterEach.

Uma variável de controle indica se a criação
da conta foi solicitada, permitindo tentar
a exclusão mesmo quando o cadastro ou uma etapa
posterior apresenta falha.

Após a exclusão, é realizada uma consulta
para validar a inexistência da conta.

### 7.4 Idempotência da limpeza

A exclusão de uma conta já removida pode retornar
o código de negócio 404.

A camada de API permite tratar essa resposta
como um estado aceitável exclusivamente
quando a operação representa limpeza.

Isso evita classificar uma conta já inexistente
como falha de limpeza.

O comportamento foi validado no teste
de ciclo de vida da conta.

### 7.5 Limitações da limpeza

A execução do afterEach não garante a remoção
dos dados em situações como:

- Encerramento abrupto do processo.
- Indisponibilidade da API.
- Interrupção da infraestrutura.
- Cancelamento forçado da execução.

Essas situações devem ser tratadas como riscos
operacionais, e não como limpeza concluída.

Em um ambiente corporativo, recomenda-se
um mecanismo complementar de rastreamento
e remoção autorizada dos registros de teste.

Não devem ser excluídas contas de terceiros.

## 8. Estratégia de sincronização

Não foram utilizadas esperas fixas para sincronizar
as operações da interface.

A automação utiliza:

- Asserções com retry.
- Verificação de visibilidade.
- Validação de estados da página.
- Confirmação de navegação.
- Interação com os elementos do fluxo funcional.

Durante a investigação do BUG-001, a navegação direta
ao carrinho apresentou um resultado que não correspondia
ao comportamento observado manualmente.

A utilização do modal de confirmação permitiu
reproduzir o fluxo real do usuário e identificar
o defeito de maneira consistente.

A causa exata da divergência inicial não foi comprovada.

Em uma evolução futura, interceptações de rede
poderão ser utilizadas quando houver necessidade
de sincronização explícita com operações assíncronas.

## 9. Data-Driven Testing

A validação de quantidades e subtotais
foi implementada utilizando os valores:

- 1 unidade.
- 2 unidades.
- 5 unidades.

Cada entrada gera um teste independente.

A mesma estrutura de execução é reutilizada,
alterando apenas os dados de entrada.

A abordagem também foi aplicada aos cenários
negativos da API, permitindo organizar diferentes
métodos, parâmetros e respostas esperadas.

Os valores foram selecionados considerando
partição de equivalência e análise de valor limite.

## 10. Tratamento de defeitos conhecidos

O BUG-001 foi automatizado utilizando
uma estratégia explícita de Expected Failure.

O Cypress não possui, na implementação adotada,
um mecanismo nativo de XFAIL equivalente
ao de alguns outros frameworks de teste.

Por esse motivo, foi criada uma caracterização
controlada do comportamento conhecido.

O teste possui a identificação:

    [XFAIL][BUG-001]

A automação:

1. Executa o fluxo de inclusão com quantidade zero.
2. Valida o carregamento do carrinho.
3. Identifica um estado reconhecido da interface.
4. Verifica a reprodução específica do defeito.
5. Confirma quantidade zero e subtotal zero.
6. Registra a ocorrência.
7. Gera evidência visual.

Caso o carrinho permaneça vazio, a automação
sinaliza uma possível correção por meio de XPASS.

Caso a correção altere outras etapas do fluxo,
o teste poderá falhar normalmente e deverá
ser revisado.

Falhas não relacionadas ao defeito conhecido
não são suprimidas.

Não foi utilizado tratamento global de exceções
para transformar indiscriminadamente falhas
em resultados positivos.

A reprodução do defeito é contabilizada
pelo Cypress como aprovação técnica.

Essa limitação deve ser considerada na leitura
dos resultados da suíte.

## 11. Decisões relacionadas ao contrato da API

Foram observadas respostas com HTTP 200,
mesmo quando o corpo informa erros de negócio.

Também foram observadas respostas JSON
com Content-Type text/html.

A automação foi construída para validar
o comportamento atual da API sem ignorar
essas inconsistências.

São verificados:

- Status HTTP.
- Código de negócio.
- Mensagem de retorno.
- Estrutura dos dados.
- Valores dos campos relevantes.

O tratamento condicional de JSON permite
interpretar respostas recebidas como texto.

As inconsistências foram documentadas
separadamente no ACHADOS.md.

Caso o fornecedor revise o contrato,
as asserções deverão ser atualizadas
para refletir os novos critérios aprovados.

## 12. Organização das suítes

A separação das suítes foi implementada
por seleção de arquivos nos scripts do package.json.

| Suíte | Finalidade | Testes |
|---|---|---:|
| Smoke | Validação rápida de disponibilidade e catálogo | 3 |
| API | Validação dos contratos e ciclo de vida da conta | 10 |
| E2E/UI | Validação dos fluxos de interface e compra | 11 |
| Regression | Execução de toda a cobertura automatizada | 21 |

Comandos:

    npm run test:smoke
    npm run test:api
    npm run test:e2e
    npm run test:regression

O Smoke é um subconjunto da regressão.

A seleção por scripts foi escolhida por ser simples
e não exigir dependências adicionais.

Em uma arquitetura de maior escala,
a organização poderá evoluir para tags,
domínios funcionais e execução seletiva
por impacto de alteração.

## 13. Integração contínua

Foi implementado um workflow no GitHub Actions.

Arquivo:

    .github/workflows/qa-pipeline.yml

### 13.1 Gatilhos

| Evento | Suíte configurada |
|---|---|
| Push na branch main | Smoke |
| Pull Request para main | Regression |
| Execução manual | Regression |

### 13.2 Fluxo do pipeline

1. Checkout do repositório.
2. Configuração do Node.js.
3. Diagnóstico prévio de disponibilidade.
4. Instalação das dependências.
5. Verificação do Cypress.
6. Verificação do navegador Chrome.
7. Execução da suíte correspondente.
8. Publicação dos artefatos disponíveis.

A publicação de evidências é configurada
para ocorrer mesmo quando etapas anteriores falham.

### 13.3 Quality Gates

Em um ambiente corporativo, recomenda-se:

| Condição | Decisão |
|---|---|
| Smoke aprovado | Permitir continuidade do processo |
| Falha funcional não esperada | Bloquear aprovação da entrega |
| Regressão com falha | Bloquear aprovação até investigação |
| XFAIL conhecido reproduzido | Permitir continuidade técnica mediante aceite formal do risco |
| XPASS | Solicitar revisão do defeito e do teste |
| Ambiente indisponível | Bloquear validação e classificar como impedimento ambiental |
| Falha de limpeza | Investigar os dados remanescentes |

A aprovação de uma suíte não substitui
a decisão de aceite do produto.

O workflow atual retorna falha quando
o diagnóstico de disponibilidade não é aprovado
ou quando o Cypress retorna falhas.

A obrigatoriedade desse resultado como bloqueio
de merge dependeria da configuração de proteção
de branches e das políticas do repositório.

Não foi comprovada a configuração de um bloqueio
obrigatório de merge neste desafio.

### 13.4 Limitação observada

O pipeline foi implementado e iniciou
a execução dos testes no GitHub Actions.

Entretanto, foi observada uma página
intermediária de verificação da aplicação.

A execução inicial do Smoke apresentou três falhas.

Após investigação, foi implementado um Preflight Check
para identificar respostas incompatíveis
com a disponibilidade funcional esperada.

O diagnóstico foi aprovado no GitHub Codespaces,
mas apresentou falha no GitHub Actions.

Não foram realizadas tentativas de contornar
as políticas de acesso da aplicação.

A aprovação integral das suítes no CI
permanece não comprovada.

## 14. Tratamento de testes instáveis

Falhas intermitentes devem ser investigadas
antes de serem classificadas como flaky tests.

A estratégia recomendada é:

1. Preservar o resultado original.
2. Coletar screenshots, logs e respostas HTTP.
3. Identificar o ponto de falha.
4. Classificar a origem provável.
5. Reexecutar de maneira controlada.
6. Comparar os resultados.
7. Registrar a causa quando confirmada.
8. Corrigir a automação ou encaminhar o problema
   ao responsável pela aplicação ou infraestrutura.

Não se recomenda:

- Adicionar sleeps indiscriminadamente.
- Aumentar timeouts sem investigação.
- Ignorar exceções globalmente.
- Reexecutar indefinidamente até obter aprovação.
- Classificar toda falha como problema ambiental.

A indisponibilidade HTTP 503 observada neste desafio
foi documentada com evidências.

A ausência de um elemento durante uma página
de indisponibilidade não foi tratada automaticamente
como problema de seletor.

Em uma evolução futura, testes comprovadamente
instáveis poderão ser temporariamente isolados,
com responsável, prazo de correção e acompanhamento.

O isolamento não deve eliminar a visibilidade
do risco associado.

## 15. Reaproveitamento entre squads

Para atender outras telas e múltiplas equipes,
a arquitetura poderá evoluir para uma organização
por domínio funcional.

Exemplo de estrutura futura:

    qa-platform/
    ├── core/
    │   ├── http/
    │   ├── assertions/
    │   ├── factories/
    │   ├── reporting/
    │   └── utils/
    ├── domains/
    │   ├── authentication/
    │   ├── catalog/
    │   ├── checkout/
    │   └── sports-management/
    ├── suites/
    │   ├── smoke/
    │   ├── regression/
    │   └── integration/
    └── pipelines/

### 15.1 Componentes compartilhados

- Clientes de API.
- Factories de dados.
- Componentes reutilizáveis de interface.
- Validações de contratos.
- Utilitários de conversão.
- Configurações de ambiente.
- Geração de evidências.
- Templates de pipelines.

### 15.2 Responsabilidades das equipes

Cada squad deve manter os cenários específicos
do seu domínio funcional.

Os componentes comuns podem ser mantidos
de maneira colaborativa, com responsáveis definidos,
revisão de código e controle de versões.

### 15.3 Governança

Recomenda-se estabelecer:

- Convenções de nomenclatura.
- Padrões de seletores.
- Critérios de revisão de código.
- Política de gerenciamento de dados.
- Estratégia de execução por ambiente.
- Critérios de quality gates.
- Rastreabilidade entre requisitos e testes.
- Monitoramento de instabilidade.
- Política de manutenção dos componentes comuns.

O reaproveitamento deve evitar tanto a duplicação
quanto abstrações excessivamente genéricas.

## 16. Decisões sobre o ambiente de desenvolvimento

O desenvolvimento foi realizado no GitHub Codespaces
devido às restrições de instalação de ferramentas
no equipamento local.

Essa alternativa permitiu:

- Utilização de ambiente Linux em nuvem.
- Instalação das dependências necessárias.
- Execução do Cypress em modo headless.
- Versionamento contínuo.
- Desenvolvimento sem instalação local adicional.

O Electron foi utilizado no Codespaces.

O Chrome foi configurado no GitHub Actions.

A advertência de descontinuação do Electron
como navegador de testes foi identificada.

A migração para Chrome no ambiente de desenvolvimento
é uma evolução recomendada.

A execução em navegadores diferentes não representa,
por si só, uma validação completa de compatibilidade.

## 17. Controle de versão e evidências

O desenvolvimento foi organizado em commits incrementais,
separando funcionalidades, refatorações, correções,
infraestrutura e documentação.

As dependências instaladas e os artefatos temporários
não são versionados.

As evidências selecionadas são armazenadas
no diretório evidencias.

O objetivo é manter o repositório legível,
reproduzível e com histórico rastreável.

## 18. Próximas evoluções recomendadas

| Evolução | Benefício |
|---|---|
| Ambiente dedicado de homologação | Maior estabilidade e previsibilidade |
| Validação formal de schemas JSON | Fortalecimento dos testes de contrato |
| Centralização das operações de catálogo | Redução de duplicação nas requisições |
| Relatórios estruturados de execução | Melhor acompanhamento dos resultados |
| Identificação estruturada de XFAIL e XPASS | Maior precisão dos indicadores |
| Gestão complementar de dados de teste | Redução do risco de registros remanescentes |
| Testes de acessibilidade | Ampliação da qualidade no contexto do CPB |
| Testes autorizados de privacidade | Validação de acesso e proteção dos dados |
| Execução seletiva por domínio | Escalabilidade para múltiplas equipes |
| Proteção de branches | Aplicação efetiva dos quality gates |

Essas evoluções representam propostas futuras
e não funcionalidades já implementadas.

## 19. Considerações finais

A solução foi construída com foco em:

- Qualidade orientada a riscos.
- Independência dos testes.
- Dados dinâmicos.
- Reutilização de componentes.
- Legibilidade.
- Rastreabilidade.
- Evidências verificáveis.
- Transparência sobre limitações.

A estratégia prioriza resultados confiáveis
em vez de uma aprovação artificial da automação.

O objetivo não é apenas executar testes,
mas fornecer informações relevantes
para a tomada de decisão sobre a qualidade
da entrega do fornecedor.

## 20. Referências internas

- [Planejamento de testes](PLANEJAMENTO.md)
- [Cenários e rastreabilidade](CENARIOS.md)
- [Bugs e achados](ACHADOS.md)
- [Uso de inteligência artificial](USO-IA.md)
- [Instruções de execução](README.md)
