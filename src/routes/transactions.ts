import express from 'express'

import { Transaction } from '../types'
import data from '../../data'

const router = express.Router()

// List Transactions
router.get('/', async (req, res) => {
  const sort = (req.query.sort || 'desc').toLowerCase()
  const { before, since } = req.query

  const results = data.transactions
    .filter(t => (before ? t.created < before : true))
    .filter(t => (since ? t.created >= since : true))
    .sort((a: Transaction, b: Transaction) => {
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
})

// Update Transaction
router.put('/:id', (req, res) => {
  const transaction = data.transactions.find(t => t.id === req.params.id)
  const category = data.categories.find(c => c.id === req.body.category)

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
})

export default router
