import {
  StringTypes,
  StringExpression,
  StringArgument,
  BooleanExpression,
  CompatibleArray,
  TableArgument
} from '..'

export interface StringOperations {
  like: Like
  notLike: NotLike
  likeAny: LikeAny
  notLikeAny: NotLikeAny
  likeAll: LikeAll
  notLikeAll: NotLikeAll
  concat: Concat
  similarTo: SimilarTo
  notSimilarTo: NotSimilarTo
  lower: Lower
  upper: Upper
}
export interface StringChainOperations<T extends StringTypes> {
  like: LikeChain
  notLike: NotLikeChain
  likeAny: LikeAnyChain
  notLikeAny: NotLikeAnyChain
  likeAll: LikeAllChain
  notLikeAll: NotLikeAllChain
  concat: ConcatChain
  similarTo: SimilarToChain
  notSimilarTo: NotSimilarToChain
  lower: StringExpression
  upper: StringExpression
}

interface Concat {
  (strings: TemplateStringsArray, ...args: any[]): ConcatChain
  (...args: StringArgument[]): ConcatChain
}
interface ConcatChain extends Concat, StringExpression {}

interface Like {
  (strings: TemplateStringsArray, ...args: any[]): LikeChain
  (arg1: StringArgument): LikeChain
  (arg1: StringArgument, arg2: StringArgument): LikeEscape
}
interface LikeChain {
  (strings: TemplateStringsArray, ...args: any[]): LikeEscape
  (arg2: StringArgument): LikeEscape
}

interface LikeEscape extends BooleanExpression {
  escape(strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  escape(character: StringArgument): BooleanExpression
}

interface NotLike {
  (strings: TemplateStringsArray, ...args: any[]): NotLikeChain
  (arg1: StringArgument): NotLikeChain
  (arg1: StringArgument, arg2: StringArgument): LikeEscape
}
interface NotLikeChain {
  (strings: TemplateStringsArray, ...args: any[]): LikeEscape
  (arg2: StringArgument): LikeEscape
}

interface LikeAny {
  (strings: TemplateStringsArray, ...args: any[]): LikeAnyChain
  (arg1: StringArgument): LikeAnyChain
  (arg1: StringArgument, arg2: CompatibleArray<'string'>): BooleanExpression
  (arg1: StringArgument, arg2: TableArgument): BooleanExpression
}
interface LikeAnyChain {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<'string'>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface LikeAll {
  (strings: TemplateStringsArray, ...args: any[]): LikeAllChain
  (arg1: StringArgument): LikeAllChain
  (arg1: StringArgument, arg2: CompatibleArray<'string'>): BooleanExpression
  (arg1: StringArgument, arg2: TableArgument): BooleanExpression
}
interface LikeAllChain {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<'string'>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface NotLikeAny {
  (strings: TemplateStringsArray, ...args: any[]): NotLikeAnyChain
  (arg1: StringArgument): NotLikeAnyChain
  (arg1: StringArgument, arg2: CompatibleArray<'string'>): BooleanExpression
  (arg1: StringArgument, arg2: TableArgument): BooleanExpression
}
interface NotLikeAnyChain {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<'string'>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface NotLikeAll {
  (strings: TemplateStringsArray, ...args: any[]): NotLikeAllChain
  (arg1: StringArgument): NotLikeAllChain
  (arg1: StringArgument, arg2: CompatibleArray<'string'>): BooleanExpression
  (arg1: StringArgument, arg2: TableArgument): BooleanExpression
}
interface NotLikeAllChain {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: CompatibleArray<'string'>): BooleanExpression
  (arg2: TableArgument): BooleanExpression
}

interface SimilarTo {
  (strings: TemplateStringsArray, ...args: any[]): SimilarToChain
  (arg1: StringArgument): SimilarToChain
  (arg1: StringArgument, arg2: StringArgument): BooleanExpression
}
interface SimilarToChain {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: StringArgument): BooleanExpression
}

interface NotSimilarTo {
  (strings: TemplateStringsArray, ...args: any[]): NotSimilarToChain
  (arg1: StringArgument): NotSimilarToChain
  (arg1: StringArgument, arg2: StringArgument): BooleanExpression
}
interface NotSimilarToChain {
  (strings: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg2: StringArgument): BooleanExpression
}

interface Lower {
  (strings: TemplateStringsArray, ...args: any[]): StringExpression
  (arg: StringArgument): StringExpression
}

interface Upper {
  (strings: TemplateStringsArray, ...args: any[]): StringExpression
  (arg: StringArgument): StringExpression
}