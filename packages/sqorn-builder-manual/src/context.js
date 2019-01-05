/** Returns a function the creates a new context */
const createNewContext = defaultContext => {
  const { parameterize, escape, mapKey, build } = defaultContext

  return (inherit = {}) => {
    const { params = [], unparameterized = false } = inherit

    const whr = []
    return {
      // properties set by the sqorn instance
      parameterize,
      escape,
      mapKey,
      build,

      // properties inherited from the parent query
      params,
      unparameterized,

      // properties of the current query
      type: 'select',
      // | sql' | 'select' | 'delete' | 'insert' | 'update'
      target: whr,
      join: undefined,
      separator: ' ',
      sql: [],
      ret: [],
      frm: [],
      whr,
      grp: [],
      hav: [],
      setop: [],
      ord: [],
      with: [],
      set: []

      // properties that may be added dynamically:
      // userType
      // distinct
    }
  }
}

module.exports = createNewContext
