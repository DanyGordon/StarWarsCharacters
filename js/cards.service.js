import { CharacterCard } from './card.js';
import { preloader } from './preloader.js';
import { createPagination } from './pagination.js';
import { createElement } from './utils.js';
import { errorHandler } from './errorHandler.js';

export class CardService {
  _cards = []
  _sortedCards = []
  _filteredCards = []
  _currentPageCards = []
  cardContainer = '.card-container__content'
  sorted = false
  filtered = false
  filters = null
  filterBtn = null
  valueToSearh = ''
  searchActive = true;

  constructor(list) {
    preloader.loadingStart(this.cardContainer);
    if(!list || !list.length) {
      this.renderNoContent();
    } else {
      try {
        this._cards = this.cards = list.map(ch => new CharacterCard(ch));
        this.createPagination(this._cards);
        this.renderCards();
      } catch (error) {
        errorHandler(new Error('Initialize cards went wrong'));
        this.renderNoContent();
      }
    }
    preloader.loadingFinish(this.cardContainer);
  }

  renderCards() {
    this._currentPageCards.forEach(card => card.renderCard(this.cardContainer));
  }

  renderNoContent() {
    const p = createElement('p', 'center', 'No content');
    document.querySelector(this.cardContainer).append(p);
  }

  clearContainer() {
    const childNodes = document.querySelector(this.cardContainer).childNodes;
    for(let i = childNodes.length - 1; i >= 0; i--) {
      childNodes[i].remove();
    }
  }

  search(value) {
    preloader.loadingStart(this.cardContainer);
    this.clearContainer();

    if(!value) {
      this.valueToSearh = '';
      this.searchActive = false;
      if((this.sorted && this.filtered) || this.sorted) {
        this.sort();
      } else if(this.filtered) {
        this.filter(this.filters, this.filterBtn);
      } else {
        this.updatePages(this._cards);
        this.renderCards();
      }
    } else {
      this.valueToSearh = value;
      this.searchActive = true;
      const searched = this._cards.filter(card => card.name.includes(value));
      if(searched && searched.length) {
        this.updatePages(searched);
        this.renderCards();
      } else {
        this.renderNoContent();
      }
    }

    preloader.loadingFinish(this.cardContainer);
  }
  
  filter(options, btn) {
    const keysToFilter = Object.keys(options).filter(key => options[key].length);
    if(keysToFilter.length) {
      preloader.loadingStart(this.cardContainer);
      this.filtered = true;
      this.filters = options
      this.filterBtn = btn;
      this.clearContainer();
      if(this.sorted) {
        this._cards = this._sortedCards.filter(card => keysToFilter.every(key => options[key].includes(card[key])));
      } else {
        this._cards = this.cards.filter(card => keysToFilter.every(key => options[key].includes(card[key])));
        this._filteredCards = this._cards;
      }
      if(this.searchActive) {
        this._cards = this._cards.filter(card => card.name.includes(this.valueToSearh));
      }
      if(this._cards.length) {
        this.updatePages(this._cards);
        this.renderCards();
      } else {
        this.renderNoContent();
      }
      btn.classList.add('active');
      preloader.loadingFinish(this.cardContainer);
    } else {
      this.clearFilters();
    }
  }

  clearFilters() {
    if(this.filtered) {
      preloader.loadingStart(this.cardContainer);
      this.filtered = !this.filtered;
      this.filters = null;
      this.filterBtn = null;
      this.clearContainer();
      if(this.sorted) {
        this._cards = this._sortedCards;
      } else {
        this._cards = this.cards;
      }
      if(this.searchActive) {
        this._cards = this._cards.filter(card => card.name.includes(this.valueToSearh));
      }
      if(this._cards.length) {
        this.updatePages(this._cards)
        this.renderCards()
      } else {
        this.renderNoContent();
      }
      document.querySelector('#filter').classList.remove('active');
      preloader.loadingFinish(this.cardContainer);
    }
  }
  
  sort() {
    preloader.loadingStart(this.cardContainer);
    this.sorted = true;
    if(this.filtered) {
      this._sortedCards = this.cards.slice().sort((next, curr) => next.name < curr.name ? -1 : next.name > curr.name ? 1 : 0);
      this.filter(this.filters, this.filterBtn);
    } else {
      this._sortedCards = this.cards.slice().sort((next, curr) => next.name < curr.name ? -1 : next.name > curr.name ? 1 : 0);
      this._cards = this._sortedCards;
      if(this.searchActive) {
        this._cards = this._cards.filter(card => card.name.includes(this.valueToSearh));
      }
      if(this._cards.length) {
        this.clearContainer();
        this.updatePages(this._cards);
        this.renderCards();
      } else {
        this.renderNoContent();
      }
    }
    preloader.loadingFinish(this.cardContainer);
  }

  clearSort() {
    preloader.loadingStart(this.cardContainer);
    this.sorted = !this.sorted;
    this.clearContainer();
    if(this.filtered) {
      this.filter(this.filters, this.filterBtn);
    } else {
      this._cards = this.cards;
      if(this.searchActive) {
        this._cards = this._cards.filter(card => card.name.includes(this.valueToSearh));
      }
      if(this._cards.length) {
        this.updatePages(this._cards);
        this.renderCards();
      } else {
        this.renderNoContent();
      }
    }
    preloader.loadingFinish(this.cardContainer);
  }
  
  createPagination(list) {
    this.pagination = createPagination(list, this.prevPage.bind(this), this.nextPage.bind(this), this.moveToPage.bind(this));
    const current = this.pagination.getCurrentPage();
    this._currentPageCards = current.page;
  }

  updatePages(list) {
    this.pagination.updatePagination(list);
    const current = this.pagination.getCurrentPage();
    this._currentPageCards = current.page;;
  }

  nextPage() {
    const nextPage = this.pagination.next();
    if(nextPage) {
      this._currentPageCards = nextPage;
      this.clearContainer();
      this.renderCards();
    }
  }

  prevPage() {
    const prevPage = this.pagination.prev();
    if(prevPage) {
      this._currentPageCards = prevPage;
      this.clearContainer();
      this.renderCards();
    }
  }

  moveToPage(page) {
    const moved = this.pagination.moveTo(page);
    if(moved) {
      this._currentPageCards = moved;
      this.clearContainer();
      this.renderCards();
    }
  }
}