import $ from 'zepto'

console.log('subpage2')

;(function () {
  $('body').append('$ is ' + $)

  return 'subpage2 func'
}())
