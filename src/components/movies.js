function movies (movies) {
  const { count, total, title, subjects } = movies
  const lists = subjects.map(movie => {
    const directors = movie.directors
      .map(director => `<a href="${director.alt}" target="_blank">${director.name}</a>`)
      .join(' ')
    const casts = movie.casts
      .map(cast => `<a href="${cast.alt}" target="_blank">${cast.name}</a>`)
      .join(' ')

    return `
      <li class="item" data-id="${movie.id}">
        <div class="pic">
          <a href="${movie.alt}" target="_blank">
            <img alt="${movie.title}" src="${movie.images.large}">
          </a>
        </div>
        <div class="content">
          <h3 class="title single-line"><a href="${movie.alt}" target="_blank">${movie.title}</a></h3>
          <div class="meta">
            <p class="single-line">导演：${directors} &nbsp;主演：${casts}</p>
            <p class="single-line">${movie.year} / ${movie.genres.join(' ')}</p>
          </div>
          <p class="feedback single-line">
            <span class="star">${movie.rating.average}分</span>&nbsp;
            ${parseInt(movie.rating.stars)}人评价&nbsp;
            ${movie.collect_count}人看过
          </p>
        </div>
      </li>
    `
  })

  return `
    <div class="grid-container">
      <h1>${title}</h1>
      <ol class="grid">${lists.join('')}</ol>
      <p class="text-right">${count} of ${total}</p>
    </div>
  `
}

console.log('components/movies.js executed!')

export default movies
