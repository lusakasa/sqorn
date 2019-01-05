/** Query building methods */
const methods = {
  sql: {
    updateContext: (ctx, args) => {
      ctx.type = 'manual'
      ctx.userType = 'select'
      ctx.sql.push(args)
    }
  },
  txt: {
    updateContext: (ctx, args) => {
      ctx.type = 'manual'
      ctx.userType = 'fragment'
      ctx.sql.push(args)
    }
  },
  link: {
    updateContext: (ctx, args) => {
      ctx.separator = args[0]
    }
  },
  with: {
    updateContext: (ctx, args) => {
      ctx.with.push(args)
    }
  },
  withRecursive: {
    updateContext: (ctx, args) => {
      ctx.recursive = true
      ctx.with.push(args)
    }
  },
  from: {
    updateContext: (ctx, args) => {
      ctx.frm.push({ args, join: ', ' })
    }
  },
  where: {
    updateContext: (ctx, args) => {
      ctx.whr.push(args)
      ctx.target = ctx.whr
    }
  },
  return: {
    updateContext: (ctx, args) => {
      ctx.ret.push(args)
    }
  },
  distinct: {
    getter: true,
    updateContext: ctx => {
      ctx.distinct = []
    }
  },
  groupBy: {
    updateContext: (ctx, args) => {
      ctx.grp.push(args)
    }
  },
  having: {
    updateContext: (ctx, args) => {
      ctx.hav.push(args)
      ctx.target = ctx.hav
    }
  },
  union: {
    updateContext: (ctx, args) => {
      ctx.setop.push({ type: 'union', args })
    }
  },
  unionAll: {
    updateContext: (ctx, args) => {
      ctx.setop.push({ type: 'union all', args })
    }
  },
  intersect: {
    updateContext: (ctx, args) => {
      ctx.setop.push({ type: 'intersect', args })
    }
  },
  intersectAll: {
    updateContext: (ctx, args) => {
      ctx.setop.push({ type: 'intersect all', args })
    }
  },
  except: {
    updateContext: (ctx, args) => {
      ctx.setop.push({ type: 'except', args })
    }
  },
  exceptAll: {
    updateContext: (ctx, args) => {
      ctx.setop.push({ type: 'except all', args })
    }
  },
  orderBy: {
    updateContext: (ctx, args) => {
      ctx.ord.push(args)
    }
  },
  limit: {
    updateContext: (ctx, args) => {
      ctx.limit = args
    }
  },
  offset: {
    updateContext: (ctx, args) => {
      ctx.offset = args
    }
  },
  join: {
    updateContext: (ctx, args) => {
      ctx.frm.push((ctx.join = { args, join: ' join ' }))
    }
  },
  leftJoin: {
    updateContext: (ctx, args) => {
      ctx.frm.push((ctx.join = { args, join: ' left join ' }))
    }
  },
  rightJoin: {
    updateContext: (ctx, args) => {
      ctx.frm.push((ctx.join = { args, join: ' right join ' }))
    }
  },
  fullJoin: {
    updateContext: (ctx, args) => {
      ctx.frm.push((ctx.join = { args, join: ' full join ' }))
    }
  },
  crossJoin: {
    updateContext: (ctx, args) => {
      ctx.frm.push((ctx.join = { args, join: ' cross join ' }))
    }
  },
  naturalJoin: {
    updateContext: (ctx, args) => {
      ctx.frm.push((ctx.join = { args, join: ' natural join ' }))
    }
  },
  naturalLeftJoin: {
    updateContext: (ctx, args) => {
      ctx.frm.push((ctx.join = { args, join: ' natural left join ' }))
    }
  },
  naturalRightJoin: {
    updateContext: (ctx, args) => {
      ctx.frm.push((ctx.join = { args, join: ' natural right join ' }))
    }
  },
  naturalFullJoin: {
    updateContext: (ctx, args) => {
      ctx.frm.push((ctx.join = { args, join: ' natural full join ' }))
    }
  },
  on: {
    updateContext: (ctx, args) => {
      const { join } = ctx
      if (join.on) {
        join.on.push(args)
      } else {
        ctx.target = join.on = [args]
      }
    }
  },
  using: {
    updateContext: (ctx, args) => {
      const { join } = ctx
      if (join.using) {
        join.using.push(args)
      } else {
        join.using = [args]
      }
    }
  },
  delete: {
    getter: true,
    updateContext: ctx => {
      ctx.type = 'delete'
    }
  },
  insert: {
    updateContext: (ctx, args) => {
      ctx.type = 'insert'
      ctx.insert = args
    }
  },
  set: {
    updateContext: (ctx, args) => {
      ctx.type = 'update'
      ctx.set.push(args)
    }
  }
}

module.exports = methods
