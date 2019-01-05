---
id: setup
title: Setup
sidebar_label: Setup
---

Sqorn requires Node version 8 or above. Run `node --version` to see what version you have installed.

## Setup

To install Sqorn, follow the instructions for your SQL dialect.

The instructions assume the use of CommonJS. See also [JS Modules](#js-modules) and [Typescript](#typescript).

 <!-- For additional options, refer to [Configuration](configuration). -->

### Postgres

Install [Node Postgres](https://www.npmjs.com/package/pg) and [Sqorn Postgres](https://www.npmjs.com/package/@sqorn/pg).

```sh
npm install --save pg @sqorn/pg
```

Create a [Node Postgres connection pool](https://node-postgres.com/features/connecting). Then pass `pg` and `pool` arguments to `sqorn()` to initialize sqorn.

```js
const pg = require('pg')
const sqorn = require('@sqorn/pg')

const pool = new pg.Pool()
const { db, sq, e, txt, sql, raw } = sqorn({ pg, pool })
```

### MySQL

TODO

### SQLite

TODO

## JS Modules

Use `import from` syntax.

```ts
import sqorn from '@sqorn/pg'
```

This will not run natively in Node, so use a module bundler like [Webpack](https://webpack.js.org/).

## Typescript

### Option 1: Import Require

Use `import require` syntax.

```ts
import sqorn = require('@sqorn/pg')
```

### Option 2: Import From

Set `allowSyntheticDefaultImports` to true in [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true
  }
}
```

Then import sqorn using `import from` syntax.

```ts
import sqorn from '@sqorn/pg'
```