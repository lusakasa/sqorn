import { Arg, Condition } from '../args'

export interface Having {
  /**
   * Builds a *having* clause.
   * 
   * @example
```js
sq.from('book')
  .return('genre')
  .groupBy('genre')
  .having(e.count.gt(10))
// select genre from book group by genre having (count(*) > 10)
```
   */
  having(...conditions: Condition[]): this

  /**
   * Builds a *having* clause.
   * 
   * @example
```js
sq.from`book`
  .return`genre`
  .groupBy`genre`
  .having`count(*) > 10`
// select genre from book group by genre having (count(*) > 10)
```
   */
  having(strings: TemplateStringsArray, ...args: Arg[]): this
}