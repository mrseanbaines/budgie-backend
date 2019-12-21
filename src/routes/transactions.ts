import express from 'express'
import transactions from '../../data/transactions.json'
import categories from '../../data/categories.json'

const router = express.Router()

// List Transactions
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 25
  const offset = parseInt(req.query.offset, 10) || 0

  return res.status(200).send({
    items: transactions.slice(offset, offset + limit),
    total: transactions.length,
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
