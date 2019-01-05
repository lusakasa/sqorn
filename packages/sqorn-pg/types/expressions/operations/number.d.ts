import {
  NumberTypes,
  NumberExpression,
  NumberArgument
} from '..'

export interface NumberOperations {
  add: Add
  sub: Sub
  mul: Mul
  div: Div
  mod: Mod
  exp: Exp
  sqrt: Sqrt
  cbrt: Cbrt
  fact: Fact
  abs: Abs
}
export interface NumberChainOperations<T extends NumberTypes> {
  add: AddChain
  sub: SubChain
  mul: MulChain
  div: DivChain
  mod: ModChain
  exp: ExpChain
  sqrt: NumberExpression
  cbrt: NumberExpression
  fact: NumberExpression
  abs: NumberExpression
}

interface Add {
  (text: TemplateStringsArray, ...args: any[]): AddChain
  (arg1: NumberArgument): AddChain
  (arg1: NumberArgument, arg2: NumberArgument): NumberExpression
}
interface AddChain {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg2: NumberArgument): NumberExpression
}

interface Sub {
  (text: TemplateStringsArray, ...args: any[]): SubChain
  (arg1: NumberArgument): SubChain
  (arg1: NumberArgument, arg2: NumberArgument): NumberExpression
}
interface SubChain {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg2: NumberArgument): NumberExpression
}

interface Mul {
  (text: TemplateStringsArray, ...args: any[]): MulChain
  (arg1: NumberArgument): MulChain
  (arg1: NumberArgument, arg2: NumberArgument): NumberExpression
}
interface MulChain {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg2: NumberArgument): NumberExpression
}

interface Div {
  (text: TemplateStringsArray, ...args: any[]): DivChain
  (arg1: NumberArgument): DivChain
  (arg1: NumberArgument, arg2: NumberArgument): NumberExpression
}
interface DivChain {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg2: NumberArgument): NumberExpression
}

interface Mod {
  (text: TemplateStringsArray, ...args: any[]): ModChain
  (arg1: NumberArgument): ModChain
  (arg1: NumberArgument, arg2: NumberArgument): NumberExpression
}
interface ModChain {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg2: NumberArgument): NumberExpression
}

interface Exp {
  (text: TemplateStringsArray, ...args: any[]): ExpChain
  (arg1: NumberArgument): ExpChain
  (arg1: NumberArgument, arg2: NumberArgument): NumberExpression
}
interface ExpChain {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg2: NumberArgument): NumberExpression
}

interface Sqrt {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg1: NumberArgument): NumberExpression
}

interface Cbrt {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg1: NumberArgument): NumberExpression
}

interface Fact {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg1: NumberArgument): NumberExpression
}

interface Abs {
  (text: TemplateStringsArray, ...args: any[]): NumberExpression
  (arg1: NumberArgument): NumberExpression
}