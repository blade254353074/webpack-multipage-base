import $ from 'zepto'

(function () {
  console.log('subpage1')
  $('body').append('$ is ' + $)

  return 'subpage1 func'
}())
