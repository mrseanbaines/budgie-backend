import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: String,
})

const Category = mongoose.model('category', categorySchema)

export default Category
