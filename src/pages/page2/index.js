console.log('AMD require compoents/movies.js')

require(
  ['components/movies', 'assets/api/movies.json'],
  (movies, moviesJSON) => {
    console.log('Callback executed!')
    movies = movies.default // esModule

    $(() => {
      $('#J_Result').html(movies(moviesJSON))
    })
  }
)
