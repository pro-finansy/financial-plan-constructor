declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

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