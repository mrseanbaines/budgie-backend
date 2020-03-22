import express from 'express'

import Category from '../models/category-model'

const router = express.Router()

// List Categories
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 25
    const offset = parseInt(req.query.offset, 10) || 0

    const categories = await Category.find()

    return res.status(200).send({
      items: categories.slice(offset, offset + limit),
      total: categories.length,
    })
  } catch (err) {
    return res.status(500).send(err)
  }
})

// Add Category
router.post('/', async (req, res) => {
  try {
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

    await new Category(newCategory).save()

    const categoryCount = await Category.estimatedDocumentCount()

    return res.status(201).send({ category: newCategory, total: categoryCount })
  } catch (err) {
    return res.status(500).send(err)
  }
})

// Delete Category
router.delete('/:id', async (req, res) => {
  try {
    const existingCategory = await Category.findById(req.params.id)

    if (!existingCategory) {
      return res.status(404).send('Category not found')
    }

    existingCategory.remove()

    const categoryCount = await Category.estimatedDocumentCount()

    return res.status(200).send({ category: existingCategory, total: categoryCount })
  } catch (err) {
    return res.status(500).send(err)
  }
})

export default router
