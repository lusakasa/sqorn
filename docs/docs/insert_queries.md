---
id: insert-queries
title: Insert Queries
sidebar_label: Insert
---

**Reference:** [Postgres](https://www.postgresql.org/docs/current/sql-insert.html), [SQLite](https://www.sqlite.org/lang_insert.html), 
[MySQL](https://dev.mysql.com/doc/refman/en/insert.html), [T-SQL](https://docs.microsoft.com/en-us/sql/t-sql/statements/insert-transact-sql), [Oracle](https://docs.oracle.com/database/121/SQLRF/statements_9015.htm)

## Overview

* **With** [`.with`](select-queries#with) [`.withRecursive`](select-queries#recursive-ctes)
* **Insert** [`.from`](#insert) [`.insert`](#insert)
* **Returning** [`.return`](#returning)

## Insert

`.from` specifies the table to insert into and `.insert` specifies the data to insert. [`.from`](#from-1) works as it does in delete queries.

```js
sq.from`person(first_name, last_name)`
  .insert`values (${'Shallan'}, ${'Davar'})`
  .query

{ text: 'insert into person(first_name, last_name) values ($1, $2)',
  args: ['Shallan', 'Davar'] }
```

To insert one row, pass `.insert` a single object. Column names are inferred from the object's keys.

Sqorn [converts input object keys](#map-input-keys) to *snake_case* by default.

```js
sq.from('person')
  .insert({ firstName: 'Shallan', lastName: 'Davar' })
  .query

{ text: 'insert into person(first_name, last_name) values ($1, $2)',
  args: ['Shallan', 'Davar'] }
```

`undefined` values are inserted as `default`. `default` is a keyword, not a paraemeter.

```js
sq.from('test').insert({ a: undefined, b: null }).query

{ text: 'insert into test(a, b) values (default, $1)',
  args: [null] }
```

To insert multiple rows, pass multiple objects. Column names are inferred from the keys of all objects.

```js
sq.from('person')
  .insert(
    { firstName: 'Shallan', lastName: 'Davar' },
    { firstName: 'Navani', lastName: 'Kholin' }
  )
  .query

{ text: 'insert into person(first_name, last_name) values ($1, $2), ($3, $4)',
  args: ['Shallan', 'Davar', 'Navani', 'Kholin'] }
```

Alternatively, pass `.insert` an array of objects.

```js
sq.from('person')
  .insert([
    { firstName: 'Shallan', lastName: 'Davar' },
    { firstName: 'Navani', lastName: 'Kholin' }
  ])
  .query

{ text: 'insert into person(first_name, last_name) values ($1, $2), ($3, $4)',
  args: ['Shallan', 'Davar', 'Navani', 'Kholin'] }
```

Values can be [Expressions](expressions).

```js
sq.from('person').insert({ firstName: e.upper('moo') }).query

{ text: 'insert into person(first_name) values (upper($1))',
  args: ['moo'] }
```

Values can be [Fragments](manual-queries#fragments).

```js
sq.from('person').insert({ firstName: sq.txt`'moo'` }).query

{ text: "insert into person(first_name) values ('moo')",
  args: [] }
```

Values can be [Subqueries](manual-queries#subqueries).

```js
sq.from('person').insert({
    firstName: sq.return`${'Shallan'}`,
    lastName: sq.txt('Davar')
  })
  .query

{ text: "insert into person(first_name, last_name) values ((select $1), $2)",
  args: ['Shallan', 'Davar'] }
```

`.insert` accepts subqueries.

```js
sq.from('superhero(name)')
  .insert(
    sq.return`${'batman'}`.union(sq.return`${'superman'}`)
  )
  .query

{ text: "insert into superhero(name) (select $1 union (select $2))",
  args: ['batman', 'superman'] }
```

Pass `undefined` to insert default values.

```js
sq.from('person').insert(undefined).query

{ text: 'insert into person default values',
  args: [] }
```

Only the last call to `.insert` is used.

```js
sq.from('person')
  .insert({ firstName: 'Shallan', lastName: 'Davar' })
  .insert({ firstName: 'Navani', lastName: 'Kholin' })
  .query

{ text: 'insert into person(first_name, last_name) values ($1, $2)',
  args: ['Navani', 'Kholin'] }
```

## Returning

**Postgres Only:** Return the inserted rows with [`.return`](select-queries#select).

```js
sq.from('book')
.insert({ title: 'Squirrels and Acorns' })
.return('id')
.query

{ text: 'insert into book(title) values ($1) returning id',
  args: ['Squirrels and Acorns'] }
```
