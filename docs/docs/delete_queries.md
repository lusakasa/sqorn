---
id: delete-queries
title: Delete Queries
sidebar_label: Delete
---

**Reference:** [Postgres](https://www.postgresql.org/docs/current/sql-delete.html), [SQLite](https://www.sqlite.org/lang_delete.html), 
[MySQL](https://dev.mysql.com/doc/refman/en/delete.html), [T-SQL](https://docs.microsoft.com/en-us/sql/t-sql/statements/delete-transact-sql), [Oracle](https://docs.oracle.com/database/121/SQLRF/statements_8005.htm)

## Overview

* **With** [`.with`](select-queries#with) [`.withRecursive`](select-queries#recursive-ctes)
* **Delete** [`.delete`](#delete)
* **From** [`.from`](#from-1)
* **Using** [`.from`](#using-1)
* **Where** [`.where`](#where-1)
* **Returning** [`.return`](#returning)

## Delete

Delete queries look like [Select](select-queries) queries with an additional call to `.delete`.

```js
sq.delete.from`person`.query
sq.from`person`.delete.query // equivalent

{ text: 'delete from person',
  args: [] }
```

`.delete` is idempotent.

```js
sq.from`book`.delete.delete.delete.query

{ text: 'delete from book',
  args: [] }
```

## From

[`.from`](#from) works as it does in [Select](select-queries) queries.

However, be aware of certain SQL constraints Sqorn does not yet enforce.

* Delete queries require exactly one, named table.
* The table may not be a subquery or expression.
* Joins are not allowed.

Reference more than one table by using:

* Subqueries in the *Where* clause
* With clause (CTE) join tables
* Dialect-specific SQL extensions

## Using

**Postgres Only:** The first `.from` call forms the delete clause. Subsequent `.from` calls form the *using* clause.

```js
sq.delete
  .from`book`
  .from`author`
  .where`book.author_id = author.id and author.contract = 'terminated'`
  .query

{ text: "delete from book using author where (book.author_id = author.id and author.contract = 'terminated')",
  args: [] }
```

## Where

Filter the rows to delete with `.where`.

```js
sq.delete.from`person`.where`id = ${723}`.query

{ text: 'delete from person where (id = $1)',
  args: [723] }
```

`.where` works as it does in [Select](select-queries) queries.

## Returning

**Postgres Only:** Return the deleted rows with [`.return`](select-queries#select).

```js
sq.delete.from`person`.return`name`.query

{ text: 'delete from person returning name',
  args: [] }
```