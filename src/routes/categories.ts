import express from 'express'

import Transaction from '../models/transaction'
import Category from '../models/category'
import auth from '../middleware/auth'

const router = express.Router()

// List Categories
router.get('/', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 25
    const offset = parseInt(req.query.offset, 10) || 0

    const categories = await Category.find()
    const response = {
      items: categories.slice(offset, offset + limit).map(c => ({ id: c.id, name: c.name, color: c.color })),
      total: categories.length,
    }

    return res.status(200).send(response)
  } catch (err) {
    return res.status(500).send(err)
  }
})

// Add Category
router.post('/', auth, async (req, res) => {
  try {
    const category = req.body

    if (!category) {
      return res.status(422).send('No category provided')
    }

    if (!category.name || !category.color) {
      return res.status(422).send('Please provide a name and color')
    }

    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${category.name.trim()}$`, 'i') },
    })

    if (existingCategory) {
      return res.status(409).send('Category already exists')
    }

    const newCategory = await Category.create({
      name: category.name.trim(),
      color: category.color.toUpperCase().trim(),
    })
    const categoryCount = await Category.estimatedDocumentCount()
    const response = {
      category: { id: newCategory.id, name: newCategory.name, color: newCategory.color },
      total: categoryCount,
    }

    return res.status(201).send(response)
  } catch (err) {
    return res.status(500).send(err)
  }
})

// Edit Category
router.put('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })

    if (!req.body || !(req.body.name || req.body.color)) {
      return res.status(422).send('Please provide a name and/or color to update')
    }

    if (!category) {
      return res.status(404).send('Category not found')
    }

    const response = { id: category.id, name: category.name, color: category.color }

    return res.status(200).send(response)
  } catch (err) {
    return res.status(500).send(err)
  }
})

// Delete Category
router.delete('/:id', async (req, res) => {
  try {
    const existingCategory = await Category.findByIdAndDelete(req.params.id)

    if (!existingCategory) {
      return res.status(404).send('Category not found')
    }

    await Transaction.updateMany({ category: req.params.id }, { category: null })

    const categoryCount = await Category.estimatedDocumentCount()
    const response = {
      category: { id: existingCategory.id, name: existingCategory.name, color: existingCategory.color },
      total: categoryCount,
    }

    return res.status(200).send(response)
  } catch (err) {
    return res.status(500).send(err)
  }
})

export default router
