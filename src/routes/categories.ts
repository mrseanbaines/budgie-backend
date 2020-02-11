import express from 'express'
import uuidv4 from 'uuid/v4'

import data from '../../data'

const router = express.Router()

// List Categories
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 25
  const offset = parseInt(req.query.offset, 10) || 0

  return res.status(200).send({
    items: data.categories.slice(offset, offset + limit),
    total: data.categories.length,
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

  const existingCategory = data.categories.find(({ name }) => name.toUpperCase() === newCategory.name.toUpperCase())

  if (existingCategory) {
    return res.status(409).send('Category already exists')
  }

  data.categories = [...data.categories, newCategory]

  return res.status(201).send({ category: newCategory, total: data.categories.length })
})

// Delete Category
router.delete('/:id', (req, res) => {
  const existingCategory = data.categories.find(({ id }) => id === req.params.id)

  if (!existingCategory) {
    return res.status(404).send('Category not found')
  }

  data.categories = data.categories.filter(category => category !== existingCategory)

  return res.status(200).send({ category: existingCategory, total: data.categories.length })
})

export default router
