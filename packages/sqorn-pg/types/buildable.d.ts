import { Arg } from './args'

export interface Queryable<T extends string> extends Buildable<T> {
  /**
   * Compiles the query builder state to return the equivalent parameterized query
   *
   * @example
```js
sq.sql`select * from book`.query
{ text: 'select * from book',
  args: [] }

sq.from('book').where({ id: 7 }).return('title').query
{ text: 'select title from book where id = $1',
  args: [7] }

sq.delete.from('book').where({ id: 7 }).return('title').query
{ text: 'delete from book where id = $1 returning title',
  args: [7] }
```
   */
  query: { text: string, args: Arg[] }

  /**
   * **DANGER. DO NOT USE THIS METHOD. IT IS VULNERABLE TO SQL INJECTION.**
   * 
   * Compiles the query builder, returning an unparameterized query string.
   *
   * @example
```js
sq.from('book').where({ id: 7 }).return('title').unparameterized

'select title from book where id = 7'
```
   */
  unparameterized: string;
}

declare const build: unique symbol

export interface Buildable<T extends string> {
  [build](ctx: any): string;
  type: T
}