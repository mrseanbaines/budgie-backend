import { isSameMonth } from 'date-fns'
import * as R from 'ramda'

interface Item {
  created: string
}

const groupByMonth = <T extends Item>(items: T[]) => {
  const orderedItems = R.sort(
    R.descend(item => item.created || ''),
    items,
  )

  return R.groupWith((a, b) => isSameMonth(new Date(a.created), new Date(b.created)), orderedItems)
}

export default groupByMonth
