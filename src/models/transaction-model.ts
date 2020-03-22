import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    created: Date,
    id: String,
    amount: Number,
    notes: String,
    merchant: mongoose.Schema.Types.Mixed,
    counterparty: {
      name: String,
    },
    category: String,
    include_in_spending: Boolean,
    is_load: Boolean,
  },
  { minimize: false },
)

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction
