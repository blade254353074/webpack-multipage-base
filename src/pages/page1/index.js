console.log('CommonJs require.ensure compoents/movies.js')

require.ensure(
  ['components/movies', 'assets/api/movies.json'],
  require => {
    console.log('Callback executed!')
    const movies = require('components/movies').default // esModule
    const moviesJSON = require('assets/api/movies.json')

    $(() => {
      $('#J_Result').html(movies(moviesJSON))
    })
  }
)
