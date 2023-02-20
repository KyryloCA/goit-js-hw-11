import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;
import { fetchPictures } from './fetchPictures.js';

const formSubmit = document.querySelector('.search-form');
console.log(formSubmit);


formSubmit.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

formSubmit.value = "";

function inputHandler(obj) {
  obj.preventDefault();
  const trimmedInput = obj.target.value.trim();
if (!trimmedInput || trimmedInput==="" || trimmedInput===" "){
  displayError();
}else{   fetchPictures(trimmedInput)
  .then(response => {
    displayGallery(response);
  })
  .catch(error => displayError(error));
};

}


// Add imports above this line
import { galleryItems } from './gallery-items';
// Change code below this line
const galeryInsertionPoint = document.querySelector('.gallery');
const InsertionContent = createGalleryCardsMarkup(galleryItems);
galeryInsertionPoint.insertAdjacentHTML('afterbegin', InsertionContent);
let gallery = new SimpleLightbox('.gallery .gallery__item', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});


function displayGallery(response){
  console.log(response);
}


function createGalleryCardsMarkup(el) {
  return el
    .map(({ preview, original, description }) => {
      return `
      <div class="gallery__item" href="${original}" onclick = "event.preventDefault()">
      <img class="gallery__image" src="${preview}" alt="${description}" />
      <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <b class="image-data">1111</b>
    </p>
    <p class="info-item">
      <b>Views</b>
      <b class="image-data">255</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <b class="image-data">3</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <b class="image-data">12</b>
    </p>
  </div>
    </div>
      `;
    })
    .join('');
}
// console.log(galleryItems);


function displayError(error="The error text") {
  // clearOutput();  
  Notiflix.Notify.failure('The error text');
} 