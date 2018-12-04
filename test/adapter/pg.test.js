const sqorn = require('../../packages/sqorn-pg')
const pg = require('pg')

const db_name = 'sqorn_pg_test'
const adminConnection = {
  connectionString: 'postgresql://postgres@localhost:5432/postgres'
}
const connection = {
  // username: postgres, no password, database name: sqorn_test
  connectionString: `postgresql://postgres@localhost:5432/${db_name}`
}

describe('pg', async () => {
  beforeAll(async () => {
    const pool = new pg.Pool(adminConnection)
    const sq = sqorn({ pg, pool })
    await sq.l`drop database if exists $${db_name}`
    await sq.l`create database $${db_name}`
    await sq.end()
  })
  const pool = new pg.Pool(connection)
  const sq = sqorn({ pg, pool })
  afterAll(async () => {
    await sq.end()
  })
  test('db empty', async () => {
    expect(
      await sq.from`pg_catalog.pg_tables`.where`schemaname = 'public'`
    ).toEqual([])
  })
  test('create table author', async () => {
    expect(
      await sq.l`create table author (
        id              serial primary key,
        first_name      text,
        last_name       text,
        birthday        date
      )`
    ).toEqual([])
  })
  test('create table book', async () => {
    expect(
      await sq.l`create table book (
        id              serial primary key,
        title           text,
        genre           text,
        publish_year    integer,
        author_id       integer,
                        foreign key (author_id) references author (id)
      )`
    ).toEqual([])
  })
  test('insert authors', async () => {
    expect(
      await sq`author`.return`first_name, last_name`.insert(
        {
          firstName: 'Brandon',
          lastName: 'Sanderson',
          birthday: '1975-12-19'
        },
        {
          firstName: 'Robert',
          lastName: 'Jordan',
          birthday: '1948-10-17'
        },
        {
          firstName: 'John',
          lastName: 'Tolkien',
          birthday: '1892-01-03'
        }
      )
    ).toEqual([
      {
        firstName: 'Brandon',
        lastName: 'Sanderson'
      },
      {
        firstName: 'Robert',
        lastName: 'Jordan'
      },
      {
        firstName: 'John',
        lastName: 'Tolkien'
      }
    ])
  })
  test('insert books', async () => {
    expect(
      await sq`book`.return`title, publish_year`.insert(
        {
          title: 'The Way of Kings',
          genre: 'Fantasy',
          publishYear: 2010,
          authorId: 1
        },
        {
          title: 'The Eye of the World',
          genre: 'Fantasy',
          publishYear: 1990,
          authorId: 2
        },
        {
          title: 'The Fellowship of the Ring',
          genre: 'Fantasy',
          publishYear: 1954,
          authorId: 3
        }
      )
    ).toEqual([
      {
        title: 'The Way of Kings',
        publishYear: 2010
      },
      {
        title: 'The Eye of the World',
        publishYear: 1990
      },
      {
        title: 'The Fellowship of the Ring',
        publishYear: 1954
      }
    ])
  })
  test('select author', async () => {
    expect(
      await sq.from`author`.where({ firstName: 'Brandon' }).return`last_name`
    ).toEqual([{ lastName: 'Sanderson' }])
  })
  test('update book', async () => {
    expect(
      await sq.from`book`
        .return('id', 'publish_year')
        .where({ title: 'The Way of Kings' })
        .set({ genre: 'Adventure' })
    ).toEqual([{ id: 1, publishYear: 2010 }])
  })
  test('select book', async () => {
    expect(
      await sq.from`book`.where({ genre: 'Adventure' }).return`id`
    ).toEqual([{ id: 1 }])
  })
  test('delete book', async () => {
    expect(
      await sq.from`book`.delete.return`id`.where({ title: 'The Way of Kings' })
    ).toEqual([{ id: 1 }])
  })
  test('select book', async () => {
    expect(await sq.from`book`.return`id`).toEqual([{ id: 2 }, { id: 3 }])
  })
  test('transaction callback success', async () => {
    const { jo, mo } = await sq.transaction(async trx => {
      const jo = await sq`author`.insert({ firstName: 'Jo' }).return`*`.one(trx)
      const [mo] = await sq`author`.insert({ firstName: 'Mo' }).return`*`.all(
        trx
      )
      return { jo, mo }
    })
    expect(jo.firstName).toBe('Jo')
    expect(mo.firstName).toBe('Mo')
    const authors = await sq`author`
    expect(authors.length).toBe(5)
  })
  test('transaction callback rollback', async () => {
    expect(
      (async () => {
        await sq.transaction(async trx => {
          await sq`author`.insert({ firstName: 'Bo' }).return`*`.one(trx)
          throw Error('oops')
        })
      })()
    ).rejects.toThrow('oops')
    const [bo] = await sq`author`({ firstName: 'Bo' })
    expect(bo).toBe(undefined)
  })
  test('transaction value success', async () => {
    const trx = await sq.transaction()
    const ma = await sq`author`.insert({ firstName: 'Ma' }).return`*`.one(trx)
    const pa = await sq`author`.insert({ firstName: 'Pa' }).return`*`.one(trx)
    await trx.commit()
    expect(ma.firstName).toBe('Ma')
    expect(pa.firstName).toBe('Pa')
    const authors = await sq`author`
    expect(authors.length).toBe(7)
  })
  test('transaction value rollback', async () => {
    const trx = await sq.transaction()
    let da = await sq`author`.insert({ firstName: 'Da' }).return`*`.one(trx)
    expect(da.firstName).toBe('Da')
    await trx.rollback()
    da = await sq`author`({ firstName: 'Da' }).one()
    expect(da).toBe(undefined)
  })
})
