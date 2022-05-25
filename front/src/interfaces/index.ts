declare global {
  interface ObjectConstructor {
    typedKeys<T>(obj: T): Array<keyof T>
  }
  interface Math {
    ceil10(value: number, exp: number): number
  }
  interface EventTarget {
    value: string
  }
  interface HTMLElement {
    width?: number,
    height?: number
  }
}

interface dynamicsObject {
  [key: string]: any
}

type valueof<T> = T[keyof T]

export { dynamicsObject, valueof }