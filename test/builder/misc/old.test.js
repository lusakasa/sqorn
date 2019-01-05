const { sq, query } = require('../tape')

describe('sql query - tagged template', () => {
  query({
    name: 'sql    - .txt``',
    query: sq.sql`select * from person`,
    text: 'select * from person'
  })
  query({
    name: 'sql    - .txt``',
    query: sq.sql`select * from person where name = 'Bob' and age > 7`,
    text: `select * from person where name = 'Bob' and age > 7`
  })
})

describe('select query - tagged template', () => {
  query({
    name: 'select - .from``',
    query: sq.from`person`,
    text: 'select * from person'
  })
  query({
    name: 'select - .from``.return``',
    query: sq.from`person`.return`age`,
    text: 'select age from person'
  })
  query({
    name: 'select - .from``.where``',
    query: sq.from`person`.where`age > 7`,
    text: 'select * from person where (age > 7)'
  })
  query({
    name: 'select - .from``.where``.return``',
    query: sq.from`person`.where`age > 7`.return`age`,
    text: 'select age from person where (age > 7)'
  })
})

describe('delete query - tagged template', () => {
  query({
    name: 'delete - .from``',
    query: sq.delete.from`person`,
    text: 'delete from person'
  })
  query({
    name: 'delete - .from``.return``',
    query: sq.delete.from`person`.return`age`,
    text: 'delete from person returning age'
  })
  query({
    name: 'delete - .from``.where``',
    query: sq.delete.from`person`.where`age > 7`,
    text: 'delete from person where (age > 7)'
  })
  query({
    name: 'delete - .from``.where``.return',
    query: sq.delete.from`person`.where`age > 7`.return`age`,
    text: 'delete from person where (age > 7) returning age'
  })
})

describe('update query - tagged template', () => {
  query({
    name: 'update - .from``.set``',
    query: sq.from`person`.set`age = age + 1`,
    text: 'update person set age = age + 1'
  })
  query({
    name: 'update - .from`.where``.set``',
    query: sq.from`person`.where`age < 18`.set`age = age + 1`,
    text: 'update person set age = age + 1 where (age < 18)'
  })
  query({
    name: 'update - .from``.set``.where``',
    query: sq.from`person`.set`age = age + 1`.where`age < 18`,
    text: 'update person set age = age + 1 where (age < 18)'
  })
  query({
    name: 'update - .from``.set``.return``',
    query: sq.from`person`.set`age = age + 1`.return`age`,
    text: 'update person set age = age + 1 returning age'
  })
  query({
    name: 'update - .from``.where``.set``.return``',
    query: sq.from`person`.where`age < 18`.set`age = age + 1`.return`age`,
    text: 'update person set age = age + 1 where (age < 18) returning age'
  })
})

describe('select query - tagged template args', () => {
  query({
    name: 'select - .from``.where`${int}`',
    query: sq.from`person`.where`age > ${7}`,
    text: 'select * from person where (age > $1)',
    args: [7]
  })
  query({
    name: 'select - .from``.where`${int}${int}`',
    query: sq.from`person`.where`age >= ${20} and age <= ${29}`,
    text: 'select * from person where (age >= $1 and age <= $2)',
    args: [20, 29]
  })
  query({
    name: 'select - .from``.where`${string}`',
    query: sq.from`person`.where`name = ${'bob'}`,
    text: 'select * from person where (name = $1)',
    args: ['bob']
  })
  query({
    name: 'select - .from``.where`${object}`',
    query: sq.from`person`.where`name = ${'bob'}`,
    text: 'select * from person where (name = $1)',
    args: ['bob']
  })
})

describe('sql query - tagged template args', () => {
  query({
    name: 'select - .sql`${int}`',
    query: sq.sql`select * from person where age > ${7}`,
    text: 'select * from person where age > $1',
    args: [7]
  })
  query({
    name: 'select - .sql`${int}${string}`',
    query: sq.sql`select * from person where age > ${7} or name = ${'Bob'}`,
    text: `select * from person where age > $1 or name = $2`,
    args: [7, 'Bob']
  })
})

describe('query - tagged template sql arg', () => {
  query({
    name: 'template tag arg',
    query: sq.from`${sq.from`person`.where`age > 7`}`.return`name`,
    text: 'select name from (select * from person where (age > 7))',
    args: []
  })
})

describe('query - tagged template $raw arg', () => {
  query({
    name: 'select - .from`${sq.raw(string)}`',
    query: sq.from`${sq.raw('person')}`,
    text: 'select * from person',
    args: []
  })
})
