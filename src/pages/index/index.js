import './style'

(function index () {
  console.log('index')
  $('body').append('$ is ' + $)
  $('li').append(' 666')
  return 'index func'
}())
