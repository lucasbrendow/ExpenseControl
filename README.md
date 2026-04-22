# ExpenseControl

Sistema de controle de gastos residenciais.

## Objetivo

Implementar um sistema de controle de gastos residenciais, garantindo:

-   Separação entre backend e frontend\
-   Persistência de dados\
-   Aplicação das regras de negócio\
-   Clareza na implementação e organização do código

## Tecnologias utilizadas

### Backend

-   .NET 9\
-   ASP.NET Core\
-   Entity Framework Core\
-   SQLite

### Frontend

-   React\
-   TypeScript\
-   Axios

-----------------------------------------------------------------------

## Execução do projeto

### Backend

``` bash
cd backend/ExpenseControl.Api
dotnet restore
dotnet run
```

A API estará disponível em:\
http://localhost:5015/swagger

----------------------------------------------------------------------

### Frontend

``` bash
cd frontend/expense-control-web
npm install
npm run dev
```

A aplicação estará disponível em:\
http://localhost:5173

-------------------------------------------------------------------------

## Funcionalidades

### Pessoas

-   Cadastro de pessoas (nome e data de nascimento)\
-   Listagem de pessoas\
-   Exclusão de pessoa com remoção em cascata das transações

### Categorias

-   Cadastro de categorias\
-   Definição de finalidade:
    -   Receita\
    -   Despesa\
    -   Ambas\
-   Listagem de categorias

### Transações

-   Cadastro de transações na tela de movimentações\
-   Associação com pessoa e categoria\
-   Tipos:
    -   Receita\
    -   Despesa

### Relatórios

-   Totais por pessoa:
    -   Receitas\
    -   Despesas\
    -   Saldo\
-   Total geral consolidado

-   Totais por categoria:
    -   Receitas\
    -   Despesas\
    -   Saldo\
-   Total geral consolidado

-------------------------------------------------------------------------

## Regras de negócio

-   Menores de idade (idade \< 18 anos):
    -   Podem registrar apenas despesas\
    -   Não podem registrar receitas
-   Categorias:
    -   Devem ser compatíveis com o tipo da transação\
    -   Categorias com finalidade "Ambas" aceitam qualquer tipo
-   Exclusão de pessoa:
    -   Remove automaticamente todas as suas transações
-   Idade:
    -   Calculada dinamicamente a partir da data de nascimento

----------------------------------------------------------------------

## Decisões técnicas

-   Separação entre frontend e backend\
-   Uso de SQLite para persistência simples\
-   Validações aplicadas:
    -   Backend: garante a integridade das regras\
    -   Frontend: melhora a experiência do usuário\
-   Uso de modal para cadastro rápido de transações\
-   Filtragem de categorias no frontend conforme o tipo selecionado\
-   Organização visual baseada em cards

----------------------------------------------------------------------

## Considerações finais

O sistema foi desenvolvido com foco em:

-   Clareza de código\
-   Organização\
-   Aderência ao escopo proposto\
-   Experiência do usuário

Também foram adicionadas melhorias no frontend para tornar a interação
mais fluida, sem fugir dos requisitos da tarefa.
