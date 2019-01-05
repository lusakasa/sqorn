const { buildCall, mapJoin, objectMapJoin } = require('@sqorn/lib-util')

module.exports = ctx => {
  if (!ctx.set) return
  const txt = calls(ctx, ctx.set)
  return txt && 'set ' + txt
}

const buildProperty = (ctx, key, value) =>
  `${ctx.mapKey(key)} = ${value === undefined ? 'default' : ctx.build(value)}`

const calls = mapJoin(buildCall(mapJoin(objectMapJoin(buildProperty))))
