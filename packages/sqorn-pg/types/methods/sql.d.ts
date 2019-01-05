import { Arg } from '../args'

export interface Sql {
  /**
   * Builds Manual Query
   * 
   * @example
```js
sq.sql`select * from book`
// select * from book

sq.sql`select * from person`.sql`where age = ${8}`.sql`or name = ${'Jo'}`
// select * from person where age = $1 or name = $2

sq.sql`select * ${sq.raw('person')}`
// select * from person

sq.from`person`.where({ min: sq.txt`age < 7` })
// select * from person where age < 7

sq.return`now() today, (${sq.return`now() + '1 day'`}) tomorrow`
// select now() today, (select now() + '1 day') tomorrow
```
   */
  sql(strings: TemplateStringsArray, ...args: Arg[]): this

  /**
   * Parameterizes Query arguments
   *
   * @example
```js
sq.sql`select * from person where age >=`.sql(20).sql`and age < `.sql(30)
// select * from person where age >= $1 and age < $2

sq.return({ safe: sq.txt('Jo'), dangerous: 'Mo' })
// select $1 as safe, Mo as dangerous
```
   */
  sql(...args: Arg[]): this
}