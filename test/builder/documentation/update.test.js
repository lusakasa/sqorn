const { sq, e, query } = require('../tape')

describe('set', () => {
  query({
    name: 'templat tag',
    query: sq.from`person`.set`age = age + 1, name = ${'Sally'}`,
    text: 'update person set age = age + 1, name = $1',
    args: ['Sally']
  })
  query({
    name: 'multiple calls',
    query: sq.from`person`.set`age = age + 1`.set`name = ${'Sally'}`,
    text: 'update person set age = age + 1, name = $1',
    args: ['Sally']
  })
  query({
    name: 'objects',
    query: sq
      .from('person')
      .set({ firstName: 'Robert', nickname: 'Rob' }, { processed: true }),
    text: 'update person set first_name = $1, nickname = $2, processed = $3',
    args: ['Robert', 'Rob', true]
  })
  query({
    name: 'expression',
    query: sq.from('person').set({ age: e.add(3, 4) }),
    text: 'update person set age = ($1 + $2)',
    args: [3, 4]
  })
  query({
    name: 'fragment',
    query: sq.from('person').set({ age: sq.txt`3 + 4` }),
    text: 'update person set age = 3 + 4',
    args: []
  })
  query({
    name: 'subquery',
    query: sq.from('person').set({
      firstName: sq.sql`select 'Bob'`,
      lastName: sq.return`'Smith'`
    }),
    text:
      "update person set first_name = (select 'Bob'), last_name = (select 'Smith')",
    args: []
  })
  query({
    name: 'undefined',
    query: sq.from('person').set({ firstName: undefined }),
    text: 'update person set first_name = default',
    args: []
  })
})

describe('other', () => {
  query({
    name: 'from',
    query: sq.from`book`.from`author`.set({ available: false })
      .where`book.author_id = author.id and author.contract = 'terminated'`,
    text:
      "update book set available = $1 from author where (book.author_id = author.id and author.contract = 'terminated')",
    args: [false]
  })
  query({
    name: 'returning',
    query: sq.from`person`.where`age > 60 and old = false`.set`old = true`
      .return`id, age`,
    text:
      'update person set old = true where (age > 60 and old = false) returning id, age',
    args: []
  })
})
