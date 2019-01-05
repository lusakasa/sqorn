import {
  Infer,
  Arg,
  UnknownExpression,
  BooleanExpression,
  NumberExpression,
  StringExpression,
  ArrayExpression,
  JSONExpression,
  RowExpression,
  TableExpression,
} from '..'

export interface ArgOperations {
  (strings: TemplateStringsArray, ...args: any[]): UnknownExpression
  <T extends Arg>(arg: T): TypeArgChainMap[Infer<T>]
  (...arg: Arg[]): ArgRowChain
}

type TypeArgChainMap = {
  unknown: ArgUnknownChain
  boolean: ArgBooleanChain
  number: ArgNumberChain
  string: ArgStringChain
  array: ArgArrayChain
  json: ArgJSONChain
  row: ArgRowChain
  table: ArgTableChain
}
export interface ArgChain {
  (strings: TemplateStringsArray, ...args: any[]): RowExpression
  (...arg: Arg[]): RowExpression
}

interface ArgUnknownChain extends ArgChain, UnknownExpression {}
interface ArgBooleanChain extends ArgChain, BooleanExpression {}
interface ArgNumberChain extends ArgChain, NumberExpression {}
interface ArgStringChain extends ArgChain, StringExpression {}
interface ArgArrayChain extends ArgChain, ArrayExpression {}
interface ArgJSONChain extends ArgChain, JSONExpression {}
interface ArgRowChain extends ArgChain, RowExpression {}
interface ArgTableChain extends ArgChain, TableExpression {}