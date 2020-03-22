/* eslint-disable camelcase */
export interface Category {
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

export interface Transaction {
  created: string
  id: string
  amount: number
  notes: string
  merchant: string | Merchant
  counterparty: Counterparty
  category: string
  include_in_spending: boolean
  is_load: boolean
}
