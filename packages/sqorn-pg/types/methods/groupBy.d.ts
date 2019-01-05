import { Arg, SelectItem } from '../args'

interface GroupByItems extends Array<SelectItem | Rollup | Cube | GroupingSets | GroupByItems> {}
interface SelectItemGroup extends Array<SelectItem | SelectItemGroup> {}

interface Rollup {
  type: 'rollup'
  args: SelectItemGroup
}
interface Cube {
  type: 'cube'
  args: SelectItemGroup
}
interface GroupingSets {
  type: 'grouping sets',
  args: GroupByItems
}

export interface GroupByUtil {
  /**
   * **[ROLLUP item](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUPING-SETS)** - creates rollup grouping sets for use in a group by clause
   * 
```sql
rollup (a, b, c)
```
   * is equivalent to
```sql
grouping sets ((a, b, c), (a, b), (a), ())
```
   * 
   * @example
```js
sq.from`t`.groupBy(sq.rollup('a', ['b', sq.txt`c`], 'd'))
// select * from t group by rollup (a, (b, c)), d
```
   */
  rollup(...args: SelectItemGroup): Rollup

  /**
   * **[CUBE item](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUPING-SETS)** - creates cube grouping sets for use in a group by clause
   * 
```sql
cube (a, b, c)
```
   * is equivalent to
```sql
grouping sets ((a, b, c), (a, b), (a, c), (a), (b, c), (b), (c), ())
```
   * 
   * @example
```js
sq.from`t`.groupBy(sq.cube('a', ['b', sq.txt`c`], 'd'))
// select * from t group by cube (a, (b, c)), d
```
   */
  cube(...args: SelectItemGroup): Cube

    /**
   * **[Grouping Sets item](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUPING-SETS)** - creates grouping sets for use in a group by clause
   * 
   * Accepts the same arguments as `.groupBy`. Grouping sets can be nested.
   * 
   * @example
```js
sq.from`t`.groupBy(
  sq.groupingSets(
    ['a', 'b', 'c'],
    sq.groupingSets(['a', 'b']),
    ['a'],
    [],
    sq.cube('a', 'b')
  )
)
// select * from t group by grouping sets ((a, b, c), grouping sets ((a, b)), (a), (), cube (a, b))
```
   */
  groupingSets(...args: GroupByItems): GroupingSets
}

export interface GroupBy {
  /**
   * Builds a *group by* clause.
   * 
   * @example
```js
sq.from('book').return('genre', 'count(*)').groupBy('genre')
// select genre, count(*) from book group by genre

sq.from('book').return('genre', 'year').groupBy('genre', 'year')
// select genre, year from book group by genre, year

sq.from('book').return('genre', 'year').groupBy('genre').groupBy('year')
// select genre, year from book group by genre, year

sq.from('book').return('genre', 'year').groupBy(['genre', 'year'])
// select genre, year from book group by (genre, year)

sq.from`t`.groupBy(sq.rollup('a', ['b', sq.txt`c`], 'd'))
// select * from t group by rollup (a, (b, c)), d

sq.from`t`.groupBy(sq.cube('a', ['b', sq.txt`c`], 'd'))
// select * from t group by cube (a, (b, c)), d

sq.from`t`.groupBy(
  sq.groupingSets(
    ['a', 'b', 'c'],
    sq.groupingSets(['a', 'b']),
    ['a'],
    [],
    sq.cube('a', 'b')
  )
)
// select * from t
// group by grouping sets (
//   (a, b, c),
//   grouping sets ((a, b)),
//   (a),
//   (),
//   cube (a, b)
// )
```
   */
  groupBy(...expressions: GroupByItems): this

  /**
   * Builds a *group by* clause.
   * 
   * @example
```js
sq.from`book`.return`genre, count(*)`.groupBy`genre`
// select genre, count(*) from book group by genre

sq.from`book`.return`genre, year`.groupBy`genre, year`
// select genre, year from book group by genre, year

sq.from`book`.return`genre, year`.groupBy`genre`.groupBy`year`
// select genre, year from book group by genre, year
```
   */
  groupBy(strings: TemplateStringsArray, ...args: Arg[]): this
}