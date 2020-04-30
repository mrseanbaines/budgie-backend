import { isSameMonth } from 'date-fns'
import { groupWith } from 'ramda'

interface Item {
  created: Date
}

const groupByMonth = <T extends Item>(items: T[]) =>
  groupWith((a, b) => isSameMonth(new Date(a.created), new Date(b.created)), items)

export default groupByMonth
