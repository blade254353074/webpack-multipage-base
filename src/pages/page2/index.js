console.log('AMD require compoents/movies.js')

require(
  ['components/movies', 'assets/api/movies.json'],
  (movies, moviesJSON) => {
    console.log('Callback executed!')
    movies = movies.default // esModule

    $(() => {
      $('#J_Result').html(movies(moviesJSON))

      $.ajax({
        url: '/v2/movie/in_theaters?count=10',
        dataType: 'json'
      })
        .done(res => {
          console.log(res)
        })
        .fail(err => {
          console.log(err)
        })
        .always(() => {
          console.log('complete')
        })
    })
  }
)
