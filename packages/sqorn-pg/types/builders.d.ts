import { Queryable } from './buildable'
import { Executable } from './executable'
import { Buildable } from './buildable'
import { Link } from './methods/link'
import { Extend } from './methods/extend'
import { With } from './methods/with'
import { Return } from './methods/return'
import { Distinct } from './methods/distinct'
import { From } from './methods/from'
import { Join } from './methods/join'
import { Where } from './methods/where'
import { GroupBy, GroupByUtil } from './methods/groupby'
import { Having } from './methods/having'
import { SetOperators } from './methods/set_operators'
import { OrderBy } from './methods/orderby'
import { Limit } from './methods/limit'
import { Offset } from './methods/offset'
import { Set } from './methods/set'
import { Delete } from './methods/delete'
import { Insert } from './methods/insert'
import { Sql } from './methods/sql'
import { Txt } from './methods/txt'
import { Raw } from './methods/raw'

interface QueryBuilder extends Queryable<'query'>, Executable, Link, Extend {}

export interface AnyBuilder
  extends QueryBuilder, SelectBuilder, UpdateBuilder, DeleteBuilder, InsertBuilder, Util {}

interface SelectBuilder
  extends With, Return, Distinct, From, Join, Where, GroupBy, Having, SetOperators, OrderBy, Limit, Offset {}

interface UpdateBuilder extends With, From, Return, Where, Set {}

interface DeleteBuilder extends With, From, Return, Where, Delete {}

interface InsertBuilder extends With, From, Insert, Return {}

export interface ManualBuilder extends QueryBuilder, Sql {}

export interface FragmentBuilder
  extends Queryable<'query'>, Link, Extend, Txt {}

export interface RawBuilder extends Buildable<'raw'> {}

interface Util extends GroupByUtil {}
