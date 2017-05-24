import rowdy from '../'
import niv from 'npm-install-version'

const versions = ['3.21.2', '4.15.3', '5.0.0-alpha.5']

for (const version of versions) {
  const expressVersion = `express@${version}`
  niv.install(expressVersion, {quiet: true})
  const express = niv.require(expressVersion)

  describe(`rowdy using express ${version}`, () => {
    it('canary', () => {
      const app = express()
      const rowdyResults = rowdy.begin(app)
      const expected = []
      expect(rowdyResults.getRoutes()).toEqual(expected)
    })

    const routeComparator = (a, b) => {
      if (a.method > b.method) return -1
      if (a.method < b.method) return 1
      if (a.path > b.path) return -1
      if (a.path < b.path) return 1
      return 0
    }

    const expectSameRoutes = (actual, expected) => {
      // do not care about the order
      const sortedActual = actual.concat().sort(routeComparator)
      const sortedExpected = expected.concat().sort(routeComparator)
      expect(sortedActual).toEqual(sortedExpected)
    }

    it('basic usage', () => {
      const app = express()
      const rowdyResults = rowdy.begin(app)

      app.get('/', (req, res) => {})
      app.post('/', (req, res) => {})
      app.put('/', (req, res) => {})
      app.delete('/', (req, res) => {})

      const expected = [
        {
          method: 'GET',
          path: '/'
        },
        {
          method: 'POST',
          path: '/'
        },
        {
          method: 'PUT',
          path: '/'
        },
        {
          method: 'DELETE',
          path: '/'
        }
      ]

      expectSameRoutes(rowdyResults.getRoutes(), expected)
    })

    it('all', () => {
      const app = express()
      const rowdyResults = rowdy.begin(app)

      app.all('/', (req, res) => {})

      const expected = [
        {
          method: 'GET',
          path: '/'
        },
        {
          method: 'POST',
          path: '/'
        },
        {
          method: 'PUT',
          path: '/'
        },
        {
          method: 'DELETE',
          path: '/'
        }
      ]

      expectSameRoutes(rowdyResults.getRoutes(), expected)
    })

    if (typeof express().route === 'function') {
      it('route chaining', () => {
        const app = express()
        const rowdyResults = rowdy.begin(app)

        app.route('/')
          .get((req, res) => {})
          .post((req, res) => {})
          .put((req, res) => {})
          .delete((req, res) => {})

        const expected = [
          {
            method: 'GET',
            path: '/'
          },
          {
            method: 'POST',
            path: '/'
          },
          {
            method: 'PUT',
            path: '/'
          },
          {
            method: 'DELETE',
            path: '/'
          }
        ]

        expectSameRoutes(rowdyResults.getRoutes(), expected)
      })
    }

    if (express.Router()) {
      it('Router', () => {
        const app = express()
        const rowdyResults = rowdy.begin(app)

        const router = express.Router()

        router.get('/', (req, res) => {})
        router.post('/', (req, res) => {})
        router.put('/', (req, res) => {})
        router.delete('/die', (req, res) => {})

        app.use('/app', router)

        const expected = [
          {
            method: 'GET',
            path: '/app'
          },
          {
            method: 'POST',
            path: '/app'
          },
          {
            method: 'PUT',
            path: '/app'
          },
          {
            method: 'DELETE',
            path: '/app/die'
          }
        ]

        expectSameRoutes(rowdyResults.getRoutes(), expected)
      })

      it('Router all', () => {
        const app = express()
        const rowdyResults = rowdy.begin(app)

        const router = express.Router()

        router.all('/', (req, res) => {})

        app.use('/app', router)

        const expected = [
          {
            method: 'GET',
            path: '/app'
          },
          {
            method: 'POST',
            path: '/app'
          },
          {
            method: 'PUT',
            path: '/app'
          },
          {
            method: 'DELETE',
            path: '/app'
          }
        ]

        expectSameRoutes(rowdyResults.getRoutes(), expected)
      })
    }
  })
}
