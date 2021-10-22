import { createElement } from "./utils.js";

const errorMessages = {
  'Failed to fetch': 'No internet connection or API is failed',
  '404': 'Sory but some problems with API happened',
  'Initialize cards went wrong': 'Sory but some problems with API happened',
  'Initialize app went wrong': 'Sory but some problems with API happened'
}

const closeModal = () => window.location.reload();

const buttonHandler = () => closeModal();

const keyDownHandler = event => event.hasOwnProperty('key') && event.key === 'Enter' ? closeModal() : null;

const createErrorMessage = (selector, errMessage) => {
  const layout = createElement('div', 'error-layout')
  const card = createElement('div', selector);
  const header = createElement('h3', selector + '__header', 'Error');
  const text = createElement('p', 'error-text', errMessage);
  const button = createElement('button', 'error-controller', 'Try again');

  button.addEventListener('click', buttonHandler);
  card.addEventListener('keydown', keyDownHandler);
  
  card.append(header, text, button);
  layout.append(card);
  document.body.append(layout);
}

const toastInit = () => {
  const container = createElement('div', 'toast-notification__container');
  const content = createElement('div', 'toast-notification__main');
  const message = createElement('div', 'toast-notification__message');
  const controller = createElement('div', 'toast-notification__controller');
  const button = createElement('button', null, 'OK');
  button.addEventListener('click', () => {
    container.classList.add('fadeOut');
    setTimeout(() => container.remove(), 1200);
  });
  controller.append(button);
  content.append(message, controller);
  container.append(content);
  return container;
}

const renderToats = (toast, err) => {
  const messageContainer = toast.querySelector('.toast-notification__message');
  const p = createElement('p', null, err.message);
  messageContainer.append(p);
  document.body.append(toast);
  setTimeout(() => {
    toast.classList.add('fadeOut');
    setTimeout(() => toast.remove(), 1200);
  });
}

export const errorHandler = (err) => {
  const renderIn = 'error-card';

  const toast = toastInit();

  const message = errorMessages[err.message];

  if(message) {
    const target = document.querySelector(`.${renderIn}`);
    if(!target) {
      createErrorMessage(renderIn, message);
    } else {
      target.querySelector('.error-text').innerHTML = message;
    }
  } else {
    renderToats(toast, err);
  }
};