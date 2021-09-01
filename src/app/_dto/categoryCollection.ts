import { CategoryDtoSingleResponse } from "./categoryDtoSingleResponse"

export interface CategoryCollection {
  collection: CategoryDtoSingleResponse[],
  totalPages: number
}
