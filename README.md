# Salon

A 2D teleconferencing app.

Bootstrapped from https://github.com/kunalgorithm/graphql-fullstack

## Documentation

When building a new project, choosing a technology stack, configuring it, wiring it all together, and figuring out how to dpeloy it properly tends to take far more time that building and shipping features (the important _and_ fun part). This boilerplate starts you off with an app that already works, so you can get right to the good stuff.

## Features

⚡️ Deploy a full-featured production-ready web application in less than 60 seconds.

🔐 Allow users to sign up and log in with an email and password, view their profiles and data, and log out. Outputs feedback for loading and errors states to enhance UX.

📃 Includes a splash page, login page, sign up page, and dashboard.

🤖‍‍ Includes wired up forms, queries, mutations, snackbars, and more commonly used components.

☁️ [Zero Config Deployments](https://zeit.co/blog/zero-config). It just works 🔥

## Quick Start

Clone the repository

Install dependencies, then run the development server:

```bash
yarn
yarn dev
```

# Deploy

Deploy to the cloud with [now](https://zeit.co/now) ([download](https://zeit.co/download))

Install the `now` CLI

```bash
npm install --global now
```

Then deploy using

```bash
now
```

# Tech stack

🤖 [Typescript](https://www.typescriptlang.org) - static types, used throughout the client and server (especially handy for the auto-generated prisma2 client).

🌚 [Next 9.3](https://github.com/zeit/next.js) - server-side rendering, file-based routing in the `pages` directory, and serverless build of of graphql API within `pages/api/graphql.ts` using [API Routes](https://github.com/zeit/next.js#api-routes).

🦋 [Apollo](https://www.apollographql.com/docs/react/hooks-migration/) (React Hooks API) - GraphQL client for queries and mutations.

🦄 [Prisma](https://prisma.io) - Next-generation database access and migration tools.

💅 [Ant Design](https:/ant.design) - Beautiful, responsive, easy-to-use components.

▲ [ZEIT now](https://now.sh) - serverless monorepo deployment.

# Development

## Create new data types

Create a new project and install the prisma CLI, along with typescript, as development dependencies

```
npm init -y
yarn add -D @prisma/cli typescript ts-node @types/node
```

You can now invoke the prisma CLI

```
npx prisma
```

Then, open `schema.prisma` in the `prisma` directory and add the following

```prisma
datasource sqlite {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native"]
}

model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  email     String   @unique
  name      String?
  password String

}

```

and run
`yarn migrate:save`

and give the migration a name to save your first database migration. When asked whether to create a SQLite file, select yes. Then, apply the migration by running

`yarn migrate:up`

### Adding a new field

Open `schema.prisma` in the `prisma` directory. Add a new optional field, _githubUrl_ to a data type, _User_.

```prisma
model User {
  id         Int      @id @default(autoincrement())
  createdAt  DateTime @default(now())
  email      String   @unique
  name       String?
  password   String
  githubUrl  String?
}
```

> Note: the `?` signals that the field is optional.

### Make it available to the frontend.

Now that you've added a new field to your database and made it available to the _server_, you need to make it available to your _client_ by defining it within the graphQL endpoint's type definitions.

Open the API type defintion file at `apollo/typedefs.js` and extend

```diff
type User {
  ...
+ graphqlUrl: String
}
```

Now, render the new data on the app by adding it to the query on the `Profile` component

```diff
const { loading, error, data, client } = useQuery(
  gql`
    query {
      me {
        id
        name
        email
+       githubUrl
      }
    }
  `
);
```
