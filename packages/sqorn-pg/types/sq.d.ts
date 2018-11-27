import * as M from './methods'

export interface SQ
  extends Select, Update, Delete, Insert, Values, Manual, Helper, Execute, All {}

export interface SQF extends SQ, M.ExpressFrom {}
export interface SQW extends SQ, M.ExpressWhere {}
export interface SQR extends SQ, M.ExpressReturn {}

interface Select
  extends M.With, M.From, M.Join, M.Return, M.Where, M.Order, M.Limit, M.Offset, M.Group, M.Having, M.Logic {}

interface Update
  extends M.With, M.From, M.Join, M.Return, M.Where, M.Set, M.Logic {}

interface Delete
  extends M.With, M.From, M.Join, M.Return, M.Where, M.Delete, M.Logic {}

interface Insert extends M.With, M.From, M.Return, M.Insert, M.Logic {}

interface Values extends M.Order, M.Limit, M.Offset, M.Values {}

interface Manual extends M.SQL, M.Raw {}

interface Helper extends M.End, M.Transaction {}

interface Execute extends M.Buildable, M.Execute {}

interface All extends M.Link, M.Extend {}