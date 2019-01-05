import { Arg, InputValue } from '../args'

export interface Set {
  /**
   * Sets fields to the given values
   * 
   * @example
```js
sq.from('person')
  .set({ age: sq.txt`age + 1`, done: true })
  .where({ age: 7 })
  .return('person.name')
// update person
// set age = age + 1, done = true
// where age = 7
// returning person.name

sq.from('person').set(
  { firstName: 'Robert', nickname: 'Rob' },
  { processed: true }
)
// update person
// set first_name = 'Robert', nickname = 'Rob', processed = true

sq.from('person')
  .set({ firstName: sq.txt`'Bob'` })
  .set({ lastName: sq.return`'Smith'` })
// update person
// set first_name = 'Bob', last_name = (select 'Smith')
```
   */
  set(...values: InputValue[]): this

  /**
   * Sets fields to the given values
   * 
   * @example
```js
sq.from`person`
  .set`age = age + 1, processed = true`
// update person
// set age = age + 1, processed = true

sq.from`person`
  .set`age = age + 1, processed = true`
  .set`name = ${'Sally'}`
// update person
// set age = age + 1, processed = true, name = 'Sally'
```
   */
  set(strings: TemplateStringsArray, ...args: Arg[]): this
}