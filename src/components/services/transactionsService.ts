import axios from 'axios'
import type { FinancialTransaction } from './models/financialTransaction'
import { FinancialReport } from './models/financialReport'
import type { FinancialTransactionsXmlCreateDto } from './models/financialTransactionsXmlCreateDto'

class TransactionsService {
  baseUrl: string
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async getTransactions(): Promise<FinancialTransaction[]> {
    let getTransactionsUrl = `${this.baseUrl}/FinancialTransactions`
    let response = await axios.get<FinancialTransaction[]>(getTransactionsUrl)
    let financialTransactions = response.data
    return financialTransactions
  }

  async deleteTransactionById(id: number): Promise<void> {
    let deleteTransactionsUrl = this.baseUrl + '/FinancialTransactions/' + id
    await axios.delete(deleteTransactionsUrl)
  }

  async addTransaction(transaction: FinancialTransaction): Promise<void> {
    let addTransactionsUrl = `${this.baseUrl}/FinancialTransactions`
    await axios.post(addTransactionsUrl, transaction)
  }

  async getFinancialReport(
    periodId: number | null,
    startDate: Date | null,
    endDate: Date | null,
    categoryId: number | null
  ): Promise<FinancialReport> {
    let getFinancialReportUrl = `${this.baseUrl}/FinancialTransactions/FinancialReport`
    let response = await axios.request<FinancialReport>({
      url: getFinancialReportUrl,
      method: 'get',
      params: {
        periodId,
        startDate,
        endDate,
        categoryId
      }
    })

    let financialReport = response.data

    return financialReport
  }

  async addManyTransactionsXml(request: FinancialTransactionsXmlCreateDto): Promise<void> {
    let addManyTransactionsXmlUrl = `${this.baseUrl}/FinancialTransactions/Many/Xml`
    await axios.post(addManyTransactionsXmlUrl, request)
  }
}

export { TransactionsService }
