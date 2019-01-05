const { camelCase, memoize } = require('@sqorn/lib-util')
const createNewContext = require('./context')
const build = Symbol.for('sqorn-build')

const createQueryBuilder = ({ defaultContext, query, adapter, config }) => {
  const { queries, methods, properties } = query
  const newContext = createNewContext(defaultContext)
  const client = adapter(config)
  const reducers = createReducers(methods)
  const updateContext = applyReducers(reducers)
  reducers.extend = (ctx, args) => {
    const arr = Array.isArray(args[0]) ? args[0] : args
    for (let i = 0; i < arr.length; ++i) {
      updateContext(arr[i].method, ctx)
    }
  }
  const builder = () => {} // must not be object literal
  const chain = createChain(builder)

  Object.defineProperties(builder, {
    ...builderProperties({ chain, newContext, updateContext, queries }),
    ...(client && adapterProperties({ client, config })),
    ...methodProperties({ methods, chain }),
    ...properties,
    ...(client && client.properties),
    e: {
      value: e
    },
    raw: {
      value: function(arg) {
        if (typeof arg === 'string') return () => arg
        throw Error('Error: raw argument must be string')
      }
    }
  })
  return chain()
}

/** Creates a new builder instance */
const createChain = prototype => {
  const chain = method => {
    const fn = (...args) => chain({ name: 'express', args, prev: method })
    fn.method = method
    Object.setPrototypeOf(fn, prototype)
    return fn
  }
  return chain
}

/** Creates an object containing all method reducers */
const createReducers = methods => {
  const reducers = {}
  for (const name in methods) {
    const { updateContext, properties = {} } = methods[name]
    reducers[name] = updateContext
    // some methods have subproperties, e.g. .unionAll
    for (const key in properties) {
      reducers[`${name}.${key}`] = properties[key]
    }
  }
  return reducers
}

/** Follows a method chain, applying each method's reducer, to ctx */
const applyReducers = reducers => (method, ctx) => {
  // follow method links to construct methods array (in reverse)
  const methods = []
  for (; method !== undefined; method = method.prev) {
    methods.push(method)
  }
  // build methods object by processing methods in call order
  for (let i = methods.length - 1; i >= 0; --i) {
    const method = methods[i]
    reducers[method.name](ctx, method.args)
  }
  return ctx
}

/** Default properties of all SQL Query Builders */
const builderProperties = ({ chain, newContext, updateContext, queries }) => ({
  [build]: {
    value: function(inheritedContext) {
      const ctx = updateContext(this.method, newContext(inheritedContext))
      return queries[ctx.type](ctx)
    }
  },
  query: {
    get: function() {
      return this[build]()
    }
  },
  unparameterized: {
    get: function() {
      return this[build]({ unparameterized: true }).text
    }
  },
  extend: {
    value: function(...args) {
      return chain({ name: 'extend', args, prev: this.method })
    }
  }
})

const adapterProperties = ({
  client,
  config: { mapOutputKeys = camelCase }
}) => {
  const mapKey = memoize(mapOutputKeys)
  return {
    end: {
      value: async function() {
        return client.end()
      }
    },
    all: {
      value: async function(trx) {
        const rows = await client.query(this.query, trx)
        return mapRowKeys(rows, mapKey)
      }
    },
    first: {
      value: async function(trx) {
        const rows = await client.query(this.query, trx)
        return mapRowKeys(rows, mapKey)[0]
      }
    },
    one: {
      value: async function(trx) {
        const rows = await client.query(this.query, trx)
        if (rows.length === 0) throw Error('Error: 0 result rows')
        return mapRowKeys(rows, mapKey)[0]
      }
    },
    run: {
      value: async function(trx) {
        await client.query(this.query, trx)
      }
    },
    transaction: {
      value: function(fn) {
        return fn ? client.transactionCallback(fn) : client.transactionObject()
      }
    }
  }
}

const mapRowKeys = (rows, fn) =>
  rows.length === 0
    ? rows
    : rows.length === 1
      ? mapOneRowKeys(rows, fn)
      : mapMultipleRowsKeys(rows, fn)

const mapOneRowKeys = (rows, fn) => {
  const [row] = rows
  const out = {}
  for (const key in row) {
    out[fn(key)] = row[key]
  }
  return [out]
}

const mapMultipleRowsKeys = (rows, fn) => {
  const mapping = {}
  for (const key in rows[0]) {
    mapping[key] = fn(key)
  }
  return rows.map(row => {
    const mapped = {}
    for (const key in mapping) {
      mapped[mapping[key]] = row[key]
    }
    return mapped
  })
}

/** Builds object containing a property for every query building method */
const methodProperties = ({ methods, chain }) => {
  const properties = {}
  for (const name in methods) {
    const { getter } = methods[name]
    if (getter) {
      // add getter methods
      properties[name] = {
        get: function() {
          return chain({ name, prev: this.method })
        }
      }
    } else {
      // add function call methods
      properties[name] = {
        value: function(...args) {
          return chain({ name, args, prev: this.method })
        }
      }
    }
  }
  return properties
}

module.exports = createQueryBuilder
