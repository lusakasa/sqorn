import { RawBuilder } from '../builders'

export interface Raw {
  /**
    * Creates a string that is not parameterized when embedded.
    *
    * @example
 ```js
 sql`select * from ${raw('test_table')} where id = ${7}`.query
 
 { text: 'select * from test_table where id = $1'
   args: [7] }
 ```
    */
  raw(string: string): RawBuilder;
}
