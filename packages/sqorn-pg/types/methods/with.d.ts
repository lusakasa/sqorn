import { Arg, WithItem } from '../args'

export interface With {
  /**
   * Builds a CTE (Common Table Expression)
   * 
   * Multiple `.with` calls are joined with `', '`.
   * 
   * Call `.withRecursive` to make the CTE recursive.
   * 
   * @example
```js
sq.with({
    width: sq.return({ n: 10 }),
    height: sq.sql`select ${20} as n`
  })
  .return({ area: sq.txt`width.n * height.n`})
// with width as (select 10 as n), height as (select 20 as n)
// select width.n * height.n as area

const people = [{ age: 7, name: 'Jo' }, { age: 9, name: 'Mo' }]
sq.with({ people }).return('max(age)').from('people')
// with people(age, name) as (values (7, 'Jo'), (9, 'Mo'))
// select max(age) from people
```
   */
  with(...tables: WithItem[]): this

  /**
   * Builds a CTE (Common Table Expression)
   * 
   * Multiple `.with` calls are joined with `', '`.
   * 
   * Call `.withRecursive` to build a recursive CTE.
   *
   * @example
```js
sq.with`n as (select ${20} as age)`.from`n`.return`age`
// with n as (select 20 as age) select age from n

sq.with`width as (select ${10} as n)`
  .with`height as (select ${20} as n)`
  .return`width.n * height.n as area`
// with width as (select 10 as n), height as (select 20 as n)
// select width.n * height.n as area
```
   */
  with(strings: TemplateStringsArray, ...args: Arg[]): this



  /**
   * Builds a recursive CTE (Common Table Expression)
   * 
   * Call `.with` to build a non-recursive CTE.
   * 
   * @example
```js
const one = sq.return`1`
const next = sq.return`n + 1`.from`t`.where`n < 100`
sq.withRecursive({ 't(n)': one.unionAll(next) })
  .from`t`
  .return`sum(n)`
```
   *
```sql
-- SQL
with recursive t(n) as (
  select 1 union all (select n + 1 from t where (n < 100))
)
select sum(n) from t'
```
   */
  withRecursive(...tables: WithItem[]): this

  /**
   * Builds a recursive CTE (Common Table Expression)
   * 
   * Call `.with` to build a non-recursive CTE.
   * 
   * @example
```js
const one = sq.return`1`
const next = sq.return`n + 1`.from`t`.where`n < 100`
sq.withRecursive`t(n) as (
  select 1 union all (select n + 1 from t where (n < 100))
)`
  .from`t`
  .return`sum(n)`
```
   *
```sql
-- SQL
with recursive t(n) as (
  select 1 union all (select n + 1 from t where (n < 100))
)
select sum(n) from t
```
   */
  withRecursive(strings: TemplateStringsArray, ...args: Arg[]): this
}