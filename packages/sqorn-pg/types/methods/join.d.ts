import { Arg, FromItem, Condition } from '../args'

export interface Join {
  /**
   * Builds an *inner join*.
   */
  join(fromItem: FromItem): JoinCondition<this>

  /**
   * Builds an *inner join*.
   */
  join(strings: TemplateStringsArray, ...args: Arg[]): JoinCondition<this>

  /**
   * Builds a *left join*.
   */
  leftJoin(fromItem: FromItem): JoinCondition<this>

  /**
   * Builds a *left join*.
   */
  leftJoin(strings: TemplateStringsArray, ...args: Arg[]): JoinCondition<this>

  /**
   * Builds a *right join*.
   */
  rightJoin(fromItem: FromItem): JoinCondition<this>

  /**
   * Builds a *right join*.
   */
  rightJoin(strings: TemplateStringsArray, ...args: Arg[]): JoinCondition<this>

  /**
   * Builds a *full join*.
   */
  fullJoin(fromItem: FromItem): JoinCondition<this>

  /**
   * Builds a *full join*.
   */
  fullJoin(strings: TemplateStringsArray, ...args: Arg[]): JoinCondition<this>

  /**
   * Builds a *cross join*.
   */
  crossJoin(fromItem: FromItem): this

  /**
   * Builds a *cross join*.
   */
  crossJoin(strings: TemplateStringsArray, ...args: Arg[]): this

  /**
   * Builds a *natural join*.
   */
  naturalJoin(fromItem: FromItem): this

  /**
   * Builds a *natural join*.
   */
  naturalJoin(strings: TemplateStringsArray, ...args: Arg[]): this

  /**
   * Builds a *natural left join*.
   */
  naturalLeftJoin(fromItem: FromItem): this

  /**
   * Builds a *natural left join*.
   */
  naturalLeftJoin(strings: TemplateStringsArray, ...args: Arg[]): this

  /**
   * Builds a *natural right join*.
   */
  naturalRightJoin(fromItem: FromItem): this

  /**
   * Builds a *natural right join*.
   */
  naturalRightJoin(strings: TemplateStringsArray, ...args: Arg[]): this

  /**
   * Builds a *natural full join*.
   */
  naturalFullJoin(fromItem: FromItem): this

  /**
   * Builds a *natural full join*.
   */
  naturalFullJoin(strings: TemplateStringsArray, ...args: Arg[]): this
}


interface JoinCondition<T> {
  /**
   * Builds a join on the given conditions.
   * 
   * @example
```js
sq.from({ b: 'book' }).join({ a: 'author'}).on`b.author_id = a.id`
// select * from book as b join author as a on (b.author_id = a.id)

sq.from({ b: 'book' }).join({ a: 'author'})
  .on({ 'b.author_id': sq.raw('a.id') }).on({ 'b.genre': 'Fantasy' })
// select * from book as b join author as a on (b.author_id = a.id) and (b.genre = 'Fantasy')

sq.from({ b: 'book' }).join({ a: 'author'}).on`${sq.raw('b.author_id')} = ${sq.raw('a.id')}`
  .and({ 'b.genre': 'Fantasy' }).or({ 'b.special': true })
// select * from book as b join author as a on (b.author_id = a.id) and (b.genre = $1) or (b.special = true)
```
   */
  on(...conditions: Condition[]): T

  /**
   * Builds a join on the given conditions.
   * 
   * @example
```js
sq.from`book as b`.join`author as a`.on`b.author_id = a.id`
// select * from book as b join author as a on (b.author_id = a.id)

sq.from`book as b`.join`author as a`
  .on`b.author_id = a.id`.on`b.genre = 'Fantasy'`
// select * from book as b join author as a on (b.author_id = a.id) and (b.genre = 'Fantasy')

sq.from`book as b`.join`author as a`.on`b.author_id = a.id`
  .and`b.genre = 'Fantasy'`.or`b.special = true`
// select * from book as b join author as a on (b.author_id = a.id) and (b.genre = $1) or (b.special = true)
```
   */
  on(strings: TemplateStringsArray, ...args: Arg[]): T

  /**
   * Builds a join using the given columns.
   * 
   * @example
```js
sq.from('book').join('author').using('author_id')
// select * from book join author using (author_id)

sq.from('a').join('b').using('x', 'y').using('z')
// select * from a join b using (x, y, z)
```
   */
  using(...columns: string[]): T
  
  /**
   * Builds a join using the given columns.
   * 
   * @example
```js
sq.from`book`.join`author`.using`author_id`
// select * from book join author using (author_id)

sq.from`a`.join`b`.using`x, y`.using`z`
// select * from a join b using (x, y, z)
```
   */
  using(strings: TemplateStringsArray, ...args: Arg[]): T
}