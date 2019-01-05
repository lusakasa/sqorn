
import sqorn = require('..')

const { sq, e, db } = sqorn()

sq.from('book').join('book').on({ a: 3 })
sq.where({ a: e`true` })

const x = sq.raw('')
const a = sq.txt(x)

const a0 = e.add(sq.raw(''), 3).add(5).sub(6).eqAny([])

const a01 = e.between(2, 3, 4).lt(true)
const a02 = e.lt(3, 4).between(true)(false)
const a03 = e.between(null)(null)(null)

e(3).eqAny([4, 5, true])

const a1 = e.and(true)
const a2 = a1(true)
const b1 = e.or(true, false)
const b2 = e.or(true, null)
const b3 = e.not(true)

const c1 = e(true).and(e.not(true).or(false))
const c2 = e(true).and(false).eq(true)
const c3 = e.add

const d1 = e.add(null)(3)
const d2 = e.eq(1, 8)
const d3 = e.eq(e.not(true), e.and(true, false))
const d4 = e.eq(true, e.not(true))

const e1 = e.eq(null, null)
const e2 = e.eq(null, 2)
const e3 = e.eq(2, null)
const e4 = e.eq(1)

const f1 = e.sub(e.add(3, 4), 23).add(23).div(null)
const f2 = e.add(2, 3, 4).subtract(4, 5, 6)

const g1 = e.and(true, false)(true)(false)(e.eq(2,3), null)

const h1 = e.lt(3, 4).and(true).gt(false)
const h2 = e(true).gt(false).and(true)
const h3 = e(1).gt(3)

const i1 = e.neq(null, 2)

const j1 = e.between(3, 4, 5)
const j2 = j1.notBetween(true, false).between(true)(false).gte(false)
const j3 = e.between`b`(2, true)
const j4 = e.between(2)`b`(false);

const k1 = e.eq(98)`n`
const k2 = e.eq`n`(98)

declare let subquery: TableExpression
const l1 = e.exists(subquery)
const l2 = e(subquery).exists
const l3 = e(null)
const l4 = e(null).notExists

const m1 = e(3).in(subquery)
const m2 = e.notIn(null, subquery)
const m3 = e.any(3, subquery).some(subquery)
const m4 = e.all(2, subquery).all(23)

const n1 = e.in(3, [1, e.add(3, 4), null, 34])
const n2 = e(true).in([null, true, false, e.eq(1, 2)])
const n3 = e(null).in([1, 2, 3, null, false]).in([]).notIn([true])
const n4 = e.notIn(3, [1, 2, 3])
const n5 = e(true).notIn([false, e(true), null])

const o1 = e(subquery).eq(subquery).eq(true)
const o2 = e.any(1, [1, 2, 3]).any([true, false, true])
const o3 = e.all(3, [3, 3, 3])
const o4 = e(3).all([3, 3, 3])
const o5 = e(null).number.all([3, 3, 3])
const o6 = e(e)

const p1 = e.unnest([])
const p2 = e([1, 2, 3]).unnest

const q1 = e.array([])
const q2 = e.array(e([]))
const q3 = e.number(2)
const q4 = e.unknown(23)
const q5 = e.json({})
const q6 = e.boolean(true)
const q7 = e(null).boolean
const q8 = e(e.unknown(23412341234)).boolean

const r1 = e.like('asd', 'asdf')
const r2 = e.like('asd')('asdf')
const r3 = e('asd').like('asd')
const r4 = e.notLike('asd', 'asdf')
const r5 = e.notLike('asd')('asdf')
const r6 = e('asd').notLike('asd')
const r7 = e.like`asdf`('asd')
const r8 = e.like('a')`asdf`

const s1 = e([])
const s2 = e.arrayGet([], 23)
const s3 = e.arrayGet([])(23)
const s4 = e([]).arrayGet`(23)`
const s5 = e([])
const s6 = e.arrayAppend([], 23)
const s7 = e.arrayAppend([])(23)
const s8 = e([]).arrayAppend(23)
const s9 = e([]).arrayCat([])

const t = e.and(e(true).gt(true), e.in('a')([]))

const u = e.exp(2, 3)
const u2 = e.exp(2)(3)
const u3 = e.sqrt(4)
const u4 = e.cbrt(4)


const t1 = e(null).isNull
const t2 = e.isNull(null)
const t3 = e.isUnknown(true)
const t4 = e.isUnknown(null)
// const t5 = e.isNotUnknown(23)
const t5 = e.isFalse(23)

const u1 = e([]).unnest