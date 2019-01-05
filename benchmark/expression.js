const Benchmark = require('benchmark')
const sq = require('../packages/sqorn-pg')()

const { e } = sq

new Benchmark.Suite()
  .add('e(1)', function() {
    return e(1).query
  })
  .add('e.eq`moo`(1)', function() {
    return e.eq`moo`(1).query
  })
  .add('e`moo`.eq(1)', function() {
    return e`moo`.eq(1).query
  })
  .add('e.eq(e`moo`, 1)', function() {
    return e.eq(e`moo`, 1).query
  })
  .add('big', function() {
    return e.and(e.or(e.lt(3, 4), e.gt(5, 6)), e.neq(7, 8)).query
  })
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })
