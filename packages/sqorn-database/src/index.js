const adapterProperties = ({
  client,
  config: { mapOutputKeys = camelCase }
}) => {
  const mapKey = memoize(mapOutputKeys)
  return {
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
