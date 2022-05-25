export interface Type {
  id: 'stock' | 'bond' | 'alternative' | 'mixed',
  [key: string]: string
}