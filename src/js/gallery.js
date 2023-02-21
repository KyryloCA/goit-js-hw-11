import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
import { fetchPictures } from './fetchPictures.js';

let lightbox = null;

const pageData = {
  pageCounter: 1,
  searchQuery: '',
};

const formSubmit = document.querySelector('.search-form');
const buttonLoadMore = document.querySelector('.load-more');
const galeryInsertionPoint = document.querySelector('.gallery');

buttonLoadMore.addEventListener('click', () =>
  loadMoreElements(pageData.searchQuery, pageData.pageCounter)
);
formSubmit.addEventListener('submit', r => {
  inputHandler(r, pageData.pageCounter);
});
hideButton();

function inputHandler(obj, pageCounter) {
  obj.preventDefault();

  const trimmedInput = obj.currentTarget[0].value.trim();
  if (!trimmedInput || trimmedInput === '' || trimmedInput === ' ') {
    clearGallery();
    displayError(
      'Sorry, there are no images matching your search query. Please try again'
    );
    hideButton();
  } else {
    if (pageData.searchQuery !== trimmedInput) {
      pageData.searchQuery = trimmedInput;
      clearGallery();
      galleryBuilder(trimmedInput, pageCounter);
      pageData.pageCounter++;
      showButton();
    } else {
      galleryBuilder(trimmedInput, pageCounter);
      pageData.pageCounter++;
    }
  }
}

function loadMoreElements(searchQuery, pageCounter) {
  galleryBuilder(searchQuery, pageCounter);
  pageData.pageCounter++;
}

async function galleryBuilder(trimmedInput, pageCounter) {
  try {
    const resultArray = await fetchPictures(trimmedInput, pageCounter); //request come here

    if (resultArray.length === 0) {
      displayError(
        `Sorry, there are no images matching your search query. Please try again`
      );
      hideButton();
    } else if (resultArray.length > 0 && resultArray.length < 40) {
      // hardcored to 40 pictures in request
      hideButton();
      displayError(
        `We're sorry, but you've reached the end of search results.`
      );
    }
    const response = await createGalleryCardsMarkup(resultArray);
    const displayresult = await galeryInsertionPoint.insertAdjacentHTML(
      'beforeend',
      response
    );
    return displayresult;
  } catch (error) {
    error => displayError(error);
  } finally {
    lightbox = null;
    lightbox = new SimpleLightbox('.gallery .gallery__item');
  }
}

function clearGallery() {
  galeryInsertionPoint.innerHTML = '';
  pageData.pageCounter = 1;
}

function hideButton() {
  buttonLoadMore.style.display = 'none';
}
function showButton() {
  buttonLoadMore.style.display = 'block';
}

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

async function displayError(error) {
  switch (typeof error) {
    case 'object':
      Notiflix.Notify.failure(error.message);
      break;
    case 'string':
      Notiflix.Notify.failure(error);
      break;
    default:
      console.log('error');
  }
}
