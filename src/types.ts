/* eslint-disable camelcase */
import mongoose from 'mongoose'

export interface Category extends mongoose.Document {
  id: string
  name: string
  color: string
}

export interface Merchant {
  name: string
}

export interface Counterparty {
  name: string
}

export interface Transaction extends mongoose.Document {
  id: string
  created: string
  amount: number
  notes: string
  merchant: Merchant | null
  counterparty: Counterparty
  category: string | null
  include_in_spending: boolean
  is_load: boolean
}

export interface User extends mongoose.Document {
  id: string
  created: string
  name: string
  email: string
  password: string
}
