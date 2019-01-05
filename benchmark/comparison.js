const Benchmark = require('benchmark')
const knex = require('knex')({ client: 'pg' })
const squel = require('squel').useFlavour('postgres')
const sq = require('../packages/sqorn-pg')()

new Benchmark.Suite()
  .add('Sqorn - args', function() {
    sq
      .from('books')
      .where({ author: 'Joe' })
      .return('title', 'author', 'year').query
  })
  .add('Sqorn - template string', function() {
    sq.from`books`.where`author = ${'Joe'}`.return`title, author, year`.query
  })
  .add('Sqorn - extend', function() {
    sq.extend(
      sq.from`books`,
      sq.where`author = ${'Joe'}`,
      sq.return`title, author, year`
    ).query
  })
  .add('Sqorn - raw', function() {
    sq.sql`select title, author, year from books where author = ${'Joe'}`.query
  })
  .add('Knex', function() {
    knex
      .from('books')
      .select('title', 'author', 'year')
      .where({ author: 'Joe' })
      .toSQL()
  })
  .add('Squel', function() {
    squel
      .select()
      .from('books')
      .where('author = ?', 'Jo')
      .fields(['title', 'author', 'year'])
      .toParam()
  })
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })
