const { sq, e, query } = require('../tape')

describe('delete', () => {
  query({
    name: 'delete 1',
    query: sq.delete.from`person`,
    text: 'delete from person',
    args: []
  })
  query({
    name: 'delete 2',
    query: sq.from`person`.delete,
    text: 'delete from person',
    args: []
  })
  query({
    name: 'idempotent',
    query: sq.from`book`.delete.delete.delete,
    text: 'delete from book',
    args: []
  })
})

describe('other', () => {
  query({
    name: 'using',
    query: sq.delete.from`book`.from`author`
      .where`book.author_id = author.id and author.contract = 'terminated'`,
    text:
      "delete from book using author where (book.author_id = author.id and author.contract = 'terminated')",
    args: []
  })
  query({
    name: 'where',
    query: sq.delete.from`person`.where`id = ${723}`,
    text: 'delete from person where (id = $1)',
    args: [723]
  })
  query({
    name: 'returning',
    query: sq.delete.from`person`.return`name`,
    text: 'delete from person returning name',
    args: []
  })
})
