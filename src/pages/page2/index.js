console.log('AMD require components/movies.js')

require(
  ['components/movies', 'assets/api/movies.json'],
  (movies, moviesJSON) => {
    console.log('Callback executed!')
    movies = movies.default // esModule
    console.log('Got movies function~')

    window.onload = function () {
      document.querySelector('#J_Result').innerHTML = movies(moviesJSON)
    }
  }
)
