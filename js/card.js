import { Character } from './character.js';
import { addAttr, createElement } from './utils.js';

const imgDir = './img'

export class CharacterCard extends Character {
  cardClass = 'card-character'
  cardNode = null
  popup = null

  constructor({ id, name, species, gender, image, wiki, born, died, homeworld }) {
    super({ id, name, species, gender, image, wiki, born, died, homeworld })
  }

  renderCard(container) {
    this.cardNode = createElement('div', this.cardClass);

    const isFav = createElement('div', 'favorite-status');
    this.favorite ? isFav.classList.add('favorited') : null;
    addAttr(isFav, { title: 'Add to Favourites' });
    isFav.addEventListener('click', event => this.toggleFavoriteStatus(event.target));
    
    const content = createElement('div', 'card-content');
    const icon = createElement('img', this.cardClass + '__icon');
    addAttr(icon, { src: this.image, alt: this.name });
    const title = createElement('p', this.cardClass + '__title', this.name);
    content.append(icon, title);
    
    this.cardNode.append(content, isFav);
    this.cardNode.addEventListener('click', event => !event.target.classList.contains('favorite-status') ? this.openDetails() : null);
    document.querySelector(container).append(this.cardNode);
  }

  toggleFavoriteStatus(el) {
    this.favorite = !this.favorite;
    if(el.classList.contains('favorited')) {
      this.unsaveCharacterId();
      el.classList.remove('favorited');
    } else {
      this.saveCharacterId();
      el.classList.add('favorited');
    }
  }

  openDetails() {
    if(!this.popup) {
      this.popup = new CharacterCardDetails(this.name, this.age, this.species, this.gender, this.state, this.homeworld, this.image, this.info);
    }
    this.popup.render();
  }
}

export class CharacterCardDetails {
  node = null
  animationTime = 700
  
  constructor(name, age, species, gender, state, homeworld, image, info) {
    this.name = name;
    this.birthYear = age;
    this.species = species;
    this.gender = gender;
    this.state = state;
    this.homeworld = homeworld;
    this.image = image;
    this.info = info;
  }

  render() {
    if(!this.node) {
      this.node = createElement('div', 'modal-overlay');
      this.node.addEventListener('click', event => event.target.classList.contains('modal-overlay') ? this.close() : null);
      const popup = createDetailsPopup.bind(this)();
      this.node.append(popup);
    }
    document.body.append(this.node);
  }

  close() {
    this.node.classList.add('fade-out')
    setTimeout(() => {
      document.body.removeChild(this.node);
      this.node.classList.remove('fade-out');
    }, this.animationTime);
  }
}

function createDetailsPopup() {
  const popup = createElement('div', 'modal-card');
  const closeBtn = createElement('button', 'modal-card__btn-close');
  closeBtn.addEventListener('click', () => this.close());
  const icon = createElement('img', 'btn-close__icon');
  icon.src = './img/close-btn.svg';
  closeBtn.append(icon);
  const header = createModalHeader(this.name, this.image);
  const content = createElement('main', 'modal-card__content');
  const birthYear = createModalItem(`${imgDir}/date.svg`, 'Birth year:', this.birthYear);
  const species = createModalItem(`${imgDir}/species.svg`, 'Species:', this.species);
  const gender = createModalItem(`${imgDir}/gender.svg`, 'Gender:', this.gender);
  const homeworld = createModalItem(`${imgDir}/planet.svg`, 'Homeworld:', this.homeworld);
  const state = createModalItem(`${imgDir}/death.svg`, 'State:', this.state);
  const info = createModalAncor(`${imgDir}/wiki.svg`, 'Wiki:', this.info);
  content.append(birthYear, species, gender, homeworld, state, info);
  popup.append(closeBtn, header, content);
  return popup;
}

function createModalHeader(name, src) {
  const header = createElement('header', 'modal-card__header');
  const icon = createElement('img', 'modal-header__icon');
  addAttr(icon, { src, alt: name });
  const title = createElement('p', 'modal-header__title', name);
  header.append(icon, title);
  return header;
}

function createModalItem(icon, title, value) {
  const container = createElement('div', 'modal-item__container');
  const iconEl = createElement('img', 'item-icon');
  addAttr(iconEl, { alt: title, src: icon });
  const titleEl = createElement('p', 'item-title', title);
  const valueEl = createElement('p', 'item-value', value);
  container.append(iconEl, titleEl, valueEl);
  return container;
}

function createModalAncor(icon, title, value) {
  const container = createElement('div', 'modal-item__container');
  const iconEl = createElement('img', 'item-icon');
  addAttr(iconEl, { alt: title, src: icon });
  const titleEl = createElement('p', 'item-title', title);
  const valueEl = createElement('a', 'item-value', 'More info in Wiki');
  addAttr(valueEl, { href: value, target: '_blank' });
  container.append(iconEl, titleEl, valueEl);
  return container;
}