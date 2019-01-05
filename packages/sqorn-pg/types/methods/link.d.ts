export interface Link {
  /**
   * Specifies the separator used to join components of a manual query
   * or clauses of a non-manual query.
   * 
   * @example
```js
const books = [{ id: 1, title: '1984' }, { id: 2, title: 'Hi' }]
const value = book => sq.txt(book.id, book.title)
const values = sq.extend(books.map(value)).link(', ')
// ($1, $2), ($3, $4)

sq.sql`insert into book(id, title)`
  .sql`values ${values}`
  .link('\n')
// insert into book(id, title)
// values ($1, $2), ($3, $4)'
```
   */
  link(separator: string): this;
}
