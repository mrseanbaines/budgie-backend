import mongoose from 'mongoose'
import * as types from '../types'

const categorySchema = new mongoose.Schema({
  name: String,
  color: String,
})

const Category = mongoose.model<types.Category>('Category', categorySchema)

export default Category
