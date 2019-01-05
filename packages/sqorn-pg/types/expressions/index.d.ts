import { ArgOperations } from './operations/arg'
import { ValueOperations, ValueChainOperations } from './operations/value'
import { ComparisonOperations, ComparisonChainOperations } from './operations/comparison'
import { BooleanOperations, BooleanChainOperations } from './operations/boolean'
import { NumberOperations, NumberChainOperations } from './operations/number'
import { StringOperations, StringChainOperations } from './operations/string'
import { ArrayOperations, ArrayChainOperations } from './operations/array'
import { JSONOperations, JSONChainOperations } from './operations/json'
import { RowOperations, RowChainOperations } from './operations/row'
import { TableOperations, TableChainOperations } from './operations/table'
import { AnyBuilder, ManualBuilder, FragmentBuilder, RawBuilder} from '../builders'
import { Queryable } from '../buildable'

type TypeExpressionMap = {
  unknown: UnknownExpression
  boolean: BooleanExpression
  number: NumberExpression
  string: StringExpression
  array: ArrayExpression
  json: JSONExpression
  row: RowExpression
  table: TableExpression
}

type JSONValue = JSONPrimitive | JSONArray | JSONObject
type JSONPrimitive = null | boolean | number | string
interface JSONArray extends Array<JSONValue> {}
interface JSONObject {
  [key: string]: JSONValue
}

interface ArrayValue extends Array<Arg> {}

type TypePrimitiveMap = {
  unknown: null | AnyBuilder | ManualBuilder | FragmentBuilder | RawBuilder
  boolean: boolean
  number: number
  string: string
  array: ArrayValue
  json: JSONValue
  row: never
  table: never
}
type TypeInferenceMap = {
  [key in Types]: TypeExpressionMap[key] | TypePrimitiveMap[key]
}
type InferOrUnknown<T extends Types> = TypeInferenceMap['unknown'] | TypeInferenceMap[T]
type TypeCompatibilityMap = {
  unknown: Arg
  boolean: InferOrUnknown<'boolean'>
  number: InferOrUnknown<'number'>
  string: InferOrUnknown<'string'>
  array: InferOrUnknown<'array'>
  json: InferOrUnknown<'json'>
  row: InferOrUnknown<'row'>
  table: TypeInferenceMap['table']
}
type Types = keyof TypeExpressionMap
type PrimitiveTypes = TypePrimitiveMap[Types]
type ArgTypes = Types
type ExpressionTypes = TypeExpressionMap[Types]
export type Arg = TypeExpressionMap[ArgTypes] | PrimitiveTypes
type Compatible<T extends Types> = TypeCompatibilityMap[T]
type CompatibleArray<T extends Types> = Compatible<T>[] | null | UnknownExpression | ArrayExpression
type Infer<T extends Arg> = 
  T extends TypeInferenceMap['unknown'] ? 'unknown' :
  T extends TypeInferenceMap['boolean'] ? 'boolean' :
  T extends TypeInferenceMap['number'] ? 'number' :
  T extends TypeInferenceMap['string'] ? 'string' :
  T extends TypeInferenceMap['array'] ? 'array' :
  T extends TypeInferenceMap['row'] ? 'row' :
  T extends TypeInferenceMap['table'] ? 'table' :
  T extends TypeInferenceMap['json'] ? 'json' :
  never // json must be last due to structural typing
export type InferCompatible<T extends Arg> = Compatible<Infer<T>>
export type UnknownArgument = TypeCompatibilityMap['unknown']
export type BooleanArgument = TypeCompatibilityMap['boolean']
export type NumberArgument = TypeCompatibilityMap['number']
export type StringArgument = TypeCompatibilityMap['string']
export type ArrayArgument = TypeCompatibilityMap['array']
export type RowArgument = TypeCompatibilityMap['row']
export type TableArgument = TypeCompatibilityMap['table']
export type JSONArgument = TypeCompatibilityMap['json']
export type CompatibleTypes<T extends Types> = T | 'unknown'
export type BooleanTypes = CompatibleTypes<'boolean'>
export type NumberTypes = CompatibleTypes<'number'>
export type StringTypes = CompatibleTypes<'string'>
export type ArrayTypes = CompatibleTypes<'array'>
export type RowTypes = CompatibleTypes<'row'>
export type TableTypes = CompatibleTypes<'table'>
export type JSONTypes = CompatibleTypes<'json'>

interface Expression<T extends Types> extends
  Queryable<'expression'>,
  ComparisonChainOperations<T>
{
  expressionType: T
}

export interface CreateExpression extends
  ArgOperations,
  ValueOperations,
  ComparisonOperations,
  BooleanOperations,
  NumberOperations,
  StringOperations,
  ArrayOperations,
  JSONOperations,
  RowOperations,
  TableOperations {}

interface UnknownExpression extends Expression<'unknown'>,
  ValueChainOperations<'unknown'>,
  BooleanChainOperations<'unknown'>,
  NumberChainOperations<'unknown'>,
  StringChainOperations<'unknown'>,
  ArrayChainOperations<'unknown'>,
  RowChainOperations<'unknown'>,
  TableChainOperations<'unknown'> {}

interface BooleanExpression extends Expression<'boolean'>,
  BooleanChainOperations<'boolean'> {}

interface NumberExpression extends Expression<'number'>,
  NumberChainOperations<'number'> {}

interface StringExpression extends Expression<'string'>,
  StringChainOperations<'string'> {}

interface ArrayExpression extends Expression<'array'>,
  ArrayChainOperations<'array'> {}

interface RowExpression extends Expression<'row'> {}

interface TableExpression extends Expression<'table'>,
  TableChainOperations<'table'>,
  ValueChainOperations<'table'> {}

interface JSONExpression extends Expression<'json'>,
  JSONChainOperations<'json'> {}
