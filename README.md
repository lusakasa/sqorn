# [<img src="https://raw.githubusercontent.com/sqorn/sqorn/master/docs/website/static/img/logo_blue.svg?sanitize=true" height="38px"/> <span style="color: #2979f">Sqorn</span>](https://sqorn.org) &middot; [![License](https://img.shields.io/github/license/sqorn/sqorn.svg)](https://github.com/sqorn/sqorn/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/sqorn.svg)](https://www.npmjs.com/package/sqorn) ![Supports Node 8+](https://img.shields.io/node/v/sqorn.svg) [![npm](https://img.shields.io/travis/sqorn/sqorn.svg)](https://travis-ci.org/sqorn/sqorn) [![Coverage Status](https://coveralls.io/repos/github/sqorn/sqorn/badge.svg)](https://coveralls.io/github/sqorn/sqorn)

Sqorn is a Javascript library for building SQL queries.

**Composable:** Build complex queries from simple parts. Chain, extend, and embed queries.

**Intuitive**: Sqorn's use of modern Javascript language features like tagged template literals and promises makes building and issuing SQL queries a breeze.

**Concise:** Sqorn provides concise syntax for common CRUD operations.

[**Fast:**](https://sqorn.org/benchmarks.html) 10x faster than [Knex.js](https://knexjs.org/) and 200x faster than [Squel](https://github.com/hiddentao/squel)

**Secure:** Sqorn generates parameterized queries safe from SQL injection. Sqorn has no external dependencies.

## Install

Sqorn requires Node version 8 or above.

```sh
npm install --save @sqorn/pg # only Postgres is currently supported
```

Then read the [tutorial](https://sqorn.org/docs/tutorial.html) and [try the online demo](https://sqorn.org/demo.html).

## Examples

CRUD Operations are dead simple.

```js
const sq = require('@sqorn/pg')()

const Person = sq.from`person`, Book = sq.from`book`

// SELECT
const children = await Person`age < ${13}`
// "select * from person where age < 13"

// DELETE
const [deleted] = await Book.delete({ id: 7 })`title`
// "delete from book where id = 7 returning title"

// INSERT
await Person.insert({ firstName: 'Rob' })
// "insert into person (first_name) values ('Rob')"

// UPDATE
await Person({ id: 23 }).set({ name: 'Rob' })
// "update person set name = 'Rob' where id = 23"

```

Build complex queries from simple parts.

```js
// CHAIN QUERIES
sq.from`book`
  .return`distinct author`
  .where({ genre: 'Fantasy' })
  .where({ language: 'French' })
// select distinct author from book
// where language = 'French' and genre = 'Fantasy'

// EXTEND QUERIES
sq.extend(
  sq.from`book`,
  sq.return`distinct author`,
  sq.where({ genre: 'Fantasy' }),
  sq.where({ language: 'French' })
)
// select distinct author from book
// where language = 'French' and genre = 'Fantasy'

// EMBED Queries
sq.return`now() today, (${sq.return`now() + '1 day'`}) tomorrow`
// select now() today, (select now() + '1 day') tomorrow
```

Learn more in the [tutorial](https://sqorn.org/docs/tutorial.html).

## Contributing

Sqorn is a monorepo managed with Lerna.

Clone the repo then run the following commands to install all dependencies:

```sh
npm install
npm run bootstrap # installs dependencies in all packages
```

`npm test` runs all tests. `npm run clean` removes all dependencies.

## License

MIT Licensed, Copyright (c) 2018 Sufyan Dawoodjee
