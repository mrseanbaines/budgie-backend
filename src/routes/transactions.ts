/* eslint-disable no-console */
import express from 'express'

import Transaction from '../models/transaction-model'
import Category from '../models/category-model'
import * as types from '../types'

const router = express.Router()

// List Transactions
router.get('/', async (req, res) => {
  try {
    const sort = (req.query.sort || 'desc').toLowerCase()
    const { before, since } = req.query

    const query = Transaction.find()

    if (before) {
      query.lt('created', before)
    }

    if (since) {
      query.gte('created', since)
    }

    const transactions = await query.exec()

    const results = transactions.sort((a: types.Transaction, b: types.Transaction) => {
      const dateA = Date.parse(a.created)
      const dateB = Date.parse(b.created)

      switch (sort) {
        case 'asc': {
          return dateA - dateB
        }

        default: {
          return dateB - dateA
        }
      }
    })

    return res.status(200).send({
      items: results,
      total: results.length,
    })
  } catch (err) {
    return res.status(500).send(err)
  }
})

router.post('/', async (req, res) => {
  try {
    const transaction = req.body

    if (!transaction) {
      return res.status(422).send('No transaction provided')
    }

    const newTransaction = await new Transaction({
      created: transaction.created,
      amount: transaction.amount,
      notes: transaction.notes,
      merchant: transaction.merchant,
      counterparty: transaction.counterparty,
      category: transaction.category,
      include_in_spending: transaction.include_in_spending,
      is_load: transaction.is_load,
    }).save()

    const transactionCount = await Transaction.estimatedDocumentCount()

    return res.status(201).send({ transaction: newTransaction, total: transactionCount })
  } catch (err) {
    return res.status(500).send(err)
  }
})

// Update Transaction
router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
    const category = await Category.findById(req.body.category)

    if (!transaction) {
      return res.status(404).send('Transaction not found')
    }

    if (req.body.category === undefined) {
      return res.status(400).send('Please provide a category ID')
    }

    if (req.body.category !== null && !category) {
      return res.status(404).send('Category not found')
    }

    transaction.category = req.body.category

    return res.status(200).send(transaction)
  } catch (err) {
    return res.status(500).send(err)
  }
})

export default router
