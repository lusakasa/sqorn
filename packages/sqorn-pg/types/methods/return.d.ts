import { Arg, AliasableSelectItem } from '../args'

export interface Return {
  /**
   * Selects the expressions to return.
   *
   * @example
```js
sq.return('user.name', 'user.id', '33', sq.txt('33'), 27, true)
// select user.name, user.id, 33, $1, $2, $3

sq.from('person').set`age = age + 1`.return('id', 'age')
// update person set age = age + 1 returning id, age

sq.delete.from('person').return('id', 'age')
// delete from person returning id, age

sq.from('person').insert({ age: 12 }).return('id', 'age')
// insert into person (age) values (12) returning id, age

const userInput = '; drop table user;'
sq.from('book').return(sq.txt(userInput), 23).return(true)
// select $1, $2, $3 from book

sq.return({
  now: sq.txt`now()`,
  tomorrow: sq.return`now() + '1 day'`
})
// select now() as today, (select now() + '1 day') as tomorrow
```
   */
  return(...expressions: AliasableSelectItem[]): this

  /**
   * Selects the expressions to return.
   *
   * @example
```js
sq.from`book.`return`title`
// select title from book

sq.from`person`.set`age = age + 1`.return`id, age`
// update person set age = age + 1 returning id, age

sq.delete.from`person`.return`id, age`
// delete from person returning id, age

sq.from`person`.insert({ age: 12 }).return`id, age`
// insert into person (age) values ($1) returning id, age

sq.return`${7}, ${8}, ${9}`.return`${10}`
// select $1, $2, $3, $4
```
   */
  return(strings: TemplateStringsArray, ...args: Arg[]): this
}