const { sq, e, query } = require('../tape')

describe('tutorial', () => {
  describe('Manual Queries', () => {
    describe('SQL', () => {
      query({
        name: 'parameterized argument',
        query: sq.sql`select * from person where age >= ${20} and age < ${30}`,
        text: 'select * from person where age >= $1 and age < $2',
        args: [20, 30]
      })
      test('unparameterized', () => {
        expect(
          sq.sql`select * from person where age >= ${20} and age < ${30}`
            .unparameterized
        ).toBe('select * from person where age >= 20 and age < 30')
      })
      query({
        name: 'chained calls',
        query: sq.sql`select *`.sql`from person`
          .sql`where age >= ${20} and age < ${30}`,
        text: 'select * from person where age >= $1 and age < $2',
        args: [20, 30]
      })
      query({
        name: 'subquery argument',
        query: sq.sql`select * from person ${sq.txt`where age >= ${20} and age < ${30}`}`,
        text: 'select * from person where age >= $1 and age < $2',
        args: [20, 30]
      })
      query({
        name: 'function call',
        query: sq.sql`select * from person where age >=`.sql(20)
          .sql`and age <`.sql(30),
        text: 'select * from person where age >= $1 and age < $2',
        args: [20, 30]
      })
    })
    describe('Raw', () => {
      query({
        name: '.sql`${sq.raw(arg)}`',
        query: sq.sql`select * from ${sq.raw('test_table')}`,
        text: 'select * from test_table'
      })
      query({
        name: '.raw(arg)',
        query: sq.sql`select * from ${sq.raw('test_table')} where id = ${7}`,
        text: 'select * from test_table where id = $1',
        args: [7]
      })
    })
    describe('Extend', () => {
      query({
        name: '.extend',
        query: sq.extend(
          sq.sql`select *`,
          sq.sql`from person`,
          sq.sql`where age >= ${20} and age < ${30}`
        ),
        text: 'select * from person where age >= $1 and age < $2',
        args: [20, 30]
      })
    })
    describe('Link', () => {
      const books = [{ id: 1, title: '1984' }, { id: 2, title: 'Dracula' }]
      const value = book => sq.txt`(${book.id}, ${book.title})`
      const values = sq.extend(...books.map(value)).link`, `
      query({
        name: 'link',
        query: sq.sql`insert into book(id, title)`.sql`values ${values}`.link(
          '\n'
        ),
        text: 'insert into book(id, title)\nvalues ($1, $2), ($3, $4)',
        args: [1, '1984', 2, 'Dracula']
      })
    })
  })

  describe('Select Queries', () => {
    describe('From', () => {
      query({
        name: '.from``',
        query: sq.from`book`,
        text: 'select * from book'
      })
      query({
        name: '.from``.from``',
        query: sq.from`book`.from`person`,
        text: 'select * from book, person'
      })
      query({
        name: ".from('', '')",
        query: sq.from('book', 'author'),
        text: 'select * from book, author'
      })
      query({
        name: '.from(sq.txt``)',
        query: sq.from(sq.txt`unnest(array[1, 2, 3])`),
        text: 'select * from unnest(array[1, 2, 3])',
        args: []
      })
      query({
        name: '.from object - string table source',
        query: sq.from({ b: 'book', p: 'person' }),
        text: 'select * from book b, person p'
      })
      query({
        name: '.from object - array of row objects',
        query: sq.from({
          people: [{ age: 7, firstName: 'Jo' }, { age: 9, firstName: 'Mo' }]
        }),
        text:
          'select * from (values ($1, $2), ($3, $4)) people(age, first_name)',
        args: [7, 'Jo', 9, 'Mo']
      })
      query({
        name: '.from object - select subquery',
        query: sq.from({ b: sq.from`book` }),
        text: 'select * from (select * from book) b',
        args: []
      })
      query({
        name: '.from object - subquery table source',
        query: sq.from({ countDown: sq.txt`unnest(${[3, 2, 1]})` }),
        text: 'select * from unnest($1) count_down',
        args: [[3, 2, 1]]
      })
      query({
        name: '.from - mix objects and strings',
        query: sq.from({ b: 'book' }, 'person', sq.txt`author`),
        text: 'select * from book b, person, author',
        args: []
      })
      query({
        name: '.from`.join`',
        query: sq.from`book left join author on book.author_id = author.id`,
        text:
          'select * from book left join author on book.author_id = author.id'
      })
    })
    describe('Where', () => {
      query({
        name: '.where``',
        query: sq.from`book`.where`genre = ${'Fantasy'}`,
        text: 'select * from book where (genre = $1)',
        args: ['Fantasy']
      })
      query({
        name: '.where``.where``',
        query: sq.from`book`.where`genre = ${'Fantasy'}`.where`year = ${2000}`,
        text: 'select * from book where (genre = $1) and (year = $2)',
        args: ['Fantasy', 2000]
      })
      query({
        name: '.where(sq.txt``)',
        query: sq.from`book`.where(sq.txt`genre = ${'Fantasy'}`),
        text: 'select * from book where genre = $1',
        args: ['Fantasy']
      })
      query({
        name: '.where({})',
        query: sq.from`book`.where({ genre: 'Fantasy', year: 2000 }),
        text: 'select * from book where (genre = $1) and (year = $2)',
        args: ['Fantasy', 2000]
      })
      query({
        name: '.where({ camelCase })',
        query: sq.from`person`.where({ firstName: 'Kaladin' }),
        text: 'select * from person where (first_name = $1)',
        args: ['Kaladin']
      })
      query({
        name: '.where({ key: sq.raw() })',
        query: sq
          .from('book', 'author')
          .where({ 'book.id': sq.raw('author.id') }),
        text: 'select * from book, author where (book.id = author.id)',
        args: []
      })
      const condMinYear = sq.txt`(year >= ${20})`
      const condMaxYear = sq.txt`(year < ${30})`
      query({
        name: '.where(sq.txt, sq.txt)',
        query: sq.from`person`.where(condMinYear, condMaxYear),
        text: 'select * from person where (year >= $1) and (year < $2)',
        args: [20, 30]
      })
      query({
        name: '.where({}).where({})',
        query: sq.from`person`.where(
          { name: 'Rob' },
          sq.txt`(name = ${'Bob'})`
        ),
        text: 'select * from person where (name = $1) and (name = $2)',
        args: ['Rob', 'Bob']
      })
    })
    describe('Select', () => {
      query({
        name: '.return``',
        query: sq.return`${1} a, ${2} b, ${1} + ${2} sum`,
        text: 'select $1 a, $2 b, $3 + $4 sum',
        args: [1, 2, 1, 2]
      })
      query({
        name: '.return``.return``',
        query: sq.from`book`.return`title, author`.return`id`,
        text: 'select title, author, id from book',
        args: []
      })
      query({
        name: '.return(string)',
        query: sq.from`book`.return('title', 'author'),
        text: 'select title, author from book',
        args: []
      })
      query({
        name: '.return(sq.txt``)',
        query: sq.from`book`.return(sq.txt`title`, sq.txt`author`),
        text: 'select title, author from book',
        args: []
      })
      query({
        name: '.return object - string expression',
        query: sq.from`person`.return({
          firstName: 'person.first_name',
          age: 'person.age'
        }),
        text: 'select person.first_name first_name, person.age age from person'
      })
      query({
        name: '.return object - subquery expression',
        query: sq.return({
          sum: sq.txt`${2} + ${3}`,
          firstName: sq.txt('Bob')
        }),
        text: 'select $1 + $2 sum, $3 first_name',
        args: [2, 3, 'Bob']
      })
      query({
        name: '.distinct.return',
        query: sq.from`book`.distinct.return`genre`.return`author`,
        text: 'select distinct genre, author from book',
        args: []
      })
      query({
        name: '.distinct.distinct',
        query: sq.from`book`.distinct.distinct.return`genre`.return`author`,
        text: 'select distinct genre, author from book',
        args: []
      })
      query({
        name: '.distinctOn',
        query: sq.from`weather`.distinctOn`location`
          .return`location, time, report`,
        text:
          'select distinct on (location) location, time, report from weather',
        args: []
      })
      query({
        name: '.distinct.distinctOn',
        query: sq.from`weather`.distinctOn`location`.distinctOn`time`
          .return`location, time, report`,
        text:
          'select distinct on (location, time) location, time, report from weather',
        args: []
      })
      query({
        name: ".distinctOn('')",
        query: sq
          .from('weather')
          .distinctOn('location', 'time')
          .return('location', 'time', 'report'),
        text:
          'select distinct on (location, time) location, time, report from weather',
        args: []
      })
      query({
        name: ".distinctOn('', '').return",
        query: sq.from`generate_series(0, 10) n`.distinctOn(sq.txt`n / 3`)
          .return`n`,
        text: 'select distinct on (n / 3) n from generate_series(0, 10) n',
        args: []
      })
    })
    describe('Extend', () => {
      const FantasyBook = sq.from('book').where({ genre: 'fantasy' })
      const Title = sq.return('title')
      query({
        name: 'basic',
        query: sq.extend(FantasyBook, Title),
        text: 'select title from book where (genre = $1)',
        args: ['fantasy']
      })
      query({
        name: 'middle query chain',
        query: sq
          .from('book')
          .extend(sq.where({ genre: 'fantasy' }))
          .return('title'),
        text: 'select title from book where (genre = $1)',
        args: ['fantasy']
      })
      query({
        name: 'middle query chain',
        query: sq.from`author`.extend(
          sq.from`book`.where`book.author_id = author.id`.return`title`,
          sq.from`publisher`.where`publisher.id = book.publisher_id`
            .return`publisher`
        ).where`author.id = 7`.return`first_name`,
        text:
          'select title, publisher, first_name from author, book, publisher where (book.author_id = author.id) and (publisher.id = book.publisher_id) and (author.id = 7)',
        args: []
      })
    })
    describe('Group By', () => {
      query({
        name: 'tagged template',
        query: sq.from`person`.return`age, count(*)`.groupBy`age`,
        text: 'select age, count(*) from person group by age',
        args: []
      })
      query({
        name: 'multiple calls',
        query: sq.from`person`.return`age, last_name, count(*)`.groupBy`age`
          .groupBy`last_name`,
        text:
          'select age, last_name, count(*) from person group by age, last_name',
        args: []
      })
      query({
        name: 'expression args',
        query: sq
          .from('person')
          .return('count(*)')
          .groupBy('age', [sq.txt`last_name`, 'first_name']),
        text:
          'select count(*) from person group by age, (last_name, first_name)',
        args: []
      })
      query({
        name: 'rollup',
        query: sq.from`t`.groupBy(sq.rollup('a', ['b', sq.txt`c`]), 'd'),
        text: 'select * from t group by rollup (a, (b, c)), d',
        args: []
      })
      query({
        name: 'cube',
        query: sq.from`t`.groupBy(sq.cube('a', ['b', sq.txt`c`]), 'd'),
        text: 'select * from t group by cube (a, (b, c)), d',
        args: []
      })
      query({
        name: 'grouping sets',
        query: sq.from`t`.groupBy(
          sq.groupingSets(
            ['a', 'b', 'c'],
            sq.groupingSets(['a', 'b']),
            ['a'],
            []
          )
        ),
        text:
          'select * from t group by grouping sets ((a, b, c), grouping sets ((a, b)), (a), ())',
        args: []
      })
      query({
        name: 'expression args',
        query: sq.from`person`.groupBy('age', [
          sq.txt`last_name`,
          'first_name'
        ]),
        text: 'select * from person group by age, (last_name, first_name)',
        args: []
      })
    })
    describe('Having', () => {
      query({
        name: 'tagged template',
        query: sq.from`person`.groupBy`age`.having`age < ${20}`,
        text: 'select * from person group by age having (age < $1)',
        args: [20]
      })
      query({
        name: 'multiple calls',
        query: sq.from`person`.groupBy`age`.having`age >= ${20}`
          .having`age < ${30}`,
        text:
          'select * from person group by age having (age >= $1) and (age < $2)',
        args: [20, 30]
      })
      query({
        name: 'chain .on and .or',
        query: sq.from`person`.groupBy`age`
          .having({ age: 18 }, sq.txt`age < ${19}`)
          .having({ age: 20 }).having`count(*) > 10`,
        text:
          'select * from person group by age having (age = $1) and age < $2 and (age = $3) and (count(*) > 10)',
        args: [18, 19, 20]
      })
    })
    describe('Order By', () => {
      query({
        name: 'tagged template',
        query: sq.from`book`.orderBy`title asc nulls last`,
        text: 'select * from book order by title asc nulls last',
        args: []
      })
      query({
        name: 'multiple calls',
        query: sq.from`book`.orderBy`title`.orderBy`year`,
        text: 'select * from book order by title, year',
        args: []
      })
      query({
        name: 'expressions',
        query: sq.from`book`.orderBy('title', sq.txt`sales / ${1000}`),
        text: 'select * from book order by title, sales / $1',
        args: [1000]
      })
      query({
        name: 'object - by',
        query: sq.from`book`.orderBy(
          { by: 'title' },
          { by: sq.txt`sales / ${1000}` }
        ),
        text: 'select * from book order by title, sales / $1',
        args: [1000]
      })
      query({
        name: 'object - sort',
        query: sq.from`book`.orderBy({ by: 'title', sort: 'desc' }),
        text: 'select * from book order by title desc',
        args: []
      })
      query({
        name: 'object - using',
        query: sq.from`person`.orderBy({ by: 'first_name', using: '~<~' }),
        text: 'select * from person order by first_name using ~<~',
        args: []
      })
      query({
        name: 'object - nulls',
        query: sq.from`book`.orderBy({ by: 'title', nulls: 'last' }),
        text: 'select * from book order by title nulls last',
        args: []
      })
    })
    describe('Limit', () => {
      query({
        name: 'multiple limit',
        query: sq.from`person`.limit(7).limit(5),
        text: 'select * from person limit $1',
        args: [5]
      })
      query({
        name: 'limit number',
        query: sq.from`person`.limit(8),
        text: 'select * from person limit $1',
        args: [8]
      })
      query({
        name: 'limit template string',
        query: sq.from`person`.limit`8`,
        text: 'select * from person limit 8',
        args: []
      })
      query({
        name: 'limit manual subquery',
        query: sq.from`person`.limit(sq.txt`1 + 7`),
        text: 'select * from person limit 1 + 7',
        args: []
      })
      query({
        name: 'limit select subquery',
        query: sq.from`person`.limit(sq.return(10)),
        text: 'select * from person limit (select $1)',
        args: [10]
      })
    })
    describe('Offset', () => {
      query({
        name: 'multiple offset',
        query: sq.from`person`.offset(7).offset(5),
        text: 'select * from person offset $1',
        args: [5]
      })
      query({
        name: 'offset number',
        query: sq.from`person`.offset(8),
        text: 'select * from person offset $1',
        args: [8]
      })
      query({
        name: 'offset template string',
        query: sq.from`person`.offset`8`,
        text: 'select * from person offset 8',
        args: []
      })
      query({
        name: 'offset manual subquery',
        query: sq.from`person`.offset(sq.txt`1 + 7`),
        text: 'select * from person offset 1 + 7',
        args: []
      })
      query({
        name: 'offset select subquery',
        query: sq.from`person`.offset(sq.return(10)),
        text: 'select * from person offset (select $1)',
        args: [10]
      })
    })
    describe('Join', () => {
      query({
        name: 'natural join',
        query: sq.from`book`.naturalJoin`author`,
        text: 'select * from book natural join author',
        args: []
      })
      query({
        name: 'on',
        query: sq.from({ b: 'book' }).join({ a: 'author' })
          .on`b.author_id = a.id`,
        text: 'select * from book b join author a on (b.author_id = a.id)',
        args: []
      })
      query({
        name: 'multiple on',
        query: sq
          .from({ b: 'book' })
          .join({ a: 'author' })
          .on({ 'b.author_id': e`a.id` }, { 'b.genre': 'Fantasy' }),
        text:
          'select * from book b join author a on (b.author_id = a.id) and (b.genre = $1)',
        args: ['Fantasy']
      })
      query({
        name: 'using',
        query: sq.from`book`.join`author`.using`author_id`,
        text: 'select * from book join author using (author_id)',
        args: []
      })
      query({
        name: 'multiple using',
        query: sq.from`a`.join`b`.using('x', 'y').using`z`,
        text: 'select * from a join b using (x, y, z)',
        args: []
      })
      query({
        name: 'join type',
        query: sq.from`book`.naturalLeftJoin`author`
          .naturalRightJoin`publisher`,
        text:
          'select * from book natural left join author natural right join publisher',
        args: []
      })
      query({
        name: 'multiple join type',
        query: sq.from`book`.naturalRightJoin`author`.crossJoin`publisher`,
        text:
          'select * from book natural right join author cross join publisher',
        args: []
      })
    })
    describe('Sets', () => {
      const Person = sq.from`person`
      const Young = Person.where`age < 30`
      const Middle = Person.where`age >= 30 and age < 60`
      const Old = Person.where`age >= 60`
      query({
        name: '.except',
        query: Person.except(Young),
        text:
          'select * from person except (select * from person where (age < 30))',
        args: []
      })
      query({
        name: '.union, multiple args',
        query: Young.union(Middle, Old),
        text:
          'select * from person where (age < 30) union (select * from person where (age >= 30 and age < 60)) union (select * from person where (age >= 60))',
        args: []
      })
      query({
        name: 'union all',
        query: Young.unionAll(Old),
        text:
          'select * from person where (age < 30) union all (select * from person where (age >= 60))',
        args: []
      })
      query({
        name: 'chain set ops',
        query: Person.except(Young).intersect(Person.except(Old)),
        text:
          'select * from person except (select * from person where (age < 30)) intersect (select * from person except (select * from person where (age >= 60)))',
        args: []
      })
    })
    describe('With', () => {
      query({
        name: 'template string',
        query: sq.with`n (select ${20} age)`.from`n`.return`age`,
        text: 'with n (select $1 age) select age from n',
        args: [20]
      })
      query({
        name: 'multiple calls',
        query: sq.with`width (select ${10} n)`.with`height (select ${20} n)`
          .return`width.n * height.n area`,
        text:
          'with width (select $1 n), height (select $2 n) select width.n * height.n area',
        args: [10, 20]
      })
      query({
        name: 'subquery args',
        query: sq
          .with({
            width: sq.return({ n: 10 }),
            height: sq.sql`select ${20} n`
          })
          .return({
            area: sq.txt`width.n * height.n`
          }),
        text:
          'with width (select $1 n), height (select $2 n) select width.n * height.n area',
        args: [10, 20]
      })
      const people = [{ age: 7, name: 'Jo' }, { age: 9, name: 'Mo' }]
      query({
        name: 'object array arg',
        query: sq.with({ people }).return`max(age)`.from`people`,
        text:
          'with people(age, name) (values ($1, $2), ($3, $4)) select max(age) from people',
        args: [7, 'Jo', 9, 'Mo']
      })
      const one = sq.return`1`
      const next = sq.return`n + 1`.from`t`.where`n < 100`
      query({
        name: 'recursive cte',
        query: sq.withRecursive({ 't(n)': one.unionAll(next) }).from`t`
          .return`sum(n)`,
        text:
          'with recursive t(n) (select 1 union all (select n + 1 from t where (n < 100))) select sum(n) from t',
        args: []
      })
    })
  })
  describe('Delete Queries', () => {
    describe('Delete', () => {
      expect(sq.delete.from`person`.delete.query).toEqual(
        sq.from`person`.delete.query
      )
      query({
        name: '.delete',
        query: sq.delete.from`person`,
        text: 'delete from person'
      })
      query({
        name: '.delete.delete',
        query: sq.from`book`.delete.delete.delete,
        text: 'delete from book'
      })
    })
    describe('Where', () => {
      query({
        name: '.where.delete',
        query: sq.delete.from`person`.where`id = ${723}`,
        text: 'delete from person where (id = $1)',
        args: [723]
      })
    })
    describe('Returning', () => {
      query({
        name: '.return.delete',
        query: sq.delete.from`person`.return`name`,
        text: 'delete from person returning name'
      })
    })
    describe('Using', () => {
      query({
        name: 'delete using',
        query: sq.delete.from`book`.from`author`
          .where`book.author_id = author.id and author.contract = 'terminated'`,
        text:
          "delete from book using author where (book.author_id = author.id and author.contract = 'terminated')"
      })
    })
  })
  describe('Insert Queries', () => {
    describe('Insert', () => {
      query({
        name: '.insert``',
        query: sq.from`person(first_name, last_name)`
          .insert`values (${'Shallan'}, ${'Davar'})`,
        text: 'insert into person(first_name, last_name) values ($1, $2)',
        args: ['Shallan', 'Davar']
      })
      query({
        name: '.insert({ firstName, lastName })',
        query: sq
          .from('person')
          .insert({ firstName: 'Shallan', lastName: 'Davar' }),
        text: 'insert into person(first_name, last_name) values ($1, $2)',
        args: ['Shallan', 'Davar']
      })
      query({
        name: '.insert({ a: undefined, b: null })',
        query: sq.from('test').insert({ a: undefined, b: null }),
        text: 'insert into test(a, b) values (default, $1)',
        args: [null]
      })
      query({
        name: '.insert(...[])',
        query: sq
          .from('person')
          .insert(
            { firstName: 'Shallan', lastName: 'Davar' },
            { firstName: 'Navani', lastName: 'Kholin' }
          ),
        text:
          'insert into person(first_name, last_name) values ($1, $2), ($3, $4)',
        args: ['Shallan', 'Davar', 'Navani', 'Kholin']
      })
      query({
        name: '.insert([])',
        query: sq
          .from('person')
          .insert([
            { firstName: 'Shallan', lastName: 'Davar' },
            { firstName: 'Navani', lastName: 'Kholin' }
          ]),
        text:
          'insert into person(first_name, last_name) values ($1, $2), ($3, $4)',
        args: ['Shallan', 'Davar', 'Navani', 'Kholin']
      })
      query({
        name: '.insert({ sq.txt })',
        query: sq.from('person').insert({
          firstName: sq.return`${'Shallan'}`,
          lastName: sq.txt('Davar')
        }),
        text:
          'insert into person(first_name, last_name) values ((select $1), $2)',
        args: ['Shallan', 'Davar']
      })
      query({
        name: '.insert({}).insert({}).insert({})',
        query: sq
          .from('superhero(name)')
          .insert(sq.return`${'batman'}`.union(sq.return`${'superman'}`)),
        text: 'insert into superhero(name) (select $1 union (select $2))',
        args: ['batman', 'superman']
      })
      query({
        name: '.insert default values',
        query: sq.from`person`.insert(undefined),
        text: 'insert into person default values',
        args: []
      })
      query({
        name: '.insert multiple',
        query: sq.from`person`
          .insert({ firstName: 'Shallan', lastName: 'Davar' })
          .insert({ firstName: 'Navani', lastName: 'Kholin' }),
        text: 'insert into person(first_name, last_name) values ($1, $2)',
        args: ['Navani', 'Kholin']
      })
    })
    describe('Returning', () => {
      query({
        name: '.insert.return',
        query: sq.from`book`.insert({ title: 'Squirrels and Acorns' })
          .return`id`,
        text: 'insert into book(title) values ($1) returning id',
        args: ['Squirrels and Acorns']
      })
    })
  })
  describe('Update', () => {
    describe('Set', () => {
      query({
        name: '.set``',
        query: sq.from`person`.set`age = age + 1, processed = true`
          .set`name = ${'Sally'}`,
        text: 'update person set age = age + 1, processed = true, name = $1',
        args: ['Sally']
      })
      query({
        name: '.set({})',
        query: sq
          .from('person')
          .set({ firstName: 'Robert', nickname: 'Rob' }, { processed: true }),
        text:
          'update person set first_name = $1, nickname = $2, processed = $3',
        args: ['Robert', 'Rob', true]
      })
      query({
        name: '.set({})',
        query: sq.from('person').set({
          firstName: sq.txt`'Bob'`,
          lastName: sq.return`'Smith'`
        }),
        text:
          "update person set first_name = 'Bob', last_name = (select 'Smith')",
        args: []
      })
      query({
        name: '.set({}).set({})',
        query: sq.from`person`
          .set({ firstName: 'Robert' })
          .set({ nickname: 'Rob' }),
        text: 'update person set first_name = $1, nickname = $2',
        args: ['Robert', 'Rob']
      })
    })
    describe('Where', () => {
      query({
        name: '.set({})',
        query: sq.from`person`
          .where({ firstName: 'Matt' })
          .set({ firstName: 'Robert', nickname: 'Rob' }),
        text:
          'update person set first_name = $1, nickname = $2 where (first_name = $3)',
        args: ['Robert', 'Rob', 'Matt']
      })
    })
    describe('Returning', () => {
      query({
        name: '.return',
        query: sq.from`person`.where`age > 60 and old = false`.set`old = true`
          .return`id, age`,
        text:
          'update person set old = true where (age > 60 and old = false) returning id, age',
        args: []
      })
    })
    describe('From', () => {
      query({
        name: 'insert, from',
        query: sq.from`book`.from`author`.set({ available: false })
          .where`book.author_id = author.id and author.contract = 'terminated'`,
        text:
          "update book set available = $1 from author where (book.author_id = author.id and author.contract = 'terminated')",
        args: [false]
      })
    })
  })
})
