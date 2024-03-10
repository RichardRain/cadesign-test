import { closePopup, openPopup } from './modal';

// Показывает ошибку
function showInputError(errorElement, inputElement, errorMessage, validationConfig) {
  const inputBlock = inputElement.closest(validationConfig.inputBlockSelector);
  // добавляем класс ошибки на инпут, показываем сообщение ошибки в span-элемент под инпутом
  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationConfig.errorClass);
  // переключаем иконку валидности, если она есть у данного инпута
  if (inputBlock.querySelector(validationConfig.validationIconSelector)) {
    const invalidIcon = inputBlock.querySelector(validationConfig.invalidIconSelector);
    const validIcon = inputBlock.querySelector(validationConfig.validIconSelector);

    invalidIcon.classList.add(validationConfig.validationIconActiveClass);
    validIcon.classList.remove(validationConfig.validationIconActiveClass);
  }
}
// Скрывает ошибку
function hideInputError(errorElement, inputElement, validationConfig) {
  const inputBlock = inputElement.closest(validationConfig.inputBlockSelector);

  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.classList.remove(validationConfig.errorClass);
  errorElement.textContent = '';
  if (inputBlock.querySelector(validationConfig.validationIconSelector)) {
    const invalidIcon = inputBlock.querySelector(validationConfig.invalidIconSelector);
    const validIcon = inputBlock.querySelector(validationConfig.validIconSelector);

    invalidIcon.classList.remove(validationConfig.validationIconActiveClass);
    validIcon.classList.add(validationConfig.validationIconActiveClass);
  }
}
// Находит span-элемент, куда будет выводиться сообщение об ошибке
function findErrorElement(validationConfig, inputElement) {
  return inputElement.closest(validationConfig.inputBlockSelector).querySelector(validationConfig.errorSelector);
}
// Проверяет валидность инпута, выводит или убирает сообщение об ошибке
function checkInputValidity(errorElement, inputElement, validationConfig) {
  if (!inputElement.validity.valid) {
    if (inputElement.validity.patternMismatch) {
      inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
      inputElement.setCustomValidity("");
    }
    showInputError(errorElement, inputElement, inputElement.validationMessage, validationConfig);
  } else {
    hideInputError(errorElement, inputElement, validationConfig);
  }
}
// Возвращает true, если в списке инпутов есть невалидный инпут
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    if (!inputElement.validity.valid) {
      return true;
    }
  });
}
// Переключает состояние кнопки отправки формы
function toggleButtonState(inputList, buttonElement, validationConfig) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}
// Очищает все сообщения об ошибках
export function clearValidation(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const checkboxList = Array.from(formElement.querySelectorAll(validationConfig.checkboxSelector));
  const fileInputList = Array.from(formElement.querySelectorAll(validationConfig.fileSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
  const allInputs = [...inputList, ...checkboxList, ...fileInputList];
  allInputs.forEach((inputElement) => {
    const errorElement = findErrorElement(validationConfig, inputElement);
    hideInputError(errorElement, inputElement, validationConfig);
  });
  toggleButtonState(allInputs, buttonElement, validationConfig);
}
// Проверяет валидность формы
export function checkFormValidity(inputElement, inputList, buttonElement, validationConfig) {
  const errorElement = findErrorElement(validationConfig, inputElement);
  checkInputValidity(errorElement, inputElement, validationConfig);
  toggleButtonState(inputList, buttonElement, validationConfig);
}
// Переключает состояние чекбокса
function toggleCheckboxState(checkbox, validationConfig) {
  const inputBlock = checkbox.closest(validationConfig.inputBlockSelector);
  const checkboxItem = inputBlock.querySelector(validationConfig.checkboxItemSelector);
  const checkboxIcon = inputBlock.querySelector(validationConfig.checkboxIconSelector);

  if (!checkbox.checked) {
    checkboxItem.classList.remove(validationConfig.checkboxActiveClass);
    checkboxIcon.classList.remove(validationConfig.checkboxIconActiveClass);
  } else {
    checkboxItem.classList.add(validationConfig.checkboxActiveClass);
    checkboxIcon.classList.add(validationConfig.checkboxIconActiveClass);
  }
}
// Очищает инпут для файлов
function clearFiles(fileInput, validationConfig) {
  fileInput.value = '';
  changeFileName(fileInput, validationConfig);
}
// Подставляет имя файла в лейбл, а также меняет лейбл на стандартный, если очистить инпут
function changeFileName(fileInput, validationConfig) {
  const inputBlock = fileInput.closest(validationConfig.inputBlockSelector);
  const fileLabel = inputBlock.querySelector(validationConfig.fileLabelSelector);
  const clearButton = inputBlock.querySelector(validationConfig.fileClearButtonSelector);

  if (fileInput.value) {
    const file = fileInput.files[0];
    const fileName = file.name;

    if (fileLabel.textContent === 'Загрузить резюме') {
      fileLabel.textContent = fileName;
      clearButton.classList.add(validationConfig.fileClearActiveClass);
    } else {
      fileLabel.textContent = 'Загрузить резюме';
      clearButton.classList.remove(validationConfig.fileClearActiveClass);
    }
  } else {
    fileLabel.textContent = 'Загрузить резюме';
    clearButton.classList.remove(validationConfig.fileClearActiveClass);
  }
}
// Устанавливает слушатели на все инпуты и кнопки отправки формы
function setEventListeners(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const checkboxList = Array.from(formElement.querySelectorAll(validationConfig.checkboxSelector));
  const fileInputList = Array.from(formElement.querySelectorAll(validationConfig.fileSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
  const allInputs = [...inputList, ...checkboxList, ...fileInputList];

  fileInputList.forEach((fileInput) => {
    const inputBlock = fileInput.closest(validationConfig.inputBlockSelector);
    const clearButton = inputBlock.querySelector(validationConfig.fileClearButtonSelector);
    clearButton.addEventListener('click', () => {
      clearFiles(fileInput, validationConfig);
    });
  })
  allInputs.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkFormValidity(inputElement, allInputs, buttonElement, validationConfig);
    });
  });
  checkboxList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      toggleCheckboxState(inputElement, validationConfig);
    });
  });
  fileInputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      changeFileName(inputElement, validationConfig);
    });
  });
  // Дополнительная проверка валидности формы при выходе из фокуса инпута
  allInputs.forEach((inputElement) => {
    inputElement.addEventListener('focusout', function () {
      checkFormValidity(inputElement, allInputs, buttonElement, validationConfig);
    });
  });
  formElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const currentPopup = formElement.closest(validationConfig.formPopupSelector);
    const popupToOpen = document.querySelector(validationConfig.successPopupSelector);
    closePopup(currentPopup);
    formElement.reset();
    openPopup(popupToOpen);
  });
}
// Включает валидацию всех форм
export function enableValidation(validationConfig) {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, validationConfig);
  });
}