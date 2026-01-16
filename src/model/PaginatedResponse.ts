class PaginatedResponse<T> {
  content: T[] = []
  number: number = 0
  size: number = 0
  totalElements: number = 0
  totalPages: number = 0
  numberOfElements: number = 0
}

export default PaginatedResponse
