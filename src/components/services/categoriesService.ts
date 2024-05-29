import axios from 'axios'
import { Category } from './models/category'
class CategoriesService {
  baseUrl: string
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async getCategories(): Promise<Category[]> {
    let getCategoriesUrl = `${this.baseUrl}/Categories`
    let response = await axios.get<Category[]>(getCategoriesUrl)
    let categories = response.data
    return categories
  }

  async deleteCategoryById(id: number): Promise<void> {
    let deleteCategoryUrl = this.baseUrl + '/Categories/' + id
    await axios.delete(deleteCategoryUrl)
  }

  async addCategory(category: Category): Promise<void> {
    let addCategoryUrl = `${this.baseUrl}/Categories`
    await axios.post(addCategoryUrl, category)
  }

  async updateCategory(category: Category): Promise<void> {
    let updateCategoryUrl = `${this.baseUrl}/Categories`
    await axios.put(updateCategoryUrl, category)
  }
}

export { CategoriesService }
