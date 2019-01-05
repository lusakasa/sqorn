import { Subquery } from '../args'

export interface SetOperators {
  /**
   * **UNION Clause** - union queries
   * 
   * Pass `.union` the queries to union with the current query.
   * 
   * Union is a set operator, so duplicate result rows are eliminated.
   * 
   * Call `.unionAll` to keep duplicates.
   * 
   * @example
```js
sq.from`a`.union(sq.from`b`)
// select * from a union (select * from b)

sq.from`a`.union(sq.from`b`, sq.from`c`)
// select * from a union (select * from b) union (select * from c)

sq.from`a`.union(sq.from`b`).union(sq.from`c`)
// select * from a union (select * from b) union (select * from c)
```
   */
  union(...subqueries: Subquery[]): this

  /**
   * **UNION ALL Clause** - unionAll queries
   * 
   * Pass `.unionAll` the queries to union with the current query.
   * 
   * Use `.unionAll` instead of `.union` to keep duplicate result rows.
   * 
   * @example
```js
sq.from`a`.unionAll(sq.from`b`)
// select * from a union all (select * from b)

sq.from`a`.unionAll(sq.from`b`, sq.from`c`)
// select * from a union all (select * from b) union all (select * from c)

sq.from`a`.unionAll(sq.from`b`).unionAll(sq.from`c`)
// select * from a union all (select * from b) union all (select * from c)
```
   */
  unionAll(...subqueries: Subquery[]): this

  /**
   * **INTERSECT Clause** - intersect queries
   * 
   * Pass `.intersect` the queries to intersect with the current query.
   * 
   * intersect is a set operator, so duplicate result rows are eliminated.
   * 
   * Call `.intersectAll` to keep duplicates.
   * 
   * @example
```js
sq.from`a`.intersect(sq.from`b`)
// select * from a intersect (select * from b)

sq.from`a`.intersect(sq.from`b`, sq.from`c`)
// select * from a intersect (select * from b) intersect (select * from c)

sq.from`a`.intersect(sq.from`b`).intersect(sq.from`c`)
// select * from a intersect (select * from b) intersect (select * from c)
```
   */
  intersect(...subqueries: Subquery[]): this

  /**
   * **INTERSECT ALL Clause** - intersectAll queries
   * 
   * Pass `.intersectAll` the queries to intersect with the current query.
   * 
   * Use `.intersectAll` instead of `.intersect` to keep duplicate result rows.
   * 
   * @example
```js
sq.from`a`.intersectAll(sq.from`b`)
// select * from a intersect all (select * from b)

sq.from`a`.intersectAll(sq.from`b`, sq.from`c`)
// select * from a intersect all (select * from b) intersect all (select * from c)

sq.from`a`.intersectAll(sq.from`b`).intersectAll(sq.from`c`)
// select * from a intersect all (select * from b) intersect all (select * from c)
```
   */
  intersectAll(...subqueries: Subquery[]): this

  /**
   * **EXCEPT Clause** - except queries
   * 
   * Pass `.except` the queries to except with the current query.
   * 
   * except is a set operator, so duplicate result rows are eliminated.
   * 
   * Call `.exceptAll` to keep duplicates.
   * 
   * @example
```js
sq.from`a`.except(sq.from`b`)
// select * from a except (select * from b)

sq.from`a`.except(sq.from`b`, sq.from`c`)
// select * from a except (select * from b) except (select * from c)

sq.from`a`.except(sq.from`b`).except(sq.from`c`)
// select * from a except (select * from b) except (select * from c)
```
   */
  except(...subqueries: Subquery[]): this

  /**
   * **EXCEPT ALL Clause** - exceptAll queries
   * 
   * Pass `.exceptAll` the queries to except with the current query.
   * 
   * Use `.exceptAll` instead of `.except` to keep duplicate result rows.
   * 
   * @example
```js
sq.from`a`.exceptAll(sq.from`b`)
// select * from a except all (select * from b)

sq.from`a`.exceptAll(sq.from`b`, sq.from`c`)
// select * from a except all (select * from b) except all (select * from c)

sq.from`a`.exceptAll(sq.from`b`).exceptAll(sq.from`c`)
// select * from a except all (select * from b) except all (select * from c)
```
   */
  exceptAll(...subqueries: Subquery[]): this
}