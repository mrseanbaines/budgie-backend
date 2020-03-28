import mongoose from 'mongoose'
import * as types from '../types'

const transactionSchema = new mongoose.Schema(
  {
    created: Date,
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

const Transaction = mongoose.model<types.Transaction>('Transaction', transactionSchema)

export default Transaction
