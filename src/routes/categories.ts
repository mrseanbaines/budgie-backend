import express from 'express'

import data from '../../data'
import Category from '../models/category-model'

const router = express.Router()

// List Categories
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 25
  const offset = parseInt(req.query.offset, 10) || 0

  const categories = await Category.find()

  return res.status(200).send({
    items: categories.slice(offset, offset + limit),
    total: categories.length,
  })
})

// Add Category
router.post('/', async (req, res) => {
  const category = req.body

  if (!category) {
    return res.status(422).send('No category provided')
  }

  const newCategory = {
    name: category.name.trim(),
  }

  const existingCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${newCategory.name}$`, 'i') },
  })

  if (existingCategory) {
    return res.status(409).send('Category already exists')
  }

  try {
    await new Category(newCategory).save()
  } catch (err) {
    return res.status(500).send('Error creating category')
  }

  const categoryCount = await Category.estimatedDocumentCount()

  return res.status(201).send({ category: newCategory, total: categoryCount })
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
