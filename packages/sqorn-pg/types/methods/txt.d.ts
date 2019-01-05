import { Arg } from '../args'

export interface Txt {
  /**
   * Builds Text Fragment
   *
   * @example
```js
sq.from(sq.txt`unnest(array[1, 2, 3])`)
// select * from unnest(array[1, 2, 3])
```
   */
  txt(strings: TemplateStringsArray, ...args: Arg[]): this

  /**
   * Parameterizes Fragment arguments
   *
   * @example
```js
sq.from(sq.txt`(values`.txt(1, 2).txt`) v`)
// select * from (values (1, 2) ) v
```
   */
  txt(...args: Arg[]): this
}