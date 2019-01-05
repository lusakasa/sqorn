import { Arg, Numeric } from '../args'

export interface Limit {
  /**
   * Builds a *limit* clause.
   * 
   * @example
```js
sq.from`person`.limit(8)
// select * from person limit 8

sq.from`person`.limit(7).limit(5)
// select * from person limit 5

sq.from`person`.limit(sq.txt`1 + 7`)
// select * from person limit 1 + 7

sq.from`person`.limit(sq.return(10))
// select * from person limit (select 10)
```
   */
  limit(limit: Numeric): this

  /**
   * Builds a *limit* clause.
   * 
   * @example
```js
sq.from`person`.limit`5`
// select * from person limit 5

sq.from`person`.limit`${1} + ${7}`
// select * from person limit 1 + 7
```
   */
  limit(strings: TemplateStringsArray, ...args: Arg[]): this
}