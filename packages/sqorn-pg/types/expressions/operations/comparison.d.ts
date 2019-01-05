import {
  Types,
  BooleanExpression,
  Arg,
  Infer,
  InferCompatible,
  Compatible,
  TableArgument,
  ArrayArgument
} from '..'

export interface ComparisonOperations {
  // binary comparison
  eq: Eq
  neq: Neq
  lt: Lt
  gt: Gt
  lte: Lte
  gte: Gte
  // misc
  between: Between
  notBetween: NotBetween
  isDistinctFrom: IsDistinctFrom
  isNotDistinctFrom: IsNotDistinctFrom
  isNull: IsNull
  isNotNull: IsNotNull
  in: In
  notIn: NotIn
  // quantified any
  eqAny: EqAny
  neqAny: NeqAny
  ltAny: LtAny
  gtAny: GtAny
  lteAny: LteAny
  gteAny: GteAny
  // quantified all
  eqAll: EqAll
  neqAll: NeqAll
  ltAll: LtAll
  gtAll: GtAll
  lteAll: LteAll
  gteAll: GteAll
}
export interface ComparisonChainOperations<T extends Types> {
  // binary comparison
  eq: EqChain<T>
  neq: NeqChain<T>
  lt: LtChain<T>
  gt: GtChain<T>
  lte: LteChain<T>
  gte: GteChain<T>
  // misc
  between: BetweenChain1<T>
  notBetween: NotBetweenChain1<T>
  isDistinctFrom: IsDistinctFromChain<T>
  isNotDistinctFrom: IsNotDistinctFromChain<T>
  isNull: BooleanExpression
  isNotNull: BooleanExpression
  in: InChain<T>
  notIn: NotInChain<T>
  // quantified any
  eqAny: EqAnyChain<T>
  neqAny: NeqAnyChain<T>
  ltAny: LtAnyChain<T>
  gtAny: GtAnyChain<T>
  lteAny: LteAnyChain<T>
  gteAny: GteAnyChain<T>
  // quantified all
  eqAll: EqAllChain<T>
  neqAll: NeqAllChain<T>
  ltAll: LtAllChain<T>
  gtAll: GtAllChain<T>
  lteAll: LteAllChain<T>
  gteAll: GteAllChain<T>
}

interface Eq {
  (text: TemplateStringsArray, ...args: any[]): EqChain<'unknown'>
  <T extends Arg>(arg1: T): EqChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
}
interface EqChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Neq {
  (strings: TemplateStringsArray, ...args: any[]): NeqChain<'unknown'>
  <T extends Arg>(arg1: T): NeqChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
}
interface NeqChain<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Lt {
  (strings: TemplateStringsArray, ...args: any[]): LtChain<'unknown'>
  <T extends Arg>(arg1: T): LtChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
}
interface LtChain<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Gt {
  (strings: TemplateStringsArray, ...args: any[]): GtChain<'unknown'>
  <T extends Arg>(arg1: T): GtChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
}
interface GtChain<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Lte {
  (strings: TemplateStringsArray, ...args: any[]): LteChain<'unknown'>
  <T extends Arg>(arg1: T): LteChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
}
interface LteChain<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Gte {
  (strings: TemplateStringsArray, ...args: any[]): GteChain<'unknown'>
  <T extends Arg>(arg1: T): GteChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
}
interface GteChain<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface Between {
  (strings: TemplateStringsArray, ...args: any[]): BetweenChain1<'unknown'>
  <T extends Arg>(arg1: T): BetweenChain1<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BetweenChain2<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>, arg3: InferCompatible<T>): BooleanExpression
}
interface BetweenChain1<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BetweenChain2<T>
  (arg2: Compatible<T>): BetweenChain2<T>
  (arg2: Compatible<T>, arg3: Compatible<T>): BooleanExpression
}
interface BetweenChain2<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg3: Compatible<T>): BooleanExpression
}

interface NotBetween {
  (strings: TemplateStringsArray, ...args: any[]): NotBetweenChain1<'unknown'>
  <T extends Arg>(arg1: T): NotBetweenChain1<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): NotBetweenChain2<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>, arg3: InferCompatible<T>): BooleanExpression
}
interface NotBetweenChain1<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): NotBetweenChain2<T>
  (arg2: Compatible<T>): NotBetweenChain2<T>
  (arg2: Compatible<T>, arg3: Compatible<T>): BooleanExpression
}
interface NotBetweenChain2<T extends Types> {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg3: Compatible<T>): BooleanExpression
}

