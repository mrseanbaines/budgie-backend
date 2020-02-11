import express from 'express'

import { Category, Transaction } from '../types'

const categories: Category[] = require('../../data/categories.json')
const transactions: Transaction[] = require('../../data/transactions.json')

const router = express.Router()

// List Transactions
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 25
  const offset = parseInt(req.query.offset, 10) || 0
  const sort = (req.query.sort || 'desc').toLowerCase()
  const { before, since } = req.query

  const results = transactions
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
    items: results.slice(offset, offset + limit),
    total: results.length,
  })
})

// Update Transaction
router.put('/:id', (req, res) => {
  const transaction = transactions.find(t => t.id === req.params.id)
  const category = categories.find(c => c.id === req.body.category)

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
