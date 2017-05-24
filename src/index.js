// http://stackoverflow.com/questions/14934452/how-to-get-all-registered-routes-in-express/31501504#31501504

import Table from 'cli-table'

const beginRegisteringRoutes = app => {
  const routes = []

  // monkey patch the `use` function to store the routers and the paths they operate on

  const oldUse = app.use
  app.use = function () {
    const urlBase = arguments[0]

    for (let i = 1; i < arguments.length; i++) {
      if (arguments[i] && arguments[i].name === 'router') {
        const router = arguments[i]
        const results = collectRoutesFromRouter(urlBase, router)
        routes.push(...results)
      }
    }

    return oldUse.apply(this, arguments)
    // why doesn't this work?
    // return oldUse(...arguments)
  }

  // find routes given app.get, app.post, etc.
  const methods = ['get', 'post', 'put', 'delete', 'all']

  for (const method of methods) {
    const oldFn = app[method]

    app[method] = function () {
      if (arguments.length >= 2) {
        const path = arguments[0]

        routes.push({
          path: removeTrailingSlash(path),
          method: method.toUpperCase()
        })
      }

      return oldFn.apply(this, arguments)
    }
  }

  return {
    print: () => print(routes),
    getRoutes: () => routes
  }
}

const collectRoutesFromRouter = (pathBase, router) => {
  const routes = []

  for (const stackElement of router.stack.filter(stackElement => stackElement.route)) {
    const path = pathBase + stackElement.route.path
    const methods = Object.keys(stackElement.route.methods).map(m => m === '_all' ? 'ALL' : m.toUpperCase())

    for (const method of methods) {
      routes.push({
        path: removeTrailingSlash(path),
        method
      })
    }
  }

  return routes
}

const format = routes => {
  const table = new Table({ head: ['Method', 'Path'] })

  for (const route of routes) {
    table.push({
      [route.method.toUpperCase()]: [route.path]
    })
  }

  return '(╯°□°）╯︵ ┻━┻\n' + table.toString()
}

// '/some/route/' -> '/some/route'
const removeTrailingSlash = path => {
  if (path !== '/' && path.endsWith('/')) {
    return path.substring(0, path.length - 1)
  } else {
    return path
  }
}

const print = routes => {
  console.log(format(routes))
}

export default {
  begin: beginRegisteringRoutes
}
