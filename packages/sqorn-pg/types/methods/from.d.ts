import { Arg, FromItem } from '../args'

export interface From {
  /**
   * Selects the table to query from, update, delete from or insert into.
   * 
   * @example
```js
sq.from('book')
// select * from book

sq.from('book').where({ id: 8 }).set({ authorId: 7 })
// update book set author_id = $1 where id = $2

sq.delete.from('book').where({ id: 7 })
// delete from book where id = $1

sq.from('book').insert({ title: 'Moby Dick', authorId: 8 })
// insert into book (title, author_id) values ($1, $2)

sq.from(sq.txt`unnest(array[1, 2, 3])`)
// select * from unnest(array[1, 2, 3])

sq.from({ b: 'book' a: 'author' })
// select * from book as b, author as a

sq.from({ b: 'book' a: 'author' })
// select * from book as b, author as a

sq.from({ old: sq.from('person').where`age > 60` })
// select * from (select * from person where age > 60) as old

sq.from({ p: [{ id: 7, name: 'Jo' }, { id: 9, name: 'Mo' }] })
// select * from (values ($1, $2), ($3, $4)) as p(id, name)

sq.from({ countDown: sq.txt`unnest(${[3, 2, 1]})` }).query
// select * from unnest($1) as count_down'
```
   */
  from(...tables: FromItem[]): this

  /**
   * Selects the table to query from, update, delete from or insert into.
   *
   * @example
```js
sq.from`book`
// select * from book

sq.from`book`.set({ archived: true })
// update book set archived = $1

sq.delete.from`book`
// delete from book

sq.from`book`.insert({ title: 'Squirrels!' })
// insert into book (title) values ($1)

sq.from`book`.from`author`
// select * from book, author

sq.from`book join comment`
// select * from book join comment

sq.from`${sq.raw('book')}`
// select * from book
```
   */
  from(strings: TemplateStringsArray, ...args: Arg[]): this
}