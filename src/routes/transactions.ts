import express from 'express'

import Transaction from '../models/transaction-model'
import Category from '../models/category-model'

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

    return res.status(200).send({
      items: transactions,
      total: transactions.length,
    })
  } catch (err) {
    return res.status(500).send(err)
  }
})

router.post('/', async (req, res) => {
  try {
    const { type, data } = req.body

    if (!data) {
      return res.status(422).send('No transaction provided')
    }

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

      return res.status(201).send({ transaction: newTransaction, total: transactionCount })
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

    return res.status(200).send(transaction)
  } catch (err) {
    return res.status(500).send(err)
  }
})

export default router
