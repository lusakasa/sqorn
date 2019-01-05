import {
  TableTypes,
  BooleanExpression,
  TableArgument
} from '..'

export interface TableOperations {
  exists: Exists
  notExists: NotExists
}
export interface TableChainOperations<T extends TableTypes> {
  exists: BooleanExpression
  notExists: BooleanExpression
}

interface Exists {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg: TableArgument): BooleanExpression
}

interface NotExists {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg: TableArgument): BooleanExpression
}