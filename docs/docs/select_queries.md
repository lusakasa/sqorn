---
id: select-queries
title: Select Queries
sidebar_label: Select
---

**Reference:** [Postgres](https://www.postgresql.org/docs/current/sql-select.html), [SQLite](https://www.sqlite.org/lang_select.html), 
[MySQL](https://dev.mysql.com/doc/refman/en/select.html), [T-SQL](https://docs.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql), [Oracle](https://docs.oracle.com/cd/B19306_01/server.102/b14200/statements_10002.htm)

## Overview

* **With** [`.with`](#with) [`.withRecursive`](#recursive-ctes)
* **Select** [`.return`](#select)
* **Distinct** [`.distinct`](#distinct) [`.distinctOn`](#distinct-on)
* **From** [`.from`](#from) [`.join`](#joins) [`.leftJoin`](#joins) [`.rightJoin`](#joins) [`.fullJoin`](#joins) [`.crossJoin`](#joins) [`.naturalJoin`](#joins) [`.naturalLeftJoin`](#joins) [`.naturalRightJoin`](#joins) [`.naturalFullJoin`](#joins) [`.on`](#on) [`.using`](#using)
* **Where** [`.where`](#where)
* **Group By** [`.groupBy`](#group-by) [`.rollup`](#rollup) [`.cube`](#cube) [`.groupingSets`](#grouping-sets)
* **Having** [`.having`](#having)
* **Sets** [`.union`](#union-intersect-except) [`.intersect`](#union-intersect-except) [`.except`](#union-intersect-except) [`.unionAll`](#union-all-intersect-all-except-all) [`.intersectAll`](#union-all-intersect-all-except-all) [`.exceptAll`](#union-all-intersect-all-except-all)
* **Order By** [`.orderBy`](#order-by)
* **Limit** [`.limit`](#limit)
* **Offset** [`.offset`](#offset)

## From

`.from` builds *from* clauses.

```js
sq.from`book`.query

{ text: 'select * from book',
  args: [] }
```

Multiple `.from` calls are joined with `', '`.

```js
sq.from`book`.from`person`.query

{ text: 'select * from book, person',
  args: [] }
```

`.from` accepts strings. **To prevent SQL injection, never source *strings* from user input.**

```js
sq.from('book', 'author').query

{ text: 'select * from book, author',
  args: [] }
```

<!-- TODO: Consider aliased tables and compatibility with object aliases -->

<!-- ```js -->
<!-- const b = t('book').as('b')
const a = t('author').as('a')
sq.from(b, a).query

{ text: 'select * from book b, author a',
  args: [] } -->
<!-- ``` -->

`.from` accepts [Table Expressions](expressions#table).
<!-- NOTE: Expressions may not be paranthesized in from clause -->

```js
// Postgres-only query
sq.from(e.unnest([3, 2, 1])).query

{ text: 'select * from unnest($1)',
  args: [[3, 2, 1]] }
```

`.from` accepts [Fragments](manual-queries#fragments).

```js
// Postgres-only query
sq.from(sq.txt`unnest(array[1, 2, 3])`).query

{ text: 'select * from unnest(array[1, 2, 3])',
  args: [] }
```

Pass `.from` objects in the form `{ alias: table }` to construct *`table alias`* clauses.

Tables can be strings. **To prevent SQL injection, never source *strings* from user input.**

```js
sq.from({ b: 'book', p: 'person' }).query

{ text: 'select * from book b, person p',
  args: [] }
```

Tables can be [Table Expressions](expressions#table).

```js
// Postgres-only query
sq.from({ countDown: e.unnest([3, 2, 1]) }).query

{ text: 'select * from unnest($1) count_down',
  args: [[3, 2, 1]] }
```

Tables can be [Fragments](manual-queries#fragments).

```js
// Postgres-only query
sq.from({ countDown: sq.txt`unnest(${[3, 2, 1]})` }).query

{ text: 'select * from unnest($1) count_down',
  args: [[3, 2, 1]] }
```

Tables can be [Subqueries](manual-queries#subqueries).

```js
sq.from({ a: sq.sql`select * from author`, b: sq.from`book` }).query

{ text: 'select * from (select * from author) a, (select * from book) b',
  args: [] }
```

Tables can be *Arrays of Values*. Column names are inferred from all keys.

Sqorn [converts input object keys](configuration#map-input-keys) to *snake_case* by default.

```js
sq.from({
  people: [{ age: 7, firstName: 'Jo' }, { age: 9, firstName: 'Mo' }]
}).query

{ text: 'select * from (values ($1, $2), ($3, $4)) people(age, first_name)',
  args: [7, 'Jo', 9, 'Mo'] }
```

<!-- TODO: Tables can be Values subqueries -->

<!-- ```js -->
<!-- const values = sq.values(
    { age: 7, firstName: 'Jo' },
    { age: 9, firstName: 'Mo' }
  ).a('people', 'age', 'first_name')

sq.from(sq.values({ age: 7, firstName: 'Jo' }, { age: 9, firstName: 'Mo' }).query

{ text: 'select * from (values ($1, $2), ($3, $4)) people(age, first_name)',
  args: [7, 'Jo', 9, 'Mo'] } -->
<!-- ``` -->

Construct join tables manually or learn about building [joins](#joins).

```js
sq.from`book left join author on book.author_id = author.id`.query

{ text: 'select * from book left join author on book.author_id = author.id',
  args: [] }
```

## Where

`.where` builds *where* clauses.

```js
sq.from`book`.where`genre = ${'Fantasy'}`.query

{ text: 'select * from book where (genre = $1)',
  args: ['Fantasy'] }
```

Multiple `.where` calls are joined with `' and '`.

```js
sq.from`book`.where`genre = ${'Fantasy'}`.where`year = ${2000}`.query

{ text: 'select * from book where (genre = $1) and (year = $2)',
  args: ['Fantasy', 2000] }
```

Conditions can be [Boolean Expressions](expressions#boolean).

```js
sq.from`book`.where(e`year`.gt(2010).or(e`year`.lt(2018))).query

{ text: 'select * from book where ((year > $1) or (year < $2))',
  args: [2010, 2018] }
```

Conditions can be [Fragments](manual-queries#fragments).

```js
sq.from`book`.where(sq.txt`genre = ${'Fantasy'}`).query

{ text: 'select * from book where (genre = $12)',
  args: ['Fantasy'] }
```

Conditions can be [Subqueries](manual-queries#subqueries).

```js
sq.from`book`.where(sq.sql`select true`).query

{ text: 'select * from book where (select true)',
  args: [] }
```

Conditions can be objects in the form `{ field: value }`.

Each property generates a `field = value` clause.

```js
sq.from`book`.where({ genre: 'Fantasy', year: 2000 }).query

{ text: 'select * from book where ((genre = $1) and (year = $2))',
  args: ['Fantasy', 2000] }
```

Values can be [Expressions](expressions).

```js
sq.from`person`.where({ age: e.add(10, 20) }).query

{ text: 'select * from person where (age = ($1 + $2))',
  args: [10, 20] }
```

Values can be [Fragments](manual-queries#fragments).

```js
sq.from`person`.where({ age: sq.txt`20` }).query

{ text: 'select * from person where (age = 20)',
  args: [] }
```

Values can be [Subqueries](manual-queries#subqueries).

```js
sq.from`test`.where({ moo: sq.sql`select true` }).query

{ text: 'select * from test where (moo = (select true))',
  args: [] }
```

Values can be [Raw Arguments](manual-queries#raw-strings).

```js
sq.from('book', 'author').where({ 'book.id': sq.raw('author.id') }).query

{ text: 'select * from book, author where (book.id = author.id)',
  args: [] }
```

`null` values generate a `field is null` expression.

```js
sq.from`book`.where({ author: null }).query

{ text: 'select * from book where (author is null)',
  args: [] }
```

`undefined` values are invalid.

```js
sq.from`oops`.where({ field: undefined }).query // throws error
```

`array` arguments generate a `field in values` expression.

```js
sq.from`book`.where({ id: [7, 8, 9] }).query

{ text: 'select * from book where (id in ($1, $2, $3))',
  args: [7, 8, 9] }
```

Sqorn [converts input object keys](#map-input-keys) to *snake_case* by default.

```js
sq.from('person').where({ firstName: 'Kaladin' }).query

{ text: 'select * from person where (first_name = $1)',
  args: ['Kaladin'] }
```

Multiple arguments passed to `.where` are joined with `' and '`.

```js
sq.from('person').where({ name: 'Rob' }, sq.txt`(name = ${'Bob'})`).query

{ text: 'select * from person where (name = $1) and (name = $2)',
  args: ['Rob', 'Bob'] }
```

<!-- TODO: Conditions in an array are joined with `or`. -->

<!-- ```js -->
<!-- sq.from('person').where([sq.txt`true`, sq.txt`true`], sq.txt`false`).query

{ text: 'select * from person where ((true) and (true)) or (false)',
  args: ['Rob', 'Bob'] } -->
<!-- ``` -->

Use [Expressions](expressions) to build complex conditions with [`e.and`](operations#and), [`e.or`](operations#or) and [`e.not`](operations#not).

```js
sq.from('person').where(
  e.and(
    e.eq`first_name`('Mohammed'),
    e.eq`last_name`('Ali'),
    e.gt`age`(30).not
  )
).query

{ text: 'select * from person where ((first_name = $1) and (last_name = $2) and not((age > $3)))',
  args: ['Mohammed', 'Ali', 30] }
```

## Select

`.return` builds *select* clauses.

```js
sq.return`${1} a, ${2} b, ${1} + ${2} sum`.query

{ text: 'select $1 a, $2 b, $3 + $4 sum',
  args: [1, 2, 1, 2] }
```

Multiple `.return` calls are joined with `', '`.

```js
sq.from`book`.return`title, author`.return`id`.query

{ text: 'select title, author, id from book',
  args: [] }
```

`.return` accepts strings. **To prevent SQL injection, never source strings from user input.**

```js
sq.from('book').return('title', 'author').query

{ text: 'select title, author from book',
  args: [] }
```

`.return` accepts [Fragments](manual-queries#fragments).

```js
sq.return(sq.txt('moo'), sq.txt`now()`).query

{ text: 'select $1, now()',
  args: ['moo'] }
```

`.return` accepts [Subqueries](manual-queries#subqueries).

```js
sq.return(sq.sql`select now()`, sq.return(e(8))).query

{ text: 'select (select now()), (select $1)',
  args: [8] }
```

`.return` accepts [Expressions](expressions).

```js
sq.return(e`genre`.eq('fantasy')).from('book').query

{ text: 'select (genre = $1) from book',
  args: ['fantasy'] }
```

`.return` accepts objects in the form `{ alias: value }`. Each property generates a `value alias` clause.

Values can be strings. **To prevent SQL injection, never source strings from user input.**

```js
sq.return({ name: 'person.name' , age: 'person.age' }).from('person').query

{ text: 'select person.name name, person.age age from person',
  args: [] }
```

Values can be [Expressions](expressions).

```js
sq.return({ hello: e('world'), sum: e.add(1, 2) }).query

{ text: 'select $1 hello, ($2 + $3) sum',
  args: ['world', 1, 2] }
```

Values can be [Fragments](manual-queries#fragments).

```js
sq.return({ sum: sq.txt`${2} + ${3}`, firstName: sq.txt('Bob') }).query

{ text: 'select $1 + $2 sum, $3 first_name',
  args: [2, 3, 'Bob'] }
```

Values can be [Subqueries](manual-queries#subqueries).

```js
sq.return({
  time: sq.sql`select now()`,
  eight: sq.return(e(8))
}).query

{ text: 'select (select now()) time, (select $1) eight',
  args: [8] }
```

## Distinct

Call `.distinct` to get only one row per group of duplicates.

```js
sq.from('book').return('genre', 'author').distinct.query

{ text: 'select distinct genre, author from book',
  args: [] }
```

`.distinct` is idempotent.

```js
sq.from('book').return('genre', 'author').distinct.distinct.query

{ text: 'select distinct genre, author from book',
  args: [] }
```

### Distinct On

**Postgres only:** Call `.distinctOn` to get only the first rows distinct on the given columns.

```js
sq.from`weather`
  .return`location, time, report`
  .distinctOn`location`
  .query

{ text: 'select distinct on (location) location, time, report from weather',
  args: [] }
```

`.distinctOn` can be called multiple times.

```js
sq.from`weather`
  .return`location, time, report`
  .distinctOn`location`
  .distinctOn`time`
  .query

{ text: 'select distinct on (location, time) location, time, report from weather',
  args: [] }
```

`.distinctOn` accepts strings. **To prevent SQL injection, never source strings from user input.**

```js
sq.from('weather')
  .return('location', 'time', 'report')
  .distinctOn('location', 'time')
  .query

{ text: 'select distinct on (location, time) location, time, report from weather',
  args: [] }
```

`.distinctOn` accepts [Expressions](expressions).

```js
sq.return`n`
  .distinctOn(e`n`.mod`2`)
  .from({ n: e.unnest([1, 2, 3, 4, 5]) })
  .query

{ text: 'select distinct on ((n % 2)) n from unnest($1) n',
  args: [[1, 2, 3, 4, 5]] }
```

`.distinctOn` accepts [Fragments](manual-queries#fragments).

```js
sq.from('generate_series(0, 10) n')
  .return('n')
  .distinctOn(sq.txt`n / 3`)
  .query

{ text: 'select distinct on (n / 3) n from generate_series(0, 10) n',
  args: [] }
```

`.distinctOn` accepts [Subqueries](manual-queries#subqueries).

```js
sq.from('generate_series(0, 10) n')
  .return('n')
  .distinctOn(sq.return`n / 3`)
  .query

{ text: 'select distinct on ((select n / 3)) n from generate_series(0, 10) n',
  args: [] }
```

## Extend

Construct new queries by extending existing queries with `.extend`.

```js
const FantasyBook = sq.from('book').where({ genre: 'fantasy' })
const Title = sq.return('title')

sq.extend(FantasyBook, Title).query

{ text: 'select title from book where (genre = $1)',
  args: ['fantasy'] }
```

`.extend` can be called in the middle of a query chain.

```js
sq.from('book').extend(sq.where({ genre: 'fantasy' })).return('title').query

{ text: 'select title from book where (genre = $1)',
  args: ['fantasy'] }
```

## Group By

`.groupBy` builds *group by* clauses.

```js
sq.from`person`
  .groupBy`age`
  .return`age, count(*)`
  .query

{ text: 'select age, count(*) from person group by age',
  args: [] }
```

Multiple `.groupBy` calls are joined with `', '`.

```js
sq.from`person`
  .groupBy`age`.groupBy`last_name`
  .return`age, last_name, count(*)`
  .query

{ text: 'select age, last_name, count(*) from person group by age, last_name',
  args: [] }
```

`.groupBy` accepts strings.

```js
sq.from('person')
  .groupBy('age', 'last_name')
  .return('age', 'last_name', 'count(*)')
  .query

{ text: 'select age, last_name, count(*) from person group by age, last_name',
  args: [] }
```

`.groupBy` accepts [Expressions](expressions).

```js
sq.from(sq.txt`generate_series(${1}, ${10}) n`)
  .groupBy(e.mod`n`(2))
  .return(e.mod`n`(2), 'sum(n)')
  .query

{ text: "select (n % $1), sum(n) from generate_series($2, $3) n group by (n % $4)",
  args: [2, 1, 10, 2] }
```

`.groupBy` accepts [Fragments](manual-queries#fragments).

```js
sq.from('book')
  .groupBy(sq.txt`genre`)
  .return('count(*)')
  .query

{ text: 'select count(*) from book group by genre',
  args: [] }
```

`.groupBy` accepts [Subqueries](manual-queries#subqueries).

```js
sq.from('book')
  .groupBy(sq.return`genre = 'Fantasy'`)
  .return('count(*)')
  .query

{ text: "select count(*) from book group by (select genre = 'Fantasy')",
  args: [] }
```

Parenthesize arguments by wrapping them in arrays. Arrays can be nested.

```js
sq.from('person')
  .groupBy('age', [[sq.txt`last_name`], 'first_name'])
  .return('count(*)')
  .query

{ text: 'select count(*) from person group by age, ((last_name), first_name)',
  args: [] }
```

### Rollup

**Postgres Only:** `.groupBy` accepts *rollup* arguments. `.rollup` accepts the  same arguments as `.groupBy` except *rollup*, *cube* or *grouping sets* arguments.

```js
sq.from('t').groupBy(sq.rollup('a', ['b', sq.txt`c`], 'd')).query

// postgres
{ text: 'select * from t group by rollup (a, (b, c), d)',
  args: [] }
```

### Cube

**Postgres Only:** `.groupBy` accepts *cube* arguments. `.cube` accepts the  same arguments as `.rollup`.

```js
sq.from('t').groupBy(sq.cube('a', ['b', sq.txt`c`], 'd')).query

// postgres
{ text: 'select * from t group by cube (a, (b, c), d)',
  args: [] }
```

### Grouping Sets

**Postgres Only:** `.groupBy` accepts *grouping sets* arguments. `.groupingSets` accepts the  same arguments as [`.groupBy`](#group-by).

```js
sq.from('t').groupBy(sq.groupingSets(['a', 'b', 'c'], sq.groupingSets(['a', 'b']), ['a'], [])).query

// postgres
{ text: 'select * from t group by grouping sets ((a, b, c), grouping sets ((a, b)), (a), ())',
  args: [] }
```

## Having

Filter groups with `.having`. `.having` accepts the  same arguments as [`.where`](#where).

```js
sq.from`person`.groupBy`age`.having`age < ${20}`.query

{ text: 'select * from person group by age having (age < $1)',
  args: [20] }
```

Multiple calls to `.having` are joined with `' and '`.

```js
sq.from`person`.groupBy`age`.having`age >= ${20}`.having`age < ${30}`.query

{ text: 'select * from person group by age having (age >= $1) and (age < $2)',
  args: [20, 30] }
```

Build complex *having* conditions with [Expressions](expressions).

```js
sq.from('book')
  .groupBy('genre')
  .having(e.or(
    e.gt`count(*)`(10),
    e.lte`count(*)`(100)
  ))
  .return('genre', 'count(*)')
  .query

{ text: 'select genre, count(*) from book group by genre having (((count(*) > $1) or (count(*) <= $2)))',
  args: [10, 100] }
```

## Order By

Specify row ordering with `.orderBy`.

```js
sq.from`book`.orderBy`title asc nulls last`.query

{ text: 'select * from book order by title asc nulls last',
  args: [] }
```

Multiple calls to `.orderBy` are joined with `', '`.

```js
sq.from`book`.orderBy`title`.orderBy`year`.query

{ text: 'select * from book order by title, year',
  args: [] }
```

`.orderBy` accepts strings. **To prevent SQL injection, never source *strings* from user input.**

```js
sq.from('book').orderBy('sales / 1000', 'title').query

{ text: 'select * from book order by sales / 1000, title',
  args: [] }
```

`.orderBy` accepts [Expressions](expressions).

```js
sq.from('book').orderBy(e`sales`.div(1000), 'title').query

{ text: 'select * from book order by (sales / $1), title',
  args: [1000] }
```

`.orderBy` accepts [Fragments](manual-queries#fragments).

```js
sq.from('book').orderBy(sq.txt`sales / ${1000}`, 'title').query

{ text: 'select * from book order by sales / $1, title',
  args: [1000] }
```

`.orderBy` accepts [Subqueries](manual-queries#subqueries).

```js
sq.from('book').orderBy(sq.return`sales / ${1000}`, 'title').query

{ text: 'select * from book order by (select sales / $1), title',
  args: [1000] }
```

`.orderBy` accepts objects.

Property `by` is used for ordering. It can be a string, [Expression](expressions), [Fragment](manual-queries#fragments) or [Subquery](manual-queries#subqueries).

```js
sq.from('book').orderBy({ by: e`sales`.div(1000) }, { by: 'title' }).query

{ text: 'select * from book order by (sales / $1), title',
  args: [1000] }
```

Set property `sort` to either `'asc'` or `'desc'`. SQL defaults to ascending.

```js
sq.from('book').orderBy({ by: 'title', sort: 'desc' }).query

{ text: 'select * from book order by title desc',
  args: [] }
```

**Postgres Only:** Set property `using` to a comparison operator. Do not set both properties `sort` and `using`

```js
sq.from`person`.orderBy({ by: 'first_name', using: '~<~' }).query

{ text: 'select * from person order by first_name using ~<~',
  args: [] }
```

**Postgres Only:** Set property `nulls` to `'first'` or `'last'` to select *null* ordering. SQL defaults to nulls first.

```js
sq.from('book').orderBy({ by: 'title', nulls: 'last' }).query

{ text: 'select * from book order by title nulls last',
  args: [] }
```

## Limit

Pass `.limit` the maximum number of rows to fetch.

```js
sq.from('person').limit(8).query

{ text: 'select * from person limit $1',
  args: [8] }
```

Only the last call to `.limit` is used.

```js
sq.from('person').limit(7).limit(5).query

{ text: 'select * from person limit $1',
  args: [5] }
```

`.limit` can be called a template tag.

```js
sq.from`person`.limit`1 + 7`.query

{ text: 'select * from person limit 1 + 7',
  args: [] }
```

`.limit` accepts [Number Expressions](expressions#number).

```js
sq.from('person').limit(e(1).add(7)).query

{ text: 'select * from person limit ($1 + $2)',
  args: [1, 7] }
```

`.limit` accepts [Fragments](manual-queries#fragments).

```js
sq.from('person').limit(sq.txt`1 + 7`).query

{ text: 'select * from person limit 1 + 7',
  args: [] }
```
`.limit` accepts [Subqueries](manual-queries#subqueries).

```js
sq.from('person').limit(sq.return`1 + 7`).query

{ text: 'select * from person limit (select 1 + 7)',
  args: [] }
```

## Offset

Pass `.offset` the number of rows to skip before returning rows.

```js
sq.from('person').offset(8).query

{ text: 'select * from person offset $1',
  args: [8] }
```

Only the last call to `.offset` is used.

```js
sq.from('person').offset(7).offset(5).query

{ text: 'select * from person offset $1',
  args: [5] }
```

`.offset` can be called a template tag.

```js
sq.from`person`.offset`1 + 7`.query

{ text: 'select * from person offset 1 + 7',
  args: [] }
```

`.offset` accepts [Number Expressions](expressions#number).

```js
sq.from('person').offset(e(1).add(7)).query

{ text: 'select * from person offset ($1 + $2)',
  args: [1, 7] }
```

`.offset` accepts [Fragments](manual-queries#fragments).

```js
sq.from('person').offset(sq.txt`1 + 7`).query

{ text: 'select * from person offset 1 + 7',
  args: [] }
```
`.offset` accepts [Subqueries](manual-queries#subqueries).

```js
sq.from('person').offset(sq.return`1 + 7`).query

{ text: 'select * from person offset (select 1 + 7)',
  args: [] }
```

## Joins

`.join`, `.leftJoin`, `.rightJoin` and `.fullJoin` build inner, left, right and full joins respectively. Either [`.on`](#on) or [`.using`](#using) must be called immediately after.

```js
sq.from`book`.join`author`.on`book.author_id = author.id`.query

{ text: 'select * from book join author on (book.author_id = author.id)',
  args: [] }
```

`.naturalJoin`, `.naturalLeftJoin`, `.naturalRightJoin` and `.naturalFullJoin` build natural joins. Calling [`.on`](#on) or [`.using`](#using) after a natural join is invalid.

```js
sq.from`book`.naturalRightJoin`author`.query

{ text: 'select * from book natural right join author',
  args: [] }
```

`.crossJoin` builds a cross join.

```js
sq.from`book`.crossJoin`author`.query

{ text: 'select * from book cross join author',
  args: [] }
```

Join methods accept the  same arguments as [`.from`](#from).

```js
sq.from({ b: 'book' })
  .naturalFullJoin({ a: 'author' })
  .naturalRightJoin('publisher')
  .query

{ text: 'select book b natural full join author a natural right join publisher',
  args: [] }

```

### On

`.on` specifies join conditions. It accepts the  same arguments as [`.where`](#where). `.on` must be called exactly once.

```js
sq.from({ b: 'book' })
  .join({ a: 'author'}).on({ 'b.author_id': sq.raw('a.id') })
  .query

{ text: 'select * from book b join author a on (b.author_id = a.id)',
  args: [] }
```

Build complex join conditions with [Expressions](expressions).

```js
sq.from({ t: 'ticket' })
  .leftJoin({ p: 'person' })
  .on(e.or(
    e.eq`p.first_name``t.first_name`,
    e.eq`p.last_name``t.last_name`
  ))
  .query

{ text: 'select * from ticket t left join person p on ((p.first_name = t.first_name) or (p.last_name = t.last_name))',
  args: [] }
```

### Using

Alternatively, specify join columns with `.using`. `.using` must be called exactly once.

```js
sq.from`book`.join`author`.using`author_id`.query

{ text: 'select * from book join author using (author_id)',
  args: [] }
```

`.using` accepts strings.

```js
sq.from('a').join('b').using('x', 'y', 'z').query

{ text: 'select * from a join b using (x, y, z)',
  args: [] }
```

## Sets

### Union, Intersect, Except

Pass select subqueries to `.union`, `.intersect` and `.except` to perform set operations.

```js
const Person = sq.from`person`
const Young = Person.where`age < 30`
const Middle = Person.where`age >= 30 and age < 60`
const Old = Person.where`age >= 60`

Person.except(Young).query

{ text: 'select * from person except (select * from person where (age < 30))',
  args: [] }

Young.union(Middle, Old).query

{ text: 'select * from person where (age < 30) union (select * from person where (age >= 30 and age < 60)) union (select * from person where (age >= 60))',
  args: [] }
```

### Union All, Intersect All, Except All

`.unionAll`, `.intersectAll` and `.exceptAll` can be used to prevent duplicate elimination.

```js
Young.unionAll(Old).query

{ text: 'select * from person where (age < 30) union all (select * from person where (age >= 60))',
  args: [] }
```

Set operators can be chained.

```js
Person.except(Young).intersect(Person.except(Old)).query

{ text: 'select * from person except (select * from person where (age < 30)) intersect (select * from person except (select * from person where (age >= 60)))',
  args: [] }
```

## With

**Reference** [Postgres](https://www.postgresql.org/docs/current/queries-with.html) [MySQL](https://dev.mysql.com/doc/refman/en/with.html) [SQLite](https://www.sqlite.org/lang_with.html) [T-SQL](https://docs.microsoft.com/en-us/sql/t-sql/queries/with-common-table-expression-transact-sql)

Construct CTEs (Common Table Expressions) with `.with`.

```js
sq.with`n (select ${20} age)`.from`n`.return`age`.query

{ text: 'with n (select $1 age) select age from n',
  args: [20] }
```

`.with` can be called multiple times.

```js
sq.with`width (select ${10} n)`
  .with`height (select ${20} n)`
  .return`width.n * height.n area`
  .query

{ text: 'with width (select $1 n), height (select $2 n) select width.n * height.n area',
  args: [10, 20] }
```

`.with` accepts objects in the form `{ alias: table }`. Tables can be [Subqueries](manual-queries#subqueries).

```js
sq.with({
    width: sq.return({ n: 10 }),
    height: sq.sql`select ${20} n`
  })
  .return({ area: sq.txt`width.n * height.n` })
  .query

{ text: 'with width (select $1 n), height (select $2 n) select width.n * height.n area',
  args: [10, 20] }
```

Tables can be arrays of row objects. A *values* clause is generated. Column names are inferred from all keys.

```js
const people = [{ age: 7, name: 'Jo' }, { age: 9, name: 'Mo' }]
sq.with({ people }).return`max(age)`.from`people`.query

{ text: 'with people(age, name) (values ($1, $2), ($3, $4)) select max(age) from people',
  args: [7, 'Jo', 9, 'Mo'] }
```

### Recursive CTEs

`.withRecursive` creates a *recursive* CTE.

```js
const one = sq.return`1`
const next = sq.return`n + 1`.from`t`.where`n < 100`
sq.withRecursive({ 't(n)': one.unionAll(next) })
  .from('t')
  .return('sum(n)')
  .query

{ text: 'with recursive t(n) (select 1 union all (select n + 1 from t where (n < 100))) select sum(n) from t',
  args: [] }
```
