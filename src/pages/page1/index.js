console.log('CommonJs require.ensure compoents/movies.js')

require.ensure(
  ['components/movies', 'assets/api/movies.json'],
  require => {
    console.log('Callback executed!')
    const movies = require('components/movies').default // esModule
    console.log('Got movies function~')
    const moviesJSON = require('assets/api/movies.json')

    window.onload = function () {
      document.querySelector('#J_Result').innerHTML = movies(moviesJSON)
    }
  }
)
