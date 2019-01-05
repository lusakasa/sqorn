---
id: expressions
title: Expressions
sidebar_label: Expressions
---

**Reference** [Postgres](https://www.postgresql.org/docs/current/functions.html), [SQLite](https://www.sqlite.org/lang_expr.html), [MySQL](https://dev.mysql.com/doc/refman/en/functions.html), [T-SQL](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/expressions-transact-sql), [Oracle](https://docs.oracle.com/cd/E11882_01/server.112/e41084/operators.htm)

## Introduction

Access the expression API at `sq.e`.

Create expressions by applying [Operations](operations) like [`.add`](operations#add), [`.and`](operations#and), and [`.eq`](operations#equal) to values.

SQL differentiates between operators and functions. Sqorn does not.

```js
const { e } = sq

e.add(3, 4).query

{ text: '($1 + $2)',
  args: [3, 4] }
```

Create an expression from a value with [`.arg`](operations#arg).

```js
e.arg('meow').query

{ text: '$1',
  args: ['meow'] }
```

`e` is short hand for `e.arg`.

```js
e('meow').query

{ text: '$1',
  args: ['meow'] }
```

Expressions are values.

```js
e(e(23)).query

{ text: '$1',
  args: [23] }
```

Expressions are immutable and composable.

```js
e.and(
  e.or(e.lt(3, 4), e.gt(5, 6)),
  e.neq(7, 8)
).query

{ text: '((($1 < $2) or ($3 > $4)) and ($5 <> $6))',
  args: [3, 4, 5, 6, 7, 8] }
```

All *Operations* have curried overloads.

```js
e.add(3)(4).query

{ text: '($1 + $2)',
  args: [3, 4] }
```

Supply raw arguments with tagged template literals.

```js
e.eq`lucky_number`(8).query

{ text: '(lucky_number = $1)',
  args: [8] }
```

A chained operation's first argument is the expression it is called on. There is no operator precedence. Expressions are evaluated left to right.

```js
e(3).add(4).eq(7).and(true).query

{ text: '((($1 + $2) = $3) and $4)',
  args: [3, 4, 7, true] }
```

Pass multiple arguments to `.arg` to build a row value.

```js
e.arg(8, true)`meow`.query

{ text: '($1, $2, meow)',
  args: [8, true] }
```

Build expressions from [Fragments](manual-queries.html#fragments) and [Subqueries](manual-queries.html#subqueries).

```js
e(sq.txt`2`, sq.return`3`).query

{ text: '(2, (select 3))',
  args: [] }
```

`undefined` arguments are invalid.

```js
e.arg(undefined).query // throws error
```

Use `null` instead.

```js
e.arg(null).query

{ text: '$1',
  args: [null] }
```

`.unparameterized` generates an unparameterized string. **To avoid SQL injection, do not use this method.**

```js
e.eq`genre`('fantasy').unparameterized

"(genre = 'fantasy')"
```

Build queries from expressions.

```js
sq.return(e.add`n`(7))
  .from({ n: e.unnest([2, 3, 4, 5]) })
  .where(e`n`.mod(2).eq(0))
  .query

{ text: 'select (n + $1) from unnest($2) n where ((n % $3) = $4)',
  args: [7, [2, 3, 4, 5], 2, 0] }
```

## Type Safety

SQL is strongly typed. Sqorn expressions are somewhat typed.

Calling an operation with incompatible arguments is a Typescript compilation error. For example, `.add` expects two number arguments, so supplying string or boolean arguments is invalid. Similarly, passing three arguments when two are expected is invalid.

There are limits to expression type safety:

* The type of a `null` value cannot be inferred. Creating an expression from a null value will generate an [Unknown Expression](#unknown).

* The type of a tagged template literal cannot be inferred. Creating an expression from a tagged template literal will generate an [Unknown Expression](#unknown).

* Multidimensional types like [Array Expression](#array), [Row Expression](#row) and [Table Expression](#table) lose all information about their constituent types. Sqorn will not warn you if you build the invalid expression `e.eq(e(true, false), e(3, 4))`.

* Some [n-ary](https://en.wikipedia.org/wiki/Arity) operations like [`.and`](operations#and) take one or more arguments. Sqorn cannot enforce the argument minimum at compile time. Expression `e.and()` compiles but throws an error at runtime.

## Expression Types

Sqorn's expression types are listed below:

### Unknown

Unknown Expressions represent values of unknown type. They could be anything from `true`, `null`, and `'meow'`, to `(true, 24)`, `Array[3, 5, 7]`, and `'{ "hello": "world" }'`.

**Constructor:** [e.unknown](operations#unknown)

**Compatible Types:** `any`

**Supported Operations:** [Comparison](operations#comparison), [Boolean](operations#boolean-1), [Math](operations#math), [String](operations#string), [Array](operations#array), [Row](operations#row), [Table](operations#table)

```js
// Examples
e(null)
e`moo`
e(sq.txt`moo`)
e(e(null))
e.unknown('moo')
```

### Boolean

Boolean Expressions represent values true and false.

They are useful for constructing *where*, *having* and *join* conditions.

**Constructor:** [e.boolean](operations#boolean)

**Compatible Types:** `boolean`, `null`, `BooleanExpression`, `UnknownExpression`

**Supported Operations:** [Comparison](operations#comparison), [Boolean](operations#boolean-1)

```js
// Examples
e(true)
e(e(false))
e.boolean(null)
e.and(true, false)
e.eq(3, 6)
e.like('moo', 'moomoo')
e.eqAny(3, [2, 3, 5])
```

### Number

Number Expressions represent numbers like `2`, `70.5`, and `-2749.234`.

**Constructor:** [e.number](operations#number)

**Compatible Types:** `number`, `null`, `NumberExpression`, `UnknownExpression`

**Supported Operations:** [Comparison](operations#comparison), [Math](operations#math)

```js
// Examples
e(8)
e(e(8))
e.number(null)
e.add(3, 4)
e.sub(9)(6)
e.div`moo``moo`
e`moo`.mul`moo`
```

### String

String Expressions represent character sequences like `'kitty'`, `'Tuxedo cats are best'`, and `''`.

**Constructor:** [e.string](operations#string)

**Compatible Types:** `string`, `null`, `StringExpression` and `UnknownExpression`

**Supported Operations:** [Comparison](operations#comparison), [String](operations#string)

```js
// Examples
e('moo')
e.string(null)
e(e('moo'))
e.cat('moo', 'moo')
```

### Array

Array Expressions represent [Postgres Arrays](https://www.postgresql.org/docs/current/arrays.html).

**Constructor:** [e.array](operations#array)

**Compatible Types:** `any[]`, `null`, `Array Expression`, `Unknown Expression` 

**Supported Operations:** [Comparison](operations#comparison), [Array](operations#array)

```js
// Examples
e([3, 4, 5])
e.array(null)
e([true false])
e(e([]))
e(['moo', 'moo', 'moo'])
e(['moo']).cat(['moo'])
```

### JSON

JSON Expressions represent JSON values.

**Constructor:** [e.json](operations#json)

**Compatible Types:** `null` | `number` | `boolean` | `string` | `[]` |`{}`, `JSONExpression`, `UnknownExpression`

**Supported Operations:** [Comparison](operations#comparison), [JSON](operations#json)

```js
// Examples
e({ a: 1 })
e(e({}))
e.json('moo')
e.json(['moo', 'moo'])
```

### Row

Row Expressions represent one or more values of any type.

**Constructor:** [e.row](operations#row)

**Compatible Types:** `null`, `Row Expression`, `Unknown Expression`

**Supported Operations:** [Comparison](operations#comparison), [Row](operations#row)

```js
// Examples
e(1, true, 'moo')
e(1)(true)('moo')
e(e(1, 2))
e.row('moo')
e.row`moo`('moo')
```

### Table

Table Expressions represent a table.

**Constructor:** [e.table](operations#table)

**Compatible Types:** TODO, `Table Expression`, `Unknown Expression`

**Supported Operations:** [Comparison](operations#comparison), [Table](operations#table)

```js
// Examples
e(sq.from('book'))
e.unnest([3, 5, 7, 9])
e(sq.sql`select 'moo moo'`)
e(e(sq.return`1`))
```