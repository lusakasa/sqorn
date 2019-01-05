---
id: transactions
title: Transactions
sidebar_label: Transactions
---

## Overview

* **Begin** [`.transaction(cb)`](#callback) [`.transaction()`](#value)
* **End** [`Transaction.commit`](#value) [`Transaction.rollback`](#value)

## Callback

Call `.transaction` with an asynchronous callback to begin a transaction. The first callback argument is a transaction object `trx`. Pass `trx` to `.all` or `.one` to execute a query part of a transaction.

`.transaction` returns a Promise for the value returned by its callback. If a query fails or an error is thrown, all queries will be rolled back and `.transaction` will throw an error.


```js
// creates an account, returning a promise for the created user's id
const createAccount = (email, password) => 
  sq.transaction(async trx => {
    const { id } = await sq.sql`insert into account(email) values (${email}) returning id`.one(trx) 
    await sq.from`insert into authentication(account_id, password) values (${id}, ${password})`.all(trx)
    return id
  })
```

## Value

If you need more flexibility, call `.transaction` without any arguments and it will return a Promise for a transaction object `trx`, or `undefined` if a transaction could not be started.

Pass `trx` to a query to add it to a transaction. To commit the transaction, run ` await trx.commit()`. To rollback the transaction, run `await trx.rollback()`. Every transaction MUST be committed or rolled back to prevent a resource leak.

```js
// creates an account, returning a promise for the created user's id
const createAccount = async (email, password) =>  {
  const trx = await sq.transaction()
  try {
    const { id } = await sq.sql`insert into account(email) values (${email}) returning id`.one(trx) 
    await sq.from`insert into authorization(account_id, password) values (${id}, ${password})`.all(trx)
    await trx.commit()
    return id
  } catch (error) {
    await trx.rollback()
    throw error
  }
}
```
