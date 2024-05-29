import { BaseEntity } from './baseEntity'

class Period extends BaseEntity {
  startDate: Date
  endDate: Date
  constructor(id: number, startDate: Date, endDate: Date) {
    super(id)
    this.startDate = startDate
    this.endDate = endDate
  }
}

export { Period }
