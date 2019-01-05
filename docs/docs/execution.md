---
id: execution
title: Execution
sidebar_label: Execution
---

* **Execute** [`.all`](#all) [`.first`](#first) [`.one`](#one) [`.run`](#run)
* **Compile** [`.query`](#manually) [`.unparameterized`](#manually)

## All

`.all` executes a query and returns a Promise for an array of result rows.

A Row is an object in the form `{ field: value }`. Field names are converted to [camelCase](configuration#map-output-keys) by default.

```js
const people = await sq.sql`select id, first_name, last_name from person`.all()

[ { id: 1, firstName: 'Kaladin', lastName: 'Stormblessed' },
  { id: 2, firstName: 'Shallan', lastName: 'Davar' },
  { id: 3, firstName: 'Dalinar', lastName: 'Kholin' } ]
```

## First

`.first` executes a query and returns a Promise for the first result row.

If a query returns no rows, `.first` returns `undefined`.

If a query returns multiple rows, all but the first are disgarded.

```js
const person = await sq.sql`select id, first_name, last_name from person limit 1`.first()

if (person) {
  // person === { id: 1, firstName: 'Kaladin', lastName: 'Stormblessed' }
  console.log(person.title)
} else {
  // person === undefined
  console.log('Person not found')
}
```

## One

`.one` executes a query and returns a Promise for the first result row.

If a query returns no rows, `.one` throws an error.

If a query returns multiple rows, all but the first are disgarded.

```js
try {
  const person = await sq.sql`select id, first_name, last_name from person where id = ${1}`.one()
  // person === { id: 1, firstName: 'Kaladin', lastName: 'Stormblessed' }
  console.log(person)
} catch (error) {
  console.log('Person not found')
}
```

## Run

`.run` executes a query and returns a void Promise that resolves when it is done.

If a query returns rows, all are disgarded.

```js
await sq.sql`insert into person(first_name, last_name) values (${'Jasnah'}, ${'Kholin'})`.run()
```

## Query

You can use `.query` to build a query, then send its text and arguments to another library for execution.

```js
const pg = require('pg')
const sqorn = require('@sqorn/pg')

const pool = new pg.Pool()
const sq = sqorn()

const { text, args } = sq.sql`select * from book`.query
await pool.query(text, args)
```

`.query` is a getter method that compiles a query when accessed.

## Unparameterized

`.unparameterized` generates an unparameterized query string.  **To prevent SQL injection, never use this method.**

```js
const sqorn = require('@sqorn/pg')
const sq = sqorn()

sq.sql`select * from book where title = ${'Oathbringer'}`.unparameterized

"select * from book where title = 'Oathbringer'"
```