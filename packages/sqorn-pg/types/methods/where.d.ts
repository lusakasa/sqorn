import { Arg, Condition } from '../args'

export interface Where {
  /**
   * Builds a *where* clause.
   *
   * @example
```js
sq.from('person').where({ id: 7 })
// select * form person where (id = $1)

sq.from('person').where(sq.txt`age >= ${18}`).set({ adult: true })
// update person set adult = $1 where (age >= ${2})

sq.delete.from('person').where({ age: 20, id: 5 }, { age: 30 })
// delete from person where (age = $1 and id = $1 or age = $2)

sq.from('person').where(sq.txt`name = ${'Jo'}`, { age: 17 })
// select * from person where (name = $1 or age = $2)

sq.from('person').where({ minAge: sq.txt`age < ${17}` })
// select * from person where (age = $1)

sq.from('person').where({ age: 7, gender: 'male' })
// select * from person where (age = $1 and gender = $2)

sq.from('person').where({ age: 7 }).where({ name: 'Joe' })
// select * from person where (age = $1) and name = $2
```
   */
  where(...conditions: Condition[]): this

  /**
   * **WHERE clause** - template string
   *
   * Filters result set.
   * 
   * Multiple calls to `.where` are joined with _" and "_.
   *
   * @example
```js
 sq.from`person`.where`age < ${18}`
 // select * from person where (age < $1)
 
 sq.from`person`.where`age < ${7}`.set`group = ${'infant'}`
 // update person set group = $1 where (age < $2)
 
 sq.delete.from`person`.where`age < ${7}`
 // delete from person where (age < $1)
 
 sq.from`person`.where`age > ${3}`.where`age < ${7}`
 // select * from person where (age > $1) and (age < $2)
 ```
   */
  where(strings: TemplateStringsArray, ...args: Arg[]): this
}