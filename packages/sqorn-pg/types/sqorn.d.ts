import { Database } from './database'
import { AnyBuilder, ManualBuilder, FragmentBuilder, RawBuilder } from './builders'
import { Raw } from './methods/raw'
import { CreateExpression } from './expressions'

/**
* Creates and returns a query builder with the given configuration
* 
* @example
```js
const pg = require('pg')
const sqorn = require('@sqorn/pg')
const pool = new pg.Pool()
const sq = sqorn({ pg, pool })
```
*/
export declare function sqorn(config?: Configuration): Sqorn

interface Configuration {
  /**
   * pg module - See [Node Postgres](https://node-postgres.com).
   * This argument is required to execute queries,
   * but can be skipped if you only want to build queries.
   * 
   * @example
```js
const pg = require('pg')
const sqorn = require('@sqorn/pg')
const pool = new pg.Pool()
const sq = sqorn({ pg, pool })
```
   */
  pg?: any
  /**
   * pg.Pool instance - See [Node Posgres](https://node-postgres.com/features/connecting).
   * This argument is required to execute queries,
   * but can be skipped if you only want to build queries.
   * If provided, you MUST also provide argument `pg`.
   * 
   * @example
```js
const pg = require('pg')
const sqorn = require('@sqorn/pg')
const pool = new pg.Pool()
const sq = sqorn({ pg, pool })
```
   */
  pool?: any
  /**
   * Specifies how input object keys should be transformed.
   * 
   * If unspecified, the default mapping function converts keys to `snake_case`.
   * 
   * @example
```js
const sq = sqorn({ mapInputKeys: key => key.toUpperCase() })

sq.from({ p: 'person' }).return({ name: 'first_name' }).query.text
// 'select first_name as NAME from person as P'
```
   * */
  mapInputKeys?: (key: string) => string
  /**
   * Specifies how output object keys should be transformed.
   * 
   * If unspecified, the default mapping function converts keys to `camelCase`.
   * 
   * This function does NOT modify the generated query. It transforms result object keys.
   * 
   * @example
```js
const sq = sqorn({ mapOutputKeys: key => key.toUpperCase() })
const names = sq.from('person').return('first_name')

names.query.text
// 'select first_name from person'

await names.all()
// [{ FIRST_NAME: 'Jo'}, { FIRST_NAME: 'Mo' }]
```
   * */
  mapOutputKeys?: (key: string) => string
}

interface Sqorn {
   db: Database
   sq: AnyBuilder
   sql: ManualBuilder['sql']
   txt: FragmentBuilder['txt']
   raw: Raw['raw']
   e: CreateExpression
}