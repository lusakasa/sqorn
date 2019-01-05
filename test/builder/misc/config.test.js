const pg = require('pg')
const { query, sqorn } = require('../tape')

const db_name = 'sqorn_config_test'
const adminConnection = {
  connectionString: 'postgresql://postgres@localhost:5432/postgres'
}
const appConnection = {
  connectionString: `postgresql://postgres@localhost:5432/${db_name}`
}

const createTestDatabase = async () => {
  // create test database
  let sq = sqorn({ pg, pool: new pg.Pool(adminConnection) })
  await sq.sql`drop database if exists ${sq.raw(db_name)}`
  await sq.sql`create database ${sq.raw(db_name)}`
  await sq.end()
  // populate test database
  sq = sqorn({ pg, pool: new pg.Pool(appConnection) })
  await sq.sql`create table person (
    id              serial primary key,
    first_name      text,
    last_name       text
  )`
  await sq.from`person`.insert(
    { firstName: 'Jo', lastName: 'Schmo' },
    { firstName: 'Bo', lastName: 'Mo' }
  )
  await sq.end()
}

describe('Config', async () => {
  beforeAll(createTestDatabase)
  test('true', async () => {
    const sq = sqorn({
      pg,
      pool: new pg.Pool(appConnection)
    })
    try {
      expect(
        await sq.from`person`.where({ firstName: 'Jo' }).return`last_name`.one()
      ).toEqual({ lastName: 'Schmo' })
    } finally {
      await sq.end()
    }
  })
  test('false', async () => {
    const sq = sqorn({
      pg,
      pool: new pg.Pool(appConnection)
    })
    try {
      const query = sq.from`person`({ firstName: 'Jo' })`last_name`
      expect(query.then).toBe(undefined)
      expect(await query).toBe(query)
    } finally {
      await sq.end()
    }
  })

  describe('mapInputKeys', () => {
    test('default snake_case 1', async () => {
      const sq = sqorn({ pg, pool: new pg.Pool(appConnection) })
      try {
        expect(
          sq
            .with({ aB: sq.sql`select cD`, e_f: sq.sql`select g_h` })
            .from({ iJ3: 'kL', mN: [{ oP: 1, q_r: 1 }] })
            .where({ sT: 1, u_v: 1 })
            .return({ wX: 1, y_z: 1 })
            .link('\n').query.text
        ).toEqual(`with a_b (select cD), e_f (select g_h)
select $1 w_x, $2 y_z
from kL i_j3, (values ($3, $4)) m_n(o_p, q_r)
where (s_t = $5) and (u_v = $6)`)
      } finally {
        await sq.end()
      }
    })
    test('default snake_case 2', async () => {
      const sq = sqorn({ pg, pool: new pg.Pool(appConnection) })
      try {
        expect(
          sq.with({ 'aB(cD, e_f)': sq.sql`select 1, 2` }).from('gH')
            .from`jK`.return({ lM: 'nO' }, 'pQ').query.text
        ).toEqual(
          'with aB(cD, e_f) (select 1, 2) select nO l_m, pQ from gH, jK'
        )
      } finally {
        await sq.end()
      }
    })
    test('identity function', async () => {
      const sq = sqorn({
        pg,
        pool: new pg.Pool(appConnection),
        mapInputKeys: key => key
      })
      try {
        expect(
          sq
            .with({ aB: sq.sql`select cD`, e_f: sq.sql`select g_h` })
            .from({ iJ3: 'kL', mN: [{ oP: 1, q_r: 1 }] })
            .where({ sT: 1, u_v: 1 })
            .return({ wX: 1, y_z: 1 })
            .link('\n').query.text
        ).toEqual(`with aB (select cD), e_f (select g_h)
select $1 wX, $2 y_z
from kL iJ3, (values ($3, $4)) mN(oP, q_r)
where (sT = $5) and (u_v = $6)`)
      } finally {
        await sq.end()
      }
    })
    test('uppercase function', async () => {
      const sq = sqorn({
        pg,
        pool: new pg.Pool(appConnection),
        mapInputKeys: key => key.toUpperCase()
      })
      try {
        expect(
          sq
            .with({ aB: sq.sql`select cD`, e_f: sq.sql`select g_h` })
            .from({ iJ3: 'kL', mN: [{ oP: 1, q_r: 1 }] })
            .where({ sT: 1, u_v: 1 })
            .return({ wX: 1, y_z: 1 })
            .link('\n').query.text
        ).toEqual(`with AB (select cD), E_F (select g_h)
select $1 WX, $2 Y_Z
from kL IJ3, (values ($3, $4)) MN(OP, Q_R)
where (ST = $5) and (U_V = $6)`)
      } finally {
        await sq.end()
      }
    })
  })
  describe('mapOutputKeys', () => {
    test('default camelCase', async () => {
      const sq = sqorn({ pg, pool: new pg.Pool(appConnection) })
      try {
        expect(
          await sq.from`person`.where({
            firstName: 'Jo'
          }).return`id, first_name, last_name`.one()
        ).toEqual({ id: 1, firstName: 'Jo', lastName: 'Schmo' })
      } finally {
        await sq.end()
      }
    })
    test('no rows', async () => {
      const sq = sqorn({ pg, pool: new pg.Pool(appConnection) })
      try {
        expect(
          await sq.from`person`.where({ id: 999 }).return`first_name`.all()
        ).toEqual([])
      } finally {
        await sq.end()
      }
    })
    test('two rows camelCase', async () => {
      const sq = sqorn({ pg, pool: new pg.Pool(appConnection) })
      try {
        expect(await sq.from`person`.return`first_name`.all()).toEqual([
          { firstName: 'Jo' },
          { firstName: 'Bo' }
        ])
      } finally {
        await sq.end()
      }
    })
    test('identity function', async () => {
      const sq = sqorn({
        pg,
        pool: new pg.Pool(appConnection),
        mapOutputKeys: key => key
      })
      try {
        expect(
          await sq.from`person`.where({
            firstName: 'Jo'
          }).return`id, first_name, last_name`.one()
        ).toEqual({ id: 1, first_name: 'Jo', last_name: 'Schmo' })
      } finally {
        await sq.end()
      }
    })
    test('uppercase function', async () => {
      const sq = sqorn({
        pg,
        pool: new pg.Pool(appConnection),
        mapOutputKeys: key => key.toUpperCase()
      })
      try {
        expect(
          await sq.from`person`.where({
            firstName: 'Jo'
          }).return`id, first_name, last_name`.one()
        ).toEqual({ ID: 1, FIRST_NAME: 'Jo', LAST_NAME: 'Schmo' })
      } finally {
        await sq.end()
      }
    })
  })
})
