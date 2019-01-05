import { AnyBuilder, ManualBuilder, FragmentBuilder } from '../builders'

interface Extend {
  /**
   * Returns a new query equivalent to the combination of the current
   * query and the argument queries
   * 
   * @example
```js
sq.extend(
  sq.from('book')
    .where({ id: 8 }),
  sq.return('title')
)
// select title from book where (id = 8)

sq.from('book')
  .extend(sq.where({ genre: 'Fantasy'}))
  .return('id')
// select id from book where genre = $1

sql`select id`.extend(
  sql`from book`,
  sql`where genre = ${'Fantasy'}`
)
// select id from book where genre = $1
```
   * 
   */
  extend(...builders: this[]): this;
  extend(builders: this[]): this;
}
