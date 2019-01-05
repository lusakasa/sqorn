import { Transaction } from './database'

type Row = { [field: string]: any }

export interface Executable {
  /**
   * Executes a query and returns a Promise for an array of result rows.
   * 
   * @example
```js
await sq.return('id', 'title').from('book').all()
// example result:
[ { id: 1, title: 'The Way of Kings' },
  { id: 2, title: 'Words of Radiance' },
  { id: 3, title: 'Oathbringer' } ]
```
   */
  all(trx?: Transaction): Promise<Row[]>

  /**
   * Executes a query and returns a Promise for the first result row.
   * 
   * If a query returns no rows, `.first` returns `undefined`.
   * 
   * If a query returns multiple rows, all but the first are disgarded.
   * 
   * @example
```js
const book = await sq
  .from('book')
  .where({ genre: 'fantasy' })
  .limit(1)
  .first()

if (book) {
  console.log(book.title)
} else { // book === undefined
  console.log('No fantasy book')
}
```
   */
  first(trx?: Transaction): Promise<Row | undefined>

  /**
   * Executes a query and returns a Promise for the first result row.
   * 
   * If a query returns no rows, `.one` throws an error.
   * 
   * If a query returns multiple rows, all but the first are disgarded.
   * 
   * @example
```js
try {
  const book = await sq.from('book').where({ id: 1 }).one()
} catch (error) {
  console.log('failed')
}
```
   */
  one(trx?: Transaction): Promise<Row>

  /**
   * Executes a query and returns a void Promise that resolves when it is done.
   * 
   * If a query returns rows, all are disgarded.
   * 
   * @example
```js
try {
  await sq.from('book').insert({ title: '1984' }).run()
} catch (error) {
  console.log('failed')
}
```
   */
  run(trx?: Transaction): Promise<void>
}
