const sqorn = require('@sqorn/pg')
const pg = require('pg')

const server = 'postgresql://postgres@localhost:5432/'
const adminDatabase = 'postgres'
const appDatabase = 'sqorn_postgres_example'
const adminConnection = { connectionString: server + adminDatabase }
const appConnection = { connectionString: server + appDatabase }

async function main() {
  // connect to admin database
  let pool = new pg.Pool(adminConnection)
  let sq = sqorn({ pg, pool })
  // delete app database if it exists
  await sq.sql`drop database if exists ${sq.raw(appDatabase)}`.run()
  // create app database
  await sq.sql`create database ${sq.raw(appDatabase)}`.run()
  // disconnect from admin database
  await sq.end()
  // connect to created database
  pool = new pg.Pool(appConnection)
  sq = sqorn({ pg, pool })
  // create author table
  await sq.sql`create table author (
    id              serial primary key,
    first_name      text,
    last_name       text,
    birthday        date
  )`.run()
  // create book table
  await sq.sql`create table book (
    id              serial primary key,
    title           text,
    genre           text,
    publish_year    integer,
    author_id       integer,
                    foreign key (author_id) references author (id)
  )`.run()
  // populate author table
  const [sanderson, jordan, tolkien] = await sq.from`author`.return`id`
    .insert(
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
    .all()
  // populate book table
  await sq.from`book`
    .insert(
      {
        title: 'The Way of Kings',
        genre: 'Fantasy',
        publishYear: 2010,
        authorId: sanderson.id
      },
      {
        title: 'The Eye of the World',
        genre: 'Fantasy',
        publishYear: 1990,
        authorId: jordan.id
      },
      {
        title: 'The Fellowship of the Ring',
        genre: 'Fantasy',
        publishYear: 1954,
        authorId: tolkien.id
      }
    )
    .all()
  // disconnect from database
  await sq.end()
}

main()
