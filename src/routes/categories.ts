import express from 'express'
import uuidv4 from 'uuid/v4'
import { Category } from '../types'

let categories: Category[] = require('../../data/categories.json')

const router = express.Router()

// List Categories
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 25
  const offset = parseInt(req.query.offset, 10) || 0

  return res.status(200).send({
    items: categories.slice(offset, offset + limit),
    total: categories.length,
  })
})

// Add Category
router.post('/', (req, res) => {
  const category = req.body

  if (!category) {
    return res.status(422).send('No category provided')
  }

  const newCategory = {
    id: uuidv4(),
    name: category.name.trim(),
  }

  const existingCategory = categories.find(
    ({ name }) => name.toUpperCase() === newCategory.name.toUpperCase(),
  )

  if (existingCategory) {
    return res.status(409).send('Category already exists')
  }

  categories = [...categories, newCategory]

  return res
    .status(201)
    .send({ category: newCategory, total: categories.length })
})

// Delete Category
router.delete('/:id', (req, res) => {
  const existingCategory = categories.find(({ id }) => id === req.params.id)

  if (!existingCategory) {
    return res.status(404).send('Category not found')
  }

  categories = categories.filter(category => category !== existingCategory)

  return res
    .status(200)
    .send({ category: existingCategory, total: categories.length })
})

export default router
