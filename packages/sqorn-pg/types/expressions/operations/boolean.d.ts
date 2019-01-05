import {
  BooleanTypes,
  BooleanExpression,
  BooleanArgument,
  Arg
} from '..'

export interface BooleanOperations {
  // logical
  and: And
  or: Or
  not: Not
  // comparison
  isTrue: IsTrue
  isNotTrue: IsNotTrue
  isFalse: IsFalse
  isNotFalse: IsNotFalse
  isUnknown: IsUnknown
  isNotUnknown: IsNotUnknown
}
export interface BooleanChainOperations<T extends BooleanTypes> {
  // logical
  and: AndChain
  or: OrChain
  not: BooleanExpression
  // comparison
  isTrue: BooleanExpression
  isNotTrue: BooleanExpression
  isFalse: BooleanExpression
  isNotFalse: BooleanExpression
  isUnknown: BooleanExpression
  isNotUnknown: BooleanExpression
}

interface And {
  (text: TemplateStringsArray, ...args: any[]): AndChain
  (...args: BooleanArgument[]): AndChain

}
interface AndChain extends And, BooleanExpression {}

interface Or {
  (text: TemplateStringsArray, ...args: any[]): OrChain
  (...args: BooleanArgument[]): OrChain
}
interface OrChain extends Or, BooleanExpression {}

interface Not {
  (text: TemplateStringsArray, ...args: any[]): BooleanExpression
  (arg: BooleanArgument): BooleanExpression
}

interface IsTrue {
  (arg1: Arg): BooleanExpression
}
interface IsNotTrue {
  (arg1: Arg): BooleanExpression
}
interface IsFalse {
  (arg1: Arg): BooleanExpression
}
interface IsNotFalse {
  (arg1: Arg): BooleanExpression
}
interface IsUnknown {
  (arg1: BooleanArgument): BooleanExpression
}
interface IsNotUnknown {
  (arg1: BooleanArgument): BooleanExpression
}