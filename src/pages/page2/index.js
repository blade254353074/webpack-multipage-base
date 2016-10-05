console.log('AMD require compoents/movies.js')

require(
  ['components/movies'],
  (movies) => {
    console.log('Callback executed!')
    movies = movies.default // esModule

    $(() => {
      $.ajax({
        url: '/v2/movie/in_theaters?count=10',
        dataType: 'json'
      })
        .done(res => {
          $('#J_Result').html(movies(res))
        })
        .fail(err => {
          console.log(err)
        })
        .always(() => {
          console.log('complete!')
        })
    })
  }
)
