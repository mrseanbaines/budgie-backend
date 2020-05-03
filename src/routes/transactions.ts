import express from 'express'
import { startOfMonth } from 'date-fns'
import { sum } from 'ramda'

import Transaction from '../models/transaction'
import { Transaction as TransactionType } from '../types'
import Category from '../models/category'
import { groupByMonth } from '../utils'
// import auth from '../middleware/auth'

const router = express.Router()

const getTransactionResponse = (transaction: TransactionType) => ({
  id: transaction.id,
  created: transaction.created,
  amount: transaction.amount,
  notes: transaction.notes,
  merchant: {
    name: transaction.merchant.name,
    logo: transaction.merchant.logo,
  },
  counterparty: {
    name: transaction.counterparty.name,
  },
  category: transaction.category,
  include_in_spending: transaction.include_in_spending,
  is_load: transaction.is_load,
})

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
      items: transactions.map(getTransactionResponse),
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
    const transactions = await Transaction.find({ amount: { $lt: 0 } }, 'created amount')

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

    const existingTransaction = await Transaction.findOne({
      monzo_id: data.id,
    })

    if (existingTransaction) {
      return res.status(409).send('Transaction already exists')
    }

    // eslint-disable-next-line no-console
    console.log(req.body)

    if (type === 'transaction.created') {
      const newTransaction = await Transaction.create({ ...data, category: null, monzo_id: data.id })

      const transactionCount = await Transaction.estimatedDocumentCount()
      const response = {
        transaction: getTransactionResponse(newTransaction),
        total: transactionCount,
      }

      return res.status(201).send(response)
    }

    return res.send('Success')
  } catch (err) {
    return res.status(500).send(err)
  }
})

// Dump Transactions
router.post('/dump', async (req, res) => {
  try {
    const transactions = req.body

    if (!transactions) {
      return res.status(422).send('No transactions provided')
    }

    const existingTransactions = await Transaction.find()

    await Transaction.create(
      transactions
        .filter((t: TransactionType) => !existingTransactions.some(eT => eT.monzo_id === t.id))
        .map(t => ({ ...t, category: null, monzo_id: t.id })),
    )

    return res.send('Dump successful ✅')
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

    return res.status(200).send(getTransactionResponse(transaction))
  } catch (err) {
    return res.status(500).send(err)
  }
})

export default router
