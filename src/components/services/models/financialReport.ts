import { FinancialTransaction } from './financialTransaction'

class FinancialReport {
  financialTransactions: FinancialTransaction[]
  totalValue: number

  constructor(financialTransactions: FinancialTransaction[], totalValue: number) {
    this.financialTransactions = financialTransactions
    this.totalValue = totalValue
  }
}

export { FinancialReport }
