import mongoose from 'mongoose'

/* eslint-disable camelcase */
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
  created: Date
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
  created: Date
  name: string
  email: string
  password: string
}
