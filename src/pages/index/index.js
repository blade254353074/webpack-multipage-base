import './style'

(function index () {
  console.log('index')
  $('body').append('$ is ' + $)
  $('li').append(' LI')
  return 'index func'
}())
