export interface Delete {
  /**
   * DELETE - marks the query as a delete query
   *
   * @example
```js
sq.delete.from`person`
// delete * from person

sq.delete.from`person`.where`age < 7`.return`id`
// delete from person where age < 7 returning id

sq.from`person``age < 7``id`.delete
// delete from person where age < 7 returning id
```
   */
  readonly delete: this
}