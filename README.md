# GraphQL TypeSafe Server com Codegen

Este é um servidor GraphQL typesafe que utiliza codegen para gerar tipos TypeScript a partir do esquema GraphQL.

## Funcionalidades

- Servidor GraphQL com Apollo Server
- TypeScript para tipagem estática
- GraphQL Codegen para geração automática de tipos
- Query `ping` que responde com `pong`

## Requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## Instalação

```bash
npm install
```

## Uso

### Gerar tipos a partir do esquema GraphQL

```bash
npm run codegen
```

### Iniciar o servidor em modo de desenvolvimento

```bash
npm run dev
```

### Compilar o projeto

```bash
npm run build
```

### Iniciar o servidor em produção

```bash
npm run start
```

## Testando a API

Após iniciar o servidor, acesse o GraphQL Playground em http://localhost:4000/graphql e execute a query:

```graphql
query {
  ping
}
```

A resposta deve ser:

```json
{
  "data": {
    "ping": "pong"
  }
}
```