const page = document.querySelector('.page');
const coverLayer = document.querySelector('.cover');

// Открытие попапа
export function openPopup(popup) {
  popup.classList.add('popup_visible');
  coverLayer.classList.add('cover_visible');
  page.classList.add('page_noscroll');
  document.addEventListener('keydown', closePopupOnEsc);
  coverLayer.addEventListener('click', closePopupOnCoverClick);
}

// Закрытие попапа
export function closePopup(popup) {
  popup.classList.remove('popup_visible');
  coverLayer.classList.remove('cover_visible');
  page.classList.remove('page_noscroll');
  document.removeEventListener('keydown', closePopupOnEsc);
  coverLayer.removeEventListener('click', closePopupOnCoverClick);
}

// Закрытие попапа по кнопке 'Esc'
function closePopupOnEsc(evt) {
  if (evt.key === 'Escape') {
    closePopup(document.querySelector('.popup_visible'));
  }
}

// Закрытие попапа при клике вне попапа
function closePopupOnCoverClick() {
  closePopup(document.querySelector('.popup_visible'));
}
