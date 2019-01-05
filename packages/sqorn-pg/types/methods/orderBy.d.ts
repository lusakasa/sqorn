import { Arg, SelectItem } from '../args'

interface OrderObject {
  by: SelectItem,
  sort?: 'asc' | 'desc',
  using?: string
  nulls?: 'first' | 'last'
}

type OrderItem = SelectItem | OrderObject

export interface OrderBy {
  /**
   * Builds an *order by* clause.
   * 
   * @example
```js
sq.from('book').orderBy('title desc', sq.txt`sales / ${1000}`)
// select * from book order by title desc, sales / 1000

sq.from('book').orderBy(
  { by: 'title', sort: 'desc' },
  { by: sq.txt`sales / ${1000}` }
)
// select * from book order by title desc, sales / 1000

sq.from('book').orderBy({ by: 'title', using: '~<~', nulls: 'last' })
// select * from book order by title using ~<~ nulls last
```
   */
  orderBy(...items: OrderItem[]): this

  /**
   * Builds an *order by* clause.
   * 
   * @example
```js
sq.from`book`.orderBy`title desc, sales / ${1000}`
// select * from book order by title desc, sales / 1000

sq.from`book`.orderBy`title`.orderBy`sales / 1000`
// select * from book order by title desc, sales / 1000

sq.from`book`.orderBy`title using ~<~' nulls last`
// select * from book order by title using ~<~ nulls last
```
   */
  orderBy(strings: TemplateStringsArray, ...args: Arg[]): this
}