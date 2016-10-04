$(function () {
  const ajax = $.ajax({
    url: '/',
    type: 'GET',
    dataType: 'html'
  })

  Promise.resolve(ajax)
    .then(xhr => {
      console.log(xhr)
    })
})
