import { getCharacters } from "./api.js";
import { CardService } from "./cards.service.js";
import { errorHandler } from "./errorHandler.js";
import { preloader } from "./preloader.js";
import { openFiltersModal } from "./utils.js";

window.addEventListener('DOMContentLoaded', async () => {
  try {preloader.loadingStart();
    const characterList = await getCharacters();
    preloader.loadingFinish();
  
    const cardService = new CardService(characterList);
  
    const species = new Set();
    characterList.map(ch => species.add(ch.species));
  
    const searcher = document.querySelector('#search');
    const searchBtn = document.querySelector('.btn-search');
    searcher.addEventListener('keydown', event => event.key === 'Enter' ? cardService.search(searcher.value) : null);
    searchBtn.addEventListener('click', () => cardService.search(searcher.value));
  
    const sortBtn = document.querySelector('#sort');
    sortBtn.addEventListener('click', () => {
      cardService.sorted ? cardService.clearSort() : cardService.sort();
      cardService.sorted ? sortBtn.classList.add('active') : sortBtn.classList.remove('active');
    });
  
    const filterBtn = document.querySelector('#filter');
    let modal = null;
    filterBtn.addEventListener('click', () => {
      if(!modal) {
        modal = openFiltersModal(filterBtn, cardService.filter.bind(cardService), cardService.clearFilters.bind(cardService), { species });
      }
      document.body.append(modal);
    });
  } catch (e) {
    errorHandler(new Error('Initialize app went wrong'));
  }
});