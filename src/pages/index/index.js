console.log('ES6 Module load compoents/movies.js')

import './style'
import movies from 'components/movies'
import moviesJSON from 'assets/api/movies.json'

$(() => {
  $('#J_Result').html(movies(moviesJSON))
})
