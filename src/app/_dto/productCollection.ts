import { ProductDto } from "./productDto";

export interface ProductCollection {
  collection: ProductDto[],
  totalPages: number
}
