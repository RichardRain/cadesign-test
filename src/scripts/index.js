// Импорт файлов для сборки Webpack'ом
import '../pages/index.css';
import '../images/ui.svg';
import '../images/logo.svg';
import '../images/icons.svg';
import '../images/socials.svg';
// Импорт модулей
import { openPopup, closePopup } from './components/modal.js';
import { clearValidation, enableValidation, checkFormValidity } from './components/validation.js';

// Определение элементов сайта
const navigationButton = document.querySelector('.header__menu-button');
const navigationCloseButton = document.querySelector('.popup-menu__close-button');
const navigationMenu = document.querySelector('.popup-menu');
const socialButton = document.querySelector('.header__navigation-button');
const socialLinks = document.querySelector('.header__social-links').classList;
const socialLinksVisible = 'header__social-links_visible';
const heroButton = document.querySelector('.hero-section__button');
const formPopup = document.querySelector('.popup-form');
const popups = document.querySelectorAll('.popup');
const teamControlButtons = document.querySelectorAll('.team-section__control-button');
const teamCards = document.querySelectorAll('.team-section__list-item');
const featuresControlButtons = document.querySelectorAll('.features-section__control-button');
const featuresCards = document.querySelectorAll('.features-section__item');
const validationConfig = {
  formSelector: '.form',
  inputSelector: '.form__input',
  checkboxSelector: '.form__checkbox',
  checkboxItemSelector: '.form__checkbox-item',
  checkboxIconSelector: '.form__checkbox-icon',
  fileSelector: '.form__file',
  fileLabelSelector: '.form__input-file',
  fileClearButtonSelector: '.form__input-clear',
  fileClearActiveClass: 'form__input-clear_visible',
  errorSelector: '.form__validation-message',
  submitButtonSelector: '.form__submit-button',
  inputBlockSelector: '.form__input-block',
  inactiveButtonClass: 'form__submit-button_inactive',
  inputErrorClass: 'form__input-invalid',
  errorClass: 'form__validation-message_visible',
  checkboxActiveClass: 'form__checkbox-item_checked',
  checkboxIconActiveClass: 'form__checkbox-icon_visible',
  validIconSelector: '.form__valid-icon',
  invalidIconSelector: '.form__invalid-icon',
  validationIconSelector: '.form__validation-icon',
  validationIconActiveClass: 'form__validation-icon_visible',
  formPopupSelector: '.popup-form',
  successPopupSelector: '.popup-success'
}

// Функция для переключения видимости ссылок на соцсети
function toggleSocialList() {
  socialLinks.contains(socialLinksVisible) ? socialLinks.remove(socialLinksVisible) : socialLinks.add(socialLinksVisible);
}

// Функция-обработчик попапов
function handlePopup(popup) {
  if (popup.classList.contains('popup_visible')) {
    closePopup(popup);
  } else {
    if (popup.querySelector('.form')) {
      const formElement = popup.querySelector('.form');
      const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
      const checkboxList = Array.from(formElement.querySelectorAll(validationConfig.checkboxSelector));
      const fileInputList = Array.from(formElement.querySelectorAll(validationConfig.fileSelector));
      const allInputs = [...inputList, ...checkboxList, ...fileInputList];
      const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
      clearValidation(formElement, validationConfig);
      allInputs.forEach((inputElement) => {
        checkFormValidity(inputElement, allInputs, buttonElement, validationConfig);
      });
    }
    openPopup(popup);
  }
}

// Фунцкия переключает карточки в блоке 'team-section'
function changeCard(id) {
  // Проверяем что id карточки в действиетльном диапазоне
  if (id >= 0 && id < teamCards.length) {
    // Определяем текущую карточку и ее кнопки
    const currentCard = document.querySelector('.team-section__list-item_visible');
    const currentButton = document.querySelector('.team-section__control-button_active');
    const previouseButton = teamCards[id].querySelector('.team-section__previous-button');
    const nextButton = teamCards[id].querySelector('.team-section__next-button');
    // Убираем класс, отображающий карточку и делаем кнопку неактивной (по смысу, на нее можно будет кликнуть)
    currentCard.classList.remove('team-section__list-item_visible');
    currentButton.classList.remove('team-section__control-button_active');
    currentButton.disabled = false;
    // Показываем новую карточку и делаем кнопку активной (здесь наоборот на кнопку нельзя будет кликнуть, т.к. она уже выбрана)
    teamCards[id].classList.add('team-section__list-item_visible');
    teamControlButtons[id].classList.add('team-section__control-button_active');
    teamControlButtons[id].disabled = true;
    // Проверка для кнопок планшетной и десктопной версии
    if (id === 0) {
      // Выключаем кнопку "предыдущая карточка", т.к. перед текщей карточкой ничего нет
      previouseButton.classList.add('team-section__button_inactive');
      previouseButton.disabled = true;
    } else if (id === teamCards.length - 1) {
      // Выключаем кнопку "следующая карточка", т.к. после текщей карточкой ничего нет
      nextButton.classList.add('team-section__button_inactive');
      nextButton.disabled = true;
    } else {
      // Сбрасываем кнопки
      nextButton.classList.remove('team-section__button_inactive');
      nextButton.disabled = false;
      previouseButton.classList.remove('team-section__button_inactive');
      previouseButton.disabled = false;
    }
  }
}

// Функция переключает карточки в 'features-section' в планшетной версии сайта
function changeFeatureCard(id) {
  const currentCards = document.querySelectorAll('.features-section__item_visible');
  const currentButton = document.querySelector('.features-section__control-button_active');
  const newId = id * 2; // Т.к. выводится по две карточки за раз

  // Убираем отображение активных карточек
  currentCards.forEach((card) => {
    card.classList.remove('features-section__item_visible');
  })
  currentButton.classList.remove('features-section__control-button_active');
  currentButton.disabled = false;
  // Показываем крточку с удвоенным Id и одну после нее
  // Пример: Id = 2, newId = 4, следующая Id = 5 (последние две карточки в списке из 6 карточек)
  featuresCards[newId].classList.add('features-section__item_visible');
  featuresCards[newId + 1].classList.add('features-section__item_visible');
  featuresControlButtons[id].classList.add('features-section__control-button_active');
  featuresControlButtons[id].disabled = true;
}

// Установка слушателей на кнопки
navigationButton.addEventListener('click', () => {
  handlePopup(navigationMenu);
});
navigationCloseButton.addEventListener('click', () => {
  handlePopup(navigationMenu);
});
socialButton.addEventListener('click', toggleSocialList);
heroButton.addEventListener('click', () => {
  handlePopup(formPopup);
});
popups.forEach((popup) => {
  const closeButton = popup.querySelector('.popup__close-button');
  closeButton.addEventListener('click', () => {
    handlePopup(popup);
  });
});
teamControlButtons.forEach((button, id) => {
  button.addEventListener('click', () => {
    changeCard(id);
  });
});
teamCards.forEach((card, id) => {
  const previouseButton = card.querySelector('.team-section__previous-button');
  const nextButton = card.querySelector('.team-section__next-button');
  previouseButton.addEventListener('click', () => {
    changeCard(id - 1);
  });
  nextButton.addEventListener('click', () => {
    changeCard(id + 1);
  });
});
featuresControlButtons.forEach((button, id) => {
  button.addEventListener('click', () => {
    changeFeatureCard(id);
  });
});
// Включаем валидацию всех форм
enableValidation(validationConfig);