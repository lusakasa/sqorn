export interface Database {
  /**
   * Closes the database connection.
   *
   * Subsequent attempts to execute using the query builder will fail.
   */
  end(): Promise<void>;

  /**
   * Creates a transaction
   * 
   * Pass an asynchronous callback containing queries that should be executed
   * in the context of the transaction. If an error is throw in `callback`,
   * the transaction is rolled back. Otherwise, the transaction is committed,
   * and the value returned by the callback is returned.
   * 
   * The callback's first argument `trx` must be passed to every query within
   * the transaction, or queries will not be part of the transaction.
   * 
   * @example
```js
const id = await sq.transaction(async trx => {
	const { id } = await sq.from('account').insert({ username: 'jo' }).one(trx)
	await sq.from('auth').insert({ accountId: id, password: 'secret' }).all(trx)
 return id
})
```
   */
  transaction<T>(callback: (trx: Transaction) => Promise<T>): Promise<T>

  /**
   * Creates a transaction
   * 
   * When called without arguments, `.transaction` returns a transaction
   * object `trx`. You MUST call `trx.commit()` or `trx.rollback()`.
   * 
   * This overload is less convenient but more flexible than the callback
   * transaction method.
   * 
   * @example
```js
let trx
try {
  trx = await sq.transaction()
  const { id } = await sq.from('account').insert({ username: 'jo' }).one(trx)
  await sq.from('auth').insert({ accountId: id, password: 'secret' }).all(trx)
  await trx.commit()
} catch (error) {
  await trx.rollback()
}
```
   */
  transaction(): Promise<Transaction>

}

interface Transaction {
  /**
   * Commits the transaction
   */
  commit(): Promise<void>;

  /**
   * Rolls back the transaction
   */
  rollback(): Promise<void>;
}