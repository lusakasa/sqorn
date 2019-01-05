---
id: configuration
title: Configuration
sidebar_label: Configuration
---

[`mapInputKeys`](#map-input-keys) [`mapOutputKeys`](#map-output-keys)

### Map Input Keys

By default, Sqorn converts input object keys to *snake_case*.

```js
sq.return({ firstName: 'b.fname', lastName: 'b.lname' })
  .from({ b: 'books' })
  .where({ publishYear: 2010 })
  .query

{ text: 'select b.fname first_name, b.lname last_name from books b where publish_year = $1',
  args: [2018] }
```

Customize how input object keys are mapped by setting `mapInputKeys` to a function that takes a key and returns its mapping.

```js
const sq = sqorn({ mapInputKeys: key => key.toUpperCase() })

sq.return({ favoriteNumber: 8 }).query

{ text: 'select $1 FAVORITENUMBER',
  args: [8] }
```

String arguments, template string arguments and object values are not converted. Keys containing parentheses are returned unmodified.

```js
sq.with({ 'aB(cD, e_f)': sq.sql`select 1, 2`})
  .from('gH')
  .from`jK`
  .return({ lM: 'nO' }, 'pQ')
  .query

{ text: 'with aB(cD, e_f) (select 1, 2) select nO l_m, pQ from gH, jK',
  args: [] }
```

Mappings are computed once per key then cached.

### Map Output Keys

By default, Sqorn converts output object keys to *camelCase*.

```js
const [first] = await sq.from`person`.return`id, first_name, last_name`.limit`1`
const { id, firstName, lastName } = first
```

Customize how output object keys are mapped by setting `mapOutputKeys` to a function that takes a key and returns its mapping.

```js
const sq = sqorn({ mapOutputKeys: key => key.toUpperCase() })

const [first] = await sq.from`person`.return`id, first_name, last_name`.limit`1`
const { ID, FIRST_NAME, LAST_NAME } = first
```

Mappings are computed once per key then cached.
