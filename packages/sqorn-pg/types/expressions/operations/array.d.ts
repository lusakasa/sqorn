import {
  ArrayTypes,
  ArrayExpression,
  ArrayArgument,
  UnknownExpression,
  UnknownArgument,
  NumberArgument,
  TableExpression,
} from '..'

export interface ArrayOperations {
  unnest: Unnest
  arrayGet: ArrayGet
  arrayAppend: ArrayAppend
  arrayCat: ArrayCat
}
export interface ArrayChainOperations<T extends ArrayTypes> {
  unnest: UnnestChain
  arrayGet: ArrayGetChain
  arrayAppend: ArrayAppendChain
  arrayCat: ArrayCatChain
}

interface Unnest {
  (text: TemplateStringsArray, ...args: any[]): UnnestChain
  (...args: ArrayArgument[]): UnnestChain
}
interface UnnestChain extends Unnest, TableExpression {}

interface ArrayGet {
  (strings: TemplateStringsArray, ...args: any[]): ArrayGetChain
  (array: ArrayArgument): ArrayGetChain
  (array: ArrayArgument, index: NumberArgument): UnknownExpression
}
interface ArrayGetChain {
  (strings: TemplateStringsArray, ...args: any[]): UnknownExpression
  (index: NumberArgument): UnknownExpression
}

interface ArrayAppend {
  (strings: TemplateStringsArray, ...args: any[]): ArrayAppendChain
  (array: ArrayArgument): ArrayAppendChain
  (array: ArrayArgument, element: UnknownArgument): ArrayExpression
}
interface ArrayAppendChain {
  (strings: TemplateStringsArray, ...args: any[]): ArrayExpression
  (element: UnknownArgument): ArrayExpression
}

interface ArrayCat {
  (strings: TemplateStringsArray, ...args: any[]): ArrayCatChain
  (array1: ArrayArgument): ArrayCatChain
  (array1: ArrayArgument, array2: ArrayArgument): ArrayExpression
}
interface ArrayCatChain {
  (strings: TemplateStringsArray, ...args: any[]): ArrayExpression
  (array2: ArrayArgument): ArrayExpression
}