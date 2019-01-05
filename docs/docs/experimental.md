# Experiments

## Join

```js
knex.select('*').from('users').leftJoin('accounts', 'users.id', 'accounts.user_id')

sq.from({ u: 'users' })
  .join({ a: 'accounts' }).left({ 'u.id': 'a.user_id' })
// introduce .and and .or that selectively build either .where, .having, or .long

sq.from({ u: 'users' })
  .join({ a: 'accounts' }).on({ 'u.id': 'a.user_id' })
  .join({ a: 'accounts' }).on({ 'u.id': 'a.user_id' })

sq.from({ u: 'users' })
  leftJoin({ a: 'accounts' }).on({ 'u.id': 'a.user_id' })
  rightJoin({ a: 'accounts' }).on({ 'u.id': 'a.user_id' })
  .lateralrightJoin({ a: 'accounts' }).on({ 'u.id': 'a.user_id' })
  .naturalrightJoin({ a: 'accounts' })

sq.from({ u: 'users' })
  .join({ a: 'accounts' }).on({ 'u.id': 'a.user_id' })
  .wrap(
    sqrightJoin({ a: 'accounts' }).using('meow')
      .naturalfullJoin({ a: 'accounts' })
  )

sq.from('users')
  .from({ a: join('accounts').left({ 'u.id': 'a.user_id' })})
```

## JSON helper

```sql

SELECT json_agg(r.*) FROM (
  SELECT
    album.title title,
    json_agg(track.*) tracks
  FROM
    album
  LEFT OUTER JOIN
    track
  ON
    (album.id = track.album_id)
  WHERE
    album.year = 2018
  GROUP BY
    album.id
) r
```

```js
sq.return({ album: 'json_agg(r.*)' })
  .from({
    r: sq.return({ title: 'album.title', tracks: 'json_agg(track.*)' })
      .from('album')
      leftJoin('track').on('album.id = track.album_id')
      .where({ 'album.year': 2018 })
      .groupBy('album.id')
  })

const { Album, Track } =  require('./models')
// models define primary keys and relationships
const res = await Album({ year: 2018 })(
  title: 'title',
  tracks: Track
)

`
select json_agg(r.*) from (
  select album.title title, json_agg(track.*) tracks
  from album
       join track on album.track_id = track.id
  group by album.id
) r`
               
const albums await

sq.json(
  sq.return
)


query = offset(limit(order(select(having(group(where(from))))))

const item = select(
  group(
    from(
      where
    ),
    having
  ),
  order,
  limit,
  offset
)

Topic({
  subscribers: User({
    followers: User()
  })
})

Topic({
  subscribers: User({
    followers: User()
  })
})



query = from(tables)      : type a = union all tables
     |> where(conds)      : type a
     |> group(cols, aggs) : type b = subset a union aggs g
     |> having(conds)     : type b
     |> select(fn)        : type c = fn(b)
     |> order             : type c
     |> limit             : type c
     |> offset            : type c

From, group, and select are type changing operations


 

const a = Person.a.as('a')
const b = Person.b.as('b')

Person.groupBy(a, b).return(
  // aggregate expressions, only these are eligible for relatinoships
  a,
  b,
  // aggregate Function of source table
  ...x[]: e(agg(e(Person)))
)

const name = Person.name.as('name')
Person.groupBy(name).return(
  name,
  name: // umm doesn't really work
)

// relationships don't really work with aggregates
// limiting grammar to:
sq[.from(s)][.where(c)].return(

)[.limit(l)][.offset(o)]

Table({ where, order, limit, offset })(
  ...alias: Expression
)

Topic({ where: 'genre = fantasy', limit: 1, offset: 7 })({
  topic: Topic.name
  posts: Topic.posts(Post)
})

const Query = {
  'Fantasy'
}


```



## table syntax, generate queries from relationships, graphql, json

Basic Idea:
* User defines table models and relationships
* user passes 
```js
// previously defined model relationships
const { sq, book, author, publisher, city } = require('./db')



post.where({ firstName: 'Jo'}).orderBy(post.id).limit(1).return({
  title: 'title',
  body: 'body',
  author: user.where({ status: 'good' }).return({
    username: 'username'
  }),
  comments: comment.return({
    title: 'title',
    body: 'body',
    author: user.return({
      username: 'username'
    })
  })
}).query

{
  text: '',
  args: [],
  results: [
    {
      title: 'Cool Post',
      body: 'bla bla bla',
      author
    }
  ]
}


author({ id: 7 }).get('first_name', 'last_name')
  .publisher
  .city.get('name')


sq.return(book.id, book.tile, book.author.firstName, book.author.lastName)
  .where(e(book.id).eq(7))
  .query

{ text: `select book.id, book.title, author.first_name, author.last_name
         from book join author on book.author_id = author.id
         where book.id = $1`,
  args: [7] }

sq.json(post.title, post.comments.limit(3).orderBy('create_time asc'))
  .where(e(post.id).eq(7).and())
  .query

{ text: 'select post.title, author.first_name, author.last_name, json_agg(comment.*)',
  args: [] }

// returns json
sq.return(
  book(
    'id',
    'title',
    author(
      'firstName'
    )
  )
).where(
  and(
    eq(book.genre, 'Fantasy'),
    lt(book.id, 100),
  )
  e(book.genre).eq('Fantasy').and(book.id).lt(100)
).query

{ text: 'select book.id, book.title, author.first_name from book',
  args: [],
  results: [
    book: {
      id: 1,
      title: 'Meow',
      author: {
        firstName: 'Tom'
      }
    }
  ]
}
```


## tests

```js
const { qry, frm, whr, ret, ord, lim } = require('sqorn')

const getTimeRange = time => {
    switch (time) {
      case 'day': return '1 day'
      case 'week': return '7 days'
      case 'month': return '30 days'
      case 'year': return '365 days'
  }
}

const getTopPosts = ({ time, topic, user, max = 25 }) => {
  const range = getTimeRange(time)
  return qry(
    frm`post`,
    user && whr({ user }),
    topic && whr({ topic }),
    range && whr`create_time >= now() - ${sq.raw(timeRange)}`,
    ord`score asc`,
    max && lim(max),
    ret`id, name, age`
  )
}


// ex

const Post = sq(frm`post`)
const TopicPost Post({ topic }, ret`id`, lim(5), ord.dsc`score`)
```

```sql
select b.ID book_id, b.name book_name, c.name category_name, 
    (select count(*) from articles a where a.book_id = b.id) article_count
from BOOKS b
  inner join category c on c.id = b.category_id and c.kind = 'science'
where b.id >= 1 and b.id < 100 and b.name like ? and (release_date between ? and ?
        or release_date between to_date('2015-01-01', 'yyyy-mm-dd') and to_date('2016-01-01', 'yyyy-mm-dd'))
    and c.name in ('novel','horror','child')
    and (select name from author where id = b.author_id) = 'Jessica Parker'
order by c.name, b.release_date desc
```

```js
  const sub = sq.from`articles a``a.book_id = b.id``count(*)`

```

### JSX SQL

```jsx
const query = (
  <Select
    from={"book"}
    where={<Eq a="genre" b="Fantasy" />}
    return={['title']}
  />
)
```

### create table

TODO: REVISE: EXPERIMENTAL

```javascript
const person = sq
  .tbl`person`
  .col`id`                     `serial`
                               .pk
  .col`first_name`             `text not null`
                               .idx
  .col`last_name`              `text not null`
  .col`age`                    `integer`
                               .chk`age >= 0`
  .col`mother`                 `integer`
                               .delete`cascade`
                               .fk `person(id)`
  .col`father`                 `integer`
  .fk `mother`                 `person(id)`
  .chk`first_name`             `char_length(first_name) <= 320)`
  .unq`first_name, last_name, age`
  .idx`last_name`
```

```javascript
const person = sq.tbl`person`
  .col`id`                     `serial`
                               .pk
  .col`first_name`             `text not null`
                               .idx
  .col`last_name`              `text not null`
  .col`age`                    `integer`
                               .chk`age >= 0`
  .col`mother`                 `integer`
                               .delete`cascade`
                               .fk `person(id)`
  .col`father`                 `integer`
  .fk `mother`                 `person(id)`
  .chk`first_name`             `char_length(first_name) <= 320)`
  .unq`first_name, last_name, age`
  .idx`last_name`
```


### transactions

```javascript
await sq.transaction(async trx => {
  const created = await createSecret({ expires: '24 hours', type: 'code' }).one(trx)
  const queried = await getSecret({ secret: created.secret }).one(trx)
  const deleted = await deleteSecret({ secret: queried.secret }).one(trx)
})

```














# [Sqorn](https://sqorn.org) &middot; [![License](https://img.shields.io/github/license/sqorn/sqorn.svg)](https://github.com/sqorn/sqorn/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/sqorn.svg)](https://www.npmjs.com/package/sqorn) [![npm](https://img.shields.io/travis/sqorn/sqorn.svg)](https://travis-ci.org/sqorn/sqorn) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)


Sqorn is a Javascript library for building SQL queries.

**Composable:** Build complex queries from simple parts. Extend existing queries or embed subqueries.

**Boilerplate free:** Sqorn provides **concise** syntax for common CRUD operations.

<p style="color: red">Sqorn is in early development. The API is subject to change and not yet fully implemented.</p>

## Install

```sh
npm install --save sqorn
npm install --save pg # only Postgres is currently supported
```

Then read the [tutorial](https://sqorn.org/docs/tutorial.html).

## Examples

CRUD Operations are dead simple.

```js
const Person = sq.from`person`, Book = sq.from`book`

// SELECT
const children = await Person`age < ${13}`
// "select * from person where age < 13"

// DELETE
const [deleted] = await Book({ id: 7 })`title`.delete
// "delete from book where id = 7 returning title"

// INSERT
await Person.insert({ firstName: 'Rob' })
// "insert into person (first_name) values ('Rob')"

// UPDATE
await Person({ id: 23 }).set({ name: 'Rob' })
// "update person where id = 23 set name = 'Rob'"

```

Build complex queries from simple parts.

```js
// CHAIN CLAUSES
const Book = sq.from`book`
const OldBooks = books.where`publishYear < 1900`
const oldFantasyBooks = oldBooks.where`genre = 'Fantasy'`
const numOldFantasyBooks = oldFantasyBooks.return`count(*) count`
const { count } = await numOldFantasyBooks.one()

// BUILD NEW QUERIES FROM EXISTING QUERIES
const lang = language => sq.where({ language })
const distinctAuthors = sq.return`distinct author`
const oldEnglishBookAuthors = sq.extend(
  oldBooks, lang('English'), distinctAuthors)
const authors = await oldEnglishBookAuthors.all()

// EMBED SUBQUERIES
const tomorrow = sq.return`now() + '1 day'`const time = sq.return`now() now, ${tomorrow} tomorrow`
const { now, tomorrow } = await time.one()
```

### Select

```sql
select * from book
```

```javascript
sq.from`book`
  .return`*`
// or
sq.from`book`
```

`.from` specifies the table to query and `.return` specifies the selected columns. If `.return` isn't called, select queries implicitly request all columns (`*`).

Using `sq.from` a template literal tag is shorthand for calling `.from`.

### Where

```sql
select age, job from person where first_name = 'Kaladin
```

```javascript
sq.from`person`
  .where`first_name = ${'Kaladin'}`
  .return`age, job`
// or
sq.from`person``first_name = ${'Kaladin'}``age, job`
```

`.where` specifies the `where` clause, which filters result rows. 

All methods of `sq.from` escape template literal arguments, except when noted otherwise.


### Where Object

```javascript
sq.from`book`
  .where({ publishYear: 1984 })
// or
sq.from`book`({ publishYear: 1984 })
```

`.where` also accepts object arguments. By default `sq.from` converts method arguments of type `Object` from `CamelCase` to `snake_case`.


### Where Compound

```sql
select * from book
where not (title = 'Oathbringer')
or (pages >= 200 and genre = 'fantasy')
```

```javascript
const title = 'Oathbringer', minPages = 200, genre = 'fantasy'

sq.from`book`
  .where`not (title = ${title})`
  .where`or (pages >= ${minPages} and genre = ${genre})`
// or
sq.from`book`(
    sq.not({ title }),
    { minPages: sq.l`pages >= ${minPages}`, genre }
  )
// or
sq.from`book`
  .where(sq.not({ title }))
  .where`or`
  .where({ minPages: sq.l`pages >= ${minPages}`, genre })
// or
sq.from`book`(
  sq.or(
    sq.not(sq.op`=`('title', title))
    sq.and(
      sq.op`>=`('pages', minPages)
      sq.l`genre = ${genre}`,
    )
  )
```

**NOTE: SQL query strings generated from the calls above, though logically equivalent, may have varying parantheses and spacing.**

Conditions generated from multiple calls to `.where` are joined with the `new line` character (`\n`).

`.where` converts each object argument to the logical conjunction (`AND`) of the conditions represented by its properties.

`.where` uses logical disjunction (`OR`) to join the conditions represented by each object argument.

`.not` negates one argument, `.and` conjuncts two arguments, and `.or` disjuncts two arguments.

`.op` takes a template literaly naming a binary operator and returns a function that applies the operator to its two arguments.

### and

```javascript
const author = 'Moby Dick'
const language = 'English'

q`book`.where`author = ${author} and language = ${language}`.all
// or
q`book`.where({ author, language }).all
```

```sql
select * from `books` where author = 'Moby Dick' and language = 'English'
```

### or

```javascript
const author = 'Moby Dick'
const language = 'English'
const year = 1984

q`book`.where`author = ${author} or (language = ${language} and year != ${year})`.all
// or
q`book`.where({ author }, { language, year: q.not(year) }).all
// or
q`book`.where(q.or({ author }, q.and({ language }, q.not({ year }))).all
// note
```



```sql
select * from `books` where author = 'Moby Dick' or language = 'English'
```
### manual conditions

```javascript
const minYear = 1800
const maxYear = 1984

q`book`.fil`year >= ${minYear} and year <= ${maxYear} `.all
// or
q`book`where({
  min: q.c`year >= ${minYear}`,
  max: q.c`year <= ${maxYear}`
}).all
```

```sql
select * from book where year >= 1800 and year <= 1984
```

### insert

```javascript
sq.from`person`
  .insert({ firstName, lastName, age })
  .one`id`
// insert into person (first_name, last_name, age)
// values ('John', 'Doe', 40) returning id
sq.from`person`
  .insert`first_name, last_name`
  `upper(${firstName}), upper(${lastName})`
  .run
// insert into person (first_name, lastName)
// values (upper('John'), upper('Doe'))
```

### insert multiple


```javascript
const people = [{ age: 13 }, { age: null, lastName: 'jo' }, { age: 23, lastName: 'smith' }]
sq.from`person`
  .insert(...people)
  .all`id`
// insert into person (age, last_name)
// values (13, DEFAULT), (NULL, 'jo'), (23, 'smith') returning id
sq.from`person`
  .insert`last_name`
  (people, person => sq.l`upper(${person.lastName})`)
  .run
// insert into person (lastName)
// values (upper(), upper('Doe'))
sq.from`person`
  .insert`first_name`
  `upper(${people[0].firstName})`
  `upper(${people[1].firstName})`
  `upper(${people[2].firstName})`
  .run
// insert into person (first_name, lastName)
// values(upper('John'), upper('Doe'))
let insert = sq.from`person`.insert`first_name`
people.forEach(person => { insert = insert`upper(${person.firstName})` })
insert.run
```

## update

```javascript
const age = 23
const increment = 2
sq.from`person`({ age })`count(*)`
  .set({ age: sq.l`age + ${increment}`, updateTime: sq.l`now()`})
// or
sq.from`person`
  .where`age = ${age}`
  .set`age = age + ${increment}, update_time = now()`
  .return`count(*)
```

```sql
update person set age = 24 where age = 23 returning count(*)
```

## upsert (insert conflict)



```sql
update person
set age = 23, first_name = 'bob'
where 
```

```javascript

```

### subquery

```javascript
q`author`.where`author_id in ${
  q`book`.where`year < 1984`.return`author_id`
}`.run
```

```sql
select * from author where author_id in (
  select author_id from book where year < 1984
)
```

### join

```javascript
sq.from`person p join company c on p.employer_id = c.id``p.id = ${23}``c.name`

sq.inj`p.employer_id = c.id`(`person p`, `company c`))`p.id = ${23}``c.name`
```

```sql

```

### in, not in

```javascript

```

```sql

```


### with

```sql
with `with_alias` (
  select * from "book" where "author" = 'Moby Dick'
)
select * from `with_alias`
```

```javascript
q`book`
q()`book`.all`title, author, year`
```

### group by

```sql
select age, count(*) from person group by age
```

```javascript
sq.from`person`()`age, count(*)`.groupBy`age`
```

### having

```sql
select age, count(*) count from person group by age having age < 18
```

```javascript
sq.from`person`()`age, count(*) count`.groupBy`age``age < 18`
```

### order by

```sql
select * from person order by last_name, first_name
```

```javascript
sq.from`person`.orderBy`last_name, first_name`
```

### limit

```sql
select * from person order by last_name limit 10 offset 7
```

```javascript
sq.from`person`.orderBy`last_name, first_name`.limit(10).offset(7)
```

### offset

### transactions

```javascript
await sq.transaction(async trx => {
  const created = await createSecret({ expires: '24 hours', type: 'code' }).one(trx)
  const queried = await getSecret({ secret: created.secret }).one(trx)
  const deleted = await deleteSecret({ secret: queried.secret }).one(trx)
})

```

### complex query examples






## API

### shared

#### wth

#### frm

#### whr

#### ret



### select

#### grp

#### hav

#### ord

#### lim

#### off



### delete

#### del



### insert

#### ins

#### val

### update

#### upd



### execute

#### trx: async (callback: async (trx: Transaction) => any) => any

__Description:__

  Runs the asynchronous callback function in the context of a transaction. A `Transaction` object `trx` is made available to the callback and should be passed to all queries that are part of the transaction.

__Returns:__

  the value return by the callback

#### str: () => string

__Description:__

  builds a SQL query string representing the current context

__Returns:__

  a SQL query string representation of the current context

#### run: async (trx?: Transaction) => void

__Description:__

  executes the query

__Returns:__

  a promise that resolves when the query is done

#### one: async (trx?: Transaction) => any

__Description:__

  executes the query

__Returns:__

  a promise for the first row returned by the query or `undefined` if no rows were returned

#### all: async (trx?: Transaction) => any[]

__Description:__

  Executes the query

__Returns:__

  a promise for an array of results (which may have length 0)

#### exs: async (trx?: Transaction) => boolean

__Description:__

  executes the query

__Returns:__

  a promise that resolves to true if at least one row was returned by the query, false otherwise

### Where operators

#### and

#### or

#### not



### join

#### .inj

#### .ouj

#### .lij

#### .loj

#### .rij

#### .roj

#### .naj

## Style Guide

```javascript
const firstName = 'John', lastName = 'Doe', age = 40, order = 'DESC'
sq.from`person`
// select * from person
sq.from`person`({ firstName })
// select * from person where first_name = 'John'
sq.from`person``age > ${age}``first_name`
// select first_name from person where age > 40
sq.from`person``id`.insert({ firstName, lastName, age })
// insert into person (first_name, last_name, age)
// values ('John', 'Doe', 40) returning id
sq.from`person``id`
  .insert`first_name, last_name``upper(${firstName}), upper(${lastName})`
// insert into person (first_name, lastName)
// values(upper('John'), upper('Doe')) returning id
sq.from`person`({ age })`id`.delete
// delete from person where age = 40 returning id
sq.from`person``age < ${age}`.delete
// delete from person where age < 40
sq.from`person p join company c on p.employer_id = c.id`
  `p.id = ${23}``c.name`
// select c.name from person p join company c on p.employer_id = c.id
// where p.id = 23
sq.wit`children`(sq.from`person``age < ${18}`)`children`()`first_name`
// with children (select * from "person" where age < 18)
// select first_name from children`
sq.l`name = ${firstName}`
// name = 'John' -- builds escaped SQL string
sq.ary`order by name ${order}`
// order by name DESC -- builds unescaped SQL string
const colors = sq.return`'red', 'yellow','blue'`
sq.from`${colors} c`
// select * from (select 'red', 'yellow', 'blue') c
```


```javascript
const firstName = 'John', lastName = 'Doe', age = 40, order = 'DESC'
sq.from`person`
  .return`*`
// select * from person
sq.from`person`
  .where({ firstName })
// select * from person
// where first_name = 'John'
sq.from`person`
  .where`age > ${age}`
  .return`first_name`
// select first_name
// from person
// where age > 40
sq.from`person`
  .insert({ firstName, lastName, age }
  .return`id`
// insert into person (first_name, last_name, age)
// values ('John', 'Doe', 40)
// returning id
sq.from`person`
  .col`first_name, last_name`
  .insert`upper(${firstName}), upper(${lastName})`
  .return`id`
// insert into person (first_name, lastName)
// values(upper('John'), upper('Doe')) returning id
sq.delete`person`
  .where({ age })
  .return`id`

// delete from person where age = 40 returning id
sq.from`person``age < ${age}`.delete
// delete from person where age < 40
sq.from`person p join company c on p.employer_id = c.id`
  `p.id = ${23}``c.name`
// select c.name from person p join company c on p.employer_id = c.id
// where p.id = 23
sq.from`person`({ name: 'Ed' }).set({ name: 'Edward' })
Person({ name: 'Ed' })
Person({ name: 'Ed' }).set({ name: 'Edward', age: sq.l`age + 1` })
Person.insert({ name: 'Ed' })
Person.delete({ name: 'Ed' })

sq.wit`children`(sq.from`person``age < ${18}`)`children`()`first_name`
// with children (select * from "person" where age < 18)
// select first_name from children`
sq.l`name = ${firstName}`
// name = 'John' -- builds escaped SQL string
sq.ary`order by name ${order}`
// order by name DESC -- builds unescaped SQL string
```

## FAQ

### How does sqorn work?

When a method on the query builder `sq.from` is called, it pushes an object containing the method name and arguments to an array named `methods`.

```javascript
sq.from`person`.where`age > ${20} and age < ${30}`.return`name`
// methods ===
[ { type: 'frm', args: [ [ 'person' ] ] },
  { type: 'whr', args: [ [ 'age > ', ' and age < ', '' ], 20, 30 ] },
  { type: 'ret', args: [ [ 'name' ] ] } ]

```

Certain methods like `.run` trigger the three-step compilation process:

First, the entries in `methods` are processed sequentially to build a context object `ctx`.

```javascript
// ctx === context(methods) ===
{ type: 'select',
  frm: [ [ 'person' ] ],
  whr: [ [ 'age > ', ' and age < ', '' ], 20, 30 ],
  ret: [ [ 'name' ] ] }
```

Second, a `Query` of type `ctx.type` is constructed. Each `Query` is constructed from a sequence of `clauses`, which are evaluated against `ctx`. Each clause returns an object with properties `txt` for its text component and `arg` for its parameterized arguments.

```javascript
select = Query(ctx)(
  With,   // undefined
  Select, // { text: 'select age', args: [] }
  From,   // { text: 'from person', args: []}
  Where,  // { text: 'where age > $1 and age < $2, args: [7, 13] }
  Group,  // undefined
  Having, // undefined
  Order,  // undefined
  Limit,  // undefined
  Offset  // undefined
)
```

Finally, the contributions from all clauses are joined together to construct a complete SQL query with parameterized arguments. This query is passed to the underlying database library for execution.

```javascript
{ text: 'select age from person where age > $1 and age < $2' 
  args: [7, 13] }
```



cached queries thoughts:
```js



const getSecret = ({ secret }) => sq.from`secret`({ secret }).prp('getSecret')

const preparedGetSecret = ({
  const prepared = getSecret().prp('getSecret')
  return ({ secret }) => prepared()
})()

sq.stm`getSecret`




```


## Roadmap

* integrate pg
* implement execution methods
* support object parameters
* complete implementation
* add query validation
* implement .str (for pg)
* write tests for everything
* table and constain creation / migration
