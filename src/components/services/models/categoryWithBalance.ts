import { Category } from './category'

class CategoryWithBalance extends Category {
  balance: number

  constructor(id: number, name: string, percentage: number, balance: number) {
    super(id, name, percentage)
    this.balance = balance
  }
}

export { CategoryWithBalance }
