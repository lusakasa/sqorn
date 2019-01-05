const { sq, query } = require('../tape')

describe('extend', () => {
  describe('sql', () => {
    query({
      name: 'simmple',
      query: sq.extend(sq.txt`moo`),
      text: 'moo',
      args: []
    })
    query({
      name: '2 calls',
      query: sq.extend(sq.txt`moo`, sq.txt`shoo`),
      text: 'moo shoo',
      args: []
    })
    query({
      name: '2 calls, args',
      query: sq.extend(sq.txt('moo'), sq.txt('shoo')),
      text: '$1 $2',
      args: ['moo', 'shoo']
    })
    query({
      name: 'multiple calls',
      query: sq.txt`a`.extend(sq.txt`b`, sq.txt`c`, sq.txt`d`).txt`e`,
      text: 'a b c d e',
      args: []
    })
    query({
      name: 'simple array',
      query: sq.extend([sq.txt`moo`]),
      text: 'moo',
      args: []
    })
    query({
      name: 'complex array',
      query: sq.txt`a`.extend([sq.txt`b`, sq.txt`c`, sq.txt`d`]).txt`e`,
      text: 'a b c d e',
      args: []
    })
  })
  describe('basic', () => {
    query({
      name: 'frm',
      query: sq.extend(sq.from`book`),
      text: 'select * from book'
    })
    query({
      name: 'frm - 2 calls',
      query: sq.extend(sq.from`book`, sq.from`author`),
      text: 'select * from book, author'
    })
    query({
      name: '2 calls',
      query: sq.extend(sq.from`book`, sq.where`year > 2000`, sq.return`title`),
      text: 'select title from book where (year > 2000)'
    })
    query({
      name: '3 calls',
      query: sq.extend(
        sq.from`book`,
        sq.where`year > 2000`,
        sq.where`genre = 'fantasy'`,
        sq.return`title`
      ),
      text: `select title from book where (year > 2000) and (genre = 'fantasy')`
    })
    query({
      name: 'chained call',
      query: sq.extend(sq.from`book`.where`year > 2000`, sq.return`title`),
      text: 'select title from book where (year > 2000)'
    })
    query({
      name: 'chained .extend',
      query: sq.extend(sq.from`book`.where`year > 2000`).return`title`,
      text: 'select title from book where (year > 2000)'
    })
    query({
      name: 'args',
      query: sq.extend(
        sq.from`book`,
        sq.where`year > ${2000}`,
        sq.where`genre = ${'fantasy'} or genre = ${'history'}`,
        sq.return`title`
      ),
      text:
        'select title from book where (year > $1) and (genre = $2 or genre = $3)',
      args: [2000, 'fantasy', 'history']
    })
    query({
      name: 'chained args',
      query: sq.extend(
        sq.from`book`.where`year > ${2000}`,
        sq.where`genre = ${'fantasy'} or genre = ${'history'}`,
        sq.return`title`
      ),
      text:
        'select title from book where (year > $1) and (genre = $2 or genre = $3)',
      args: [2000, 'fantasy', 'history']
    })
    query({
      name: 'chained args',
      query: sq.extend(sq.from`book`.where`year > ${2000}`, sq.return`title`)
        .where`genre = ${'fantasy'} or genre = ${'history'}`,
      text:
        'select title from book where (year > $1) and (genre = $2 or genre = $3)',
      args: [2000, 'fantasy', 'history']
    })
  })
})
