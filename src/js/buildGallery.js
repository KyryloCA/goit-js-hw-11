function createGalleryCardsMarkup(el) {
  return el
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="gallery__item" href="${largeImageURL}" onclick = "event.preventDefault()">
        <img class="gallery__image" src="${webformatURL}" alt="${tags}" />
        <div class="info">
      <p class="info-item">
        <b>Likes</b>
        <b class="image-data">${likes}</b>
      </p>
      <p class="info-item">
        <b>Views</b>
        <b class="image-data">${views}</b>
      </p>
      <p class="info-item">
        <b>Comments</b>
        <b class="image-data">${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads</b>
        <b class="image-data">${downloads}</b>
      </p>
    </div>
      </div>
        `;
      }
    )
    .join('');
}

export { createGalleryCardsMarkup };
