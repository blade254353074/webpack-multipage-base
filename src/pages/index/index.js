import './style'
import doubanJSON from './demo'

$(function () {
  console.log('index')

  $('#J_Result').text(JSON.stringify(doubanJSON, null, 2))
})
