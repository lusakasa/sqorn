import { Arg, SelectItem } from '../args'

export interface Distinct {
  /**
   * Filters query results so only distinct rows are returned. Duplicate result rows are eliminated.
   * 
   * Use `.distinctOn` instead to specify the expressions to filter on.
   * 
   * @example
```js
sq.return('name', 'age').distinct.from('person')
// select distinct name from person
```
   */
  distinct: this

  /**
   * Filters query results such that only one row is returned per group of rows sharing values for the given expressions.
   * 
   * @example
```js
sq.from('person').return('name', 'age').distinctOn('name').orderBy('name')
// select distinct on (name) name, age from person order by name

sq.from('person').distinctOn('name', 'age').distinctOn('gender')
// select distinct on (name, age, gender) * from person
```
   */
  distinctOn(...expressions: SelectItem[]): this

  /**
   *  Filters query results such that only one row is returned per group of rows sharing values for the given expressions.
   * 
   * @example
```js
sq.from`person`.return`name, age`.distinctOn`name`.orderBy`name`
// select distinct on (name) name, age from person order by name

sq.from`person`.distinctOn`name, age`.distinctOn`gender`
// select distinct on (name, age, gender) * from person
```
   */
  distinctOn(strings: TemplateStringsArray, ...args: Arg[]): this
}