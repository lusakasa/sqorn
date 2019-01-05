---
id: update-queries
title: Update Queries
sidebar_label: Update
---

**Reference:** [Postgres](https://www.postgresql.org/docs/current/sql-update.html), [SQLite](https://www.sqlite.org/lang_update.html), 
[MySQL](https://dev.mysql.com/doc/refman/en/update.html), [T-SQL](https://docs.microsoft.com/en-us/sql/t-sql/queries/update-transact-sql), [Oracle](https://docs.oracle.com/database/121/SQLRF/statements_10008.htm)

## Overview

* **With** [`.with`](select-queries#with) [`.withRecursive`](select-queries#recursive-ctes)
* **Update** [`.from`](#set)
* **Set** [`.set`](#set)
* **From** [`.from`](#from-2)
* **Where** [`.where`](#where-1)
* **Returning** [`.return`](#returning)

## Set

`.from` specifies the table to modify and `.set` specifies the fields to update. [`.from`](#from) works it as does in [Delete](delete-queries#from) queries.

```js
sq.from`person`
  .set`age = age + 1, name = ${'Sally'}`
  .query

{ text: 'update person set age = age + 1, name = $1',
  args: ['Sally'] }
```

Multiple calls to `.set` are joined with `', '`.

```js
sq.from`person`
  .set`age = age + 1`
  .set`name = ${'Sally'}`
  .query

{ text: 'update person set age = age + 1, name = $1',
  args: ['Sally'] }
```

`.set` accepts objects in the form `{ field: value }`. Each property generates a `field = value` clause.

```js
sq.from('person')
  .set(
    { firstName: 'Robert', nickname: 'Rob' },
    { processed: true }
  )
  .query

{ text: 'update person set first_name = $1, nickname = $2, processed = $3',
  args: ['Robert', 'Rob', true] }
```

Values can be [Expressions](expressions).

```js
sq.from('person')
  .set({ age: e.add(3, 4) })
  .query

{ text: 'update person set age = ($1 + $2)',
  args: [3, 4] }
```

Values can be [Fragments](manual-queries#fragments).

```js
sq.from('person')
  .set({ age: sq.txt`3 + 4` })
  .query

{ text: 'update person set age = 3 + 4',
  args: [] }
```

Values can be [Subqueries](manual-queries#subqueries).

```js
sq.from('person')
  .set({
    firstName: sq.sql`select 'Bob'`,
    lastName: sq.return`'Smith'`
  })
 .query

{ text: "update person set first_name = (select 'Bob'), last_name = (select 'Smith')",
  args: [] }
```

`undefined` values set fields to `default`.

```js
sq.from('person').set({ firstName: undefined }).query

{ text: "update person set first_name = default",
  args: [] }
```

## Where

Filter the rows to update with `.where`.

```js
sq.from`person`
  .where({ firstName: 'Matt' })
  .set({ firstName: 'Robert', nickname: 'Rob' })
  .query

{ text: 'update person set first_name = $1, nickname = $2 where (first_name = $3)',
  args: ['Robert', 'Rob', 'Matt'] }
```

`.where` works as it does in [Select](select-queries) queries.

## From

**Postgres Only:** The first `.from` call forms the update clause. Subsequent `.from` calls form the *from* clause.

```js
sq.from`book`
  .from`author`
  .set({ available: false })
  .where`book.author_id = author.id and author.contract = 'terminated'`
  .query

{ text: "update book set available = $1 from author where (book.author_id = author.id and author.contract = 'terminated')",
  args: [false] }
```

## Returning

**Postgres Only:** Return the updated rows with [`.return`](select-queries#select).

```js
sq.from`person`
  .where`age > 60 and old = false`
  .set`old = true`
  .return`id, age`
  .query

{ text: 'update person set old = true where (age > 60 and old = false) returning id, age',
  args: [] }
```