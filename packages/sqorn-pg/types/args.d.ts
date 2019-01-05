import {
  Arg,
  UnknownExpression,
  BooleanExpression,
  NumberExpression,
  StringExpression,
  ArrayExpression,
  JSONExpression,
  RowExpression,
  TableExpression
} from './expressions'
import {
  AnyBuilder,
  ManualBuilder,
  FragmentBuilder,
  RawBuilder
} from './builders'

export type Arg = Arg

export type WithItem = Aliased<
  AnyBuilder | ManualBuilder | FragmentBuilder | Value[]
>
export type FromItem =
  | Aliasable<
      string | AnyBuilder | ManualBuilder | FragmentBuilder | TableExpression
    >
  | Aliased<Value[]>

type SelectItem =
  | string
  | AnyBuilder
  | ManualBuilder
  | FragmentBuilder
  | SelectableExpression

export type AliasableSelectItem = Aliasable<SelectItem>

export type SelectableExpression =
  | BooleanExpression
  | NumberExpression
  | StringExpression
  | ArrayExpression
  | JSONExpression
  | RowExpression

export type Aliased<T> = { [alias: string]: T }
export type Aliasable<T> = T | Aliased<T>

export type Condition =
  | AnyBuilder
  | ManualBuilder
  | FragmentBuilder
  | BooleanExpression
  | Value

export type Numeric =
  | AnyBuilder
  | ManualBuilder
  | FragmentBuilder
  | NumberExpression
  | number

export type Subquery = AnyBuilder | ManualBuilder | FragmentBuilder

export type Value = {
  [field: string]: Arg
}

export type InputValue = {
  [field: string]: Arg | undefined
}
