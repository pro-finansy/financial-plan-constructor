declare global {
  interface ObjectConstructor {
    typedKeys<T>(obj: T): Array<keyof T>
  }
}

interface dynamicsObject {
  [key: string]: any
}

type valueof<T> = T[keyof T]

export { dynamicsObject, valueof }