import { Arg, InputValue, Subquery } from '../args'

export interface Insert {

  /**
   * Specifies the data to insert as objects.
   * 
   * Field names are inferred from object keys.
   * 
   * @example
```js
sq.from('person').insert({ name: 'Jo' })
// insert into person(name) values ('Jo')

sq.from('person').insert({ firstName: 'Jo', age: 17 })
// insert into person(first_name, age) values ('Jo', 17)

sq.from('person')
  .insert({ name: 'Jo', age: 17 }, { name: 'Mo', age: 18 })
// insert into person(name, age) values ('Jo', 17), ('Mo', 18)

sq.from('person')
  .insert({ name: 'Jo', age: 17 }, { id: 23, age: 18 })
// insert into person(name, age, id) values ('Jo', 17, default), (default, 18, 23)

sq.from('person').insert({
  firstName: sq.return`${'Shallan'}`,
  lastName: sq.txt('Davar')
})
// insert into person(first_name, last_name) values ((select 'Shallan'), 'Davar')
```
   */
  insert(...values: InputValue[]): this

  /**
   * Specifies the data to insert as an array of objects.
   * 
   * Field names are inferred from object keys..
   * 
   * @example
```js
sq.from('person')
  .insert([{ name: 'Jo', age: 17 }, { name: 'Mo', age: 18 }])
// insert into person(name, age) values ('Jo', 17), ('Mo', 18)

sq.from('person')
  .insert([{ name: 'Jo', age: 17 }, { id: 23, age: 18 }])
// insert into person(name, age, id) values ('Jo', 17, default), (default, 18, 23)

sq.from('person').insert([{
  firstName: sq.return`${'Shallan'}`,
  lastName: sq.txt('Davar')
}])
// insert into person(first_name, last_name) values ((select 'Shallan'), 'Davar')
```
   */  
  insert(values: InputValue[]): this

  /**
   * Specifies the data to insert from a query.
   * 
   * @example
```js
sq.from('person(name, age)').insert(sq.return(sq.txt('Jo'), 23))
// insert into person(name, age) select 'Jo', 23

sq.from('person(name)').insert(sq.txt`values (${'Jo'})`)
// insert into person(name) values ('Jo')
```
   */
  insert(subquery: Subquery): this

  /**
   * Inserts default values.
   * 
   * @example
```js
sq.from('person').insert()
// insert into person default values
```
   */
  insert(undefined: undefined): this

  /**
   * Specifies the data to insert.
   *
   * @example
```js
sq.from`person(name, age)`.insert`values (${'bo'}, ${22})`
// insert into person(name, age) values ('bo', 22)

sq.from`person(name)`.insert`values ('Jo')`.insert`values ('Mo')`
// insert into person(name, age) values ('Mo')
```
   */
  insert(strings: TemplateStringsArray, ...args: Arg[]): this
}