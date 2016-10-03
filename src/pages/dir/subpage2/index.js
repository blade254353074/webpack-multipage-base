import $ from 'zepto'
import './style'

console.log('subpage2')

;(function () {
  $('body').append('$ is ' + $)

  return 'subpage2 func'
}())
