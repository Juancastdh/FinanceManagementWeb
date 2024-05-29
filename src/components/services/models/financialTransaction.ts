import { BaseEntity } from './baseEntity'

class FinancialTransaction extends BaseEntity {
  date: Date
  value: number
  description: string
  isExpense: boolean
  categoryId: number
  periodId: number

  constructor(
    id: number,
    date: Date,
    value: number,
    description: string,
    isExpense: boolean,
    categoryId: number,
    periodId: number
  ) {
    super(id)
    this.date = date
    this.value = value
    this.description = description
    this.isExpense = isExpense
    this.categoryId = categoryId
    this.periodId = periodId
  }
}

export { FinancialTransaction }
