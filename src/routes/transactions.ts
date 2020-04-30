import express from 'express'
import { startOfMonth } from 'date-fns'
import { sum } from 'ramda'

import Transaction from '../models/transaction'
import Category from '../models/category'
import { groupByMonth } from '../utils'
// import auth from '../middleware/auth'

const router = express.Router()

// List Transactions
router.get('/', async (req, res) => {
  try {
    const { before, since } = req.query

    const query = Transaction.find()

    if (before) {
      query.lt('created', before)
    }

    if (since) {
      query.gte('created', since)
    }

    query.sort({ created: req.query.sort || 'desc' })

    const transactions = await query.exec()
    const response = {
      items: transactions.map(t => ({
        id: t.id,
        created: t.created,
        amount: t.amount,
        notes: t.notes,
        merchant: t.merchant,
        counterparty: t.counterparty,
        category: t.category,
        include_in_spending: t.include_in_spending,
        is_load: t.is_load,
      })),
      total: transactions.length,
    }

    return res.status(200).send(response)
  } catch (err) {
    return res.status(500).send(err)
  }
})

// List Transactions Summaries
router.get('/summary', async (req, res) => {
  try {
    const transactions = await Transaction.find(null, 'created amount')

    const summary = groupByMonth(transactions).map(monthTransactions => ({
      date: startOfMonth(new Date(monthTransactions[0].created)),
      total: sum(monthTransactions.map(t => t.amount)),
    }))

    return res.status(200).send(summary)
  } catch (err) {
    return res.status(500).send(err)
  }
})

// Add Transaction
router.post('/', async (req, res) => {
  try {
    const { type, data } = req.body

    if (!data) {
      return res.status(422).send('No transaction provided')
    }

    // eslint-disable-next-line no-console
    console.log(req.body)

    if (type === 'transaction.created') {
      const newTransaction = await Transaction.create({
        created: data.created,
        amount: data.amount,
        notes: data.notes,
        merchant: data.merchant,
        counterparty: data.counterparty,
        category: null,
        include_in_spending: data.include_in_spending,
        is_load: data.is_load,
      })

      const transactionCount = await Transaction.estimatedDocumentCount()
      const response = {
        transaction: {
          id: newTransaction.id,
          created: newTransaction.created,
          amount: newTransaction.amount,
          notes: newTransaction.notes,
          merchant: newTransaction.merchant,
          counterparty: newTransaction.counterparty,
          category: newTransaction.category,
          include_in_spending: newTransaction.include_in_spending,
          is_load: newTransaction.is_load,
        },
        total: transactionCount,
      }

      return res.status(201).send(response)
    }

    return res.end()
  } catch (err) {
    return res.status(500).send(err)
  }
})

// Update Transaction
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.body.category)

    if (req.body.category === undefined) {
      return res.status(400).send('Please provide a category ID')
    }

    if (req.body.category !== null && !category) {
      return res.status(404).send('Category not found')
    }

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { category: req.body.category },
      { new: true },
    )

    if (!transaction) {
      return res.status(404).send('Transaction not found')
    }

    const response = {
      id: transaction.id,
      created: transaction.created,
      amount: transaction.amount,
      notes: transaction.notes,
      merchant: transaction.merchant,
      counterparty: transaction.counterparty,
      category: transaction.category,
      include_in_spending: transaction.include_in_spending,
      is_load: transaction.is_load,
    }

    return res.status(200).send(response)
  } catch (err) {
    return res.status(500).send(err)
  }
})

export default router