interface IsDistinctFrom {
  (text: TemplateStringsArray, ...args: any[]): IsDistinctFromChain<'unknown'>
  <T extends Arg>(arg1: T): IsDistinctFromChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
}
interface IsDistinctFromChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface IsNotDistinctFrom {
  (text: TemplateStringsArray, ...args: any[]): IsNotDistinctFromChain<'unknown'>
  <T extends Arg>(arg1: T): IsNotDistinctFromChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>): BooleanExpression
}
interface IsNotDistinctFromChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>): BooleanExpression
}

interface IsNull {
  (arg1: Arg): BooleanExpression
}
interface IsNotNull {
  (arg1: Arg): BooleanExpression
}

interface In {
  (text: TemplateStringsArray, ...args: any[]): InChain<'unknown'>
  <T extends Arg>(arg1: T): InChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>[]): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface InChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>[]): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface NotIn {
  (text: TemplateStringsArray, ...args: any[]): NotInChain<'unknown'>
  <T extends Arg>(arg1: T): NotInChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: InferCompatible<T>[]): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface NotInChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: Compatible<T>[]): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface EqAny {
  (text: TemplateStringsArray, ...args: any[]): EqAnyChain<'unknown'>
  <T extends Arg>(arg1: T): EqAnyChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface EqAnyChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface NeqAny {
  (text: TemplateStringsArray, ...args: any[]): NeqAnyChain<'unknown'>
  <T extends Arg>(arg1: T): NeqAnyChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface NeqAnyChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface LtAny {
  (text: TemplateStringsArray, ...args: any[]): LtAnyChain<'unknown'>
  <T extends Arg>(arg1: T): LtAnyChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface LtAnyChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface GtAny {
  (text: TemplateStringsArray, ...args: any[]): GtAnyChain<'unknown'>
  <T extends Arg>(arg1: T): GtAnyChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface GtAnyChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface LteAny {
  (text: TemplateStringsArray, ...args: any[]): LteAnyChain<'unknown'>
  <T extends Arg>(arg1: T): LteAnyChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface LteAnyChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface GteAny {
  (text: TemplateStringsArray, ...args: any[]): GteAnyChain<'unknown'>
  <T extends Arg>(arg1: T): GteAnyChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface GteAnyChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface EqSome {
  (text: TemplateStringsArray, ...args: any[]): EqSomeChain<'unknown'>
  <T extends Arg>(arg1: T): EqSomeChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface EqSomeChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface NeqSome {
  (text: TemplateStringsArray, ...args: any[]): NeqSomeChain<'unknown'>
  <T extends Arg>(arg1: T): NeqSomeChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface NeqSomeChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface LtSome {
  (text: TemplateStringsArray, ...args: any[]): LtSomeChain<'unknown'>
  <T extends Arg>(arg1: T): LtSomeChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface LtSomeChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface GtSome {
  (text: TemplateStringsArray, ...args: any[]): GtSomeChain<'unknown'>
  <T extends Arg>(arg1: T): GtSomeChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface GtSomeChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface LteSome {
  (text: TemplateStringsArray, ...args: any[]): LteSomeChain<'unknown'>
  <T extends Arg>(arg1: T): LteSomeChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface LteSomeChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface GteSome {
  (text: TemplateStringsArray, ...args: any[]): GteSomeChain<'unknown'>
  <T extends Arg>(arg1: T): GteSomeChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface GteSomeChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface EqAll {
  (text: TemplateStringsArray, ...args: any[]): EqAllChain<'unknown'>
  <T extends Arg>(arg1: T): EqAllChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface EqAllChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface NeqAll {
  (text: TemplateStringsArray, ...args: any[]): NeqAllChain<'unknown'>
  <T extends Arg>(arg1: T): NeqAllChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface NeqAllChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface LtAll {
  (text: TemplateStringsArray, ...args: any[]): LtAllChain<'unknown'>
  <T extends Arg>(arg1: T): LtAllChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface LtAllChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface GtAll {
  (text: TemplateStringsArray, ...args: any[]): GtAllChain<'unknown'>
  <T extends Arg>(arg1: T): GtAllChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface GtAllChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface LteAll {
  (text: TemplateStringsArray, ...args: any[]): LteAllChain<'unknown'>
  <T extends Arg>(arg1: T): LteAllChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface LteAllChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface GteAll {
  (text: TemplateStringsArray, ...args: any[]): GteAllChain<'unknown'>
  <T extends Arg>(arg1: T): GteAllChain<Infer<T>>
  <T extends Arg>(arg1: T, arg2: ArrayArgument): BooleanExpression
  <T extends Arg>(arg1: T, arg2: TableArgument): BooleanExpression
}
interface GteAllChain<T extends Types> {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: ArrayArgument): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}
