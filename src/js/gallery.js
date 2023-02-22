import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
import { fetchPictures } from './fetchPictures.js';
import { createGalleryCardsMarkup } from './buildGallery.js';

const pageData = {
  pageCounter: 1,
  searchQuery: '',
};

const formSubmit = document.querySelector('.search-form');
const buttonLoadMore = document.querySelector('.load-more');
const galeryInsertionPoint = document.querySelector('.gallery');

const lightbox = new SimpleLightbox('.gallery .gallery__item ', {
  captionDelay: 250,
});

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
        `We're sorry, but you've reached the end of search results.`,
        'info'
      );
    }
    showButton();
    const response = await createGalleryCardsMarkup(resultArray);
    const displayresult = await galeryInsertionPoint.insertAdjacentHTML(
      'beforeend',
      response
    );
    return displayresult;
  } catch (error) {
    error => displayError(error);
  } finally {
    lightbox.refresh();
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

async function displayError(error, type) {
  switch (typeof error) {
    case 'object':
      if (type === 'info') {
        Notiflix.Notify.info(error.message);
      } else {
        Notiflix.Notify.failure(error.message);
      }

      break;
    case 'string':
      if (type === 'info') {
        Notiflix.Notify.info(error);
      } else {
        Notiflix.Notify.failure(error);
      }
      break;
    default:
      console.log('error');
  }
}
