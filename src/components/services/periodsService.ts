import axios from 'axios'
import { Period } from './models/period'

class PeriodsService {
  baseUrl: string
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async getPeriods(): Promise<Period[]> {
    let getPeriodsUrl = `${this.baseUrl}/Periods`
    let response = await axios.get<Period[]>(getPeriodsUrl)
    let periods = response.data
    return periods
  }

  async deletePeriodById(id: number): Promise<void> {
    let deletePeriodUrl = this.baseUrl + '/Periods/' + id
    await axios.delete(deletePeriodUrl)
  }

  async addPeriod(period: Period): Promise<void> {
    let addPeriodUrl = `${this.baseUrl}/Periods`
    await axios.post(addPeriodUrl, period)
  }

  async getLatestPeriod(): Promise<Period> {
    let periods = await this.getPeriods()
    let orderedPeriods = periods.sort((a, b) =>
      a.startDate > b.startDate ? 1 : b.startDate > a.startDate ? -1 : 0
    )
    let latestPeriod = orderedPeriods[orderedPeriods.length - 1]
    return latestPeriod
  }
}

export { PeriodsService }
