import { BaseEntity } from './baseEntity'

class Category extends BaseEntity {
  name: string
  percentage: number
  constructor(id: number, name: string, percentage: number) {
    super(id)
    this.name = name
    this.percentage = percentage
  }
}

export { Category }
