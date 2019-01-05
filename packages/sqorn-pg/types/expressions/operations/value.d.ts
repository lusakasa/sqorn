import {
  Types,
  Arg,
  UnknownExpression,
  BooleanExpression,
  NumberExpression,
  StringExpression,
  ArrayExpression,
  JSONExpression,
  RowExpression,
  TableExpression,
  UnknownArgument,
  BooleanArgument,
  NumberArgument,
  StringArgument,
  ArrayArgument,
  JSONArgument,
  RowArgument,
  TableArgument,
} from '..'


export interface ValueOperations {
  unknown: UnknownChain
  boolean: BooleanChain
  number: NumberChain
  string: StringChain
  array: ArrayChain
  json: JSONChain
  row: RowChain
  table: TableChain
}
export interface ValueChainOperations<T extends Types> {
  unknown: UnknownExpression
  boolean: BooleanExpression
  number: NumberExpression
  string: StringExpression
  array: ArrayExpression
  json: JSONExpression
  row: RowExpression
  table: TableExpression
}

interface UnknownChain {
  (strings: TemplateStringsArray, ...args: any[]): UnknownExpression
  (unknown: UnknownArgument): UnknownExpression
}
interface BooleanChain {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (boolean: BooleanArgument): BooleanExpression
}
interface NumberChain {
  (strings: TemplateStringsArray, ...args: any[]): NumberExpression
  (number: NumberArgument): NumberExpression
}
interface StringChain {
  (strings: TemplateStringsArray, ...args: any[]): StringExpression
  (string: StringArgument): StringExpression
}
interface ArrayChain {
  (strings: TemplateStringsArray, ...args: any[]): ArrayExpression
  (array: ArrayArgument): ArrayExpression
}
interface JSONChain {
  (strings: TemplateStringsArray, ...args: any[]): JSONExpression
  (json: JSONArgument): JSONExpression
}
interface RowChain {
  (strings: TemplateStringsArray, ...args: any[]): RowExpression
  (row: RowArgument): RowExpression
  (...arg: Arg[]): RowExpression
}
interface TableChain {
  (strings: TemplateStringsArray, ...args: any[]): TableExpression
  (table: TableArgument): TableExpression
}