import { createElement, addAttr } from "./utils.js";

// Closure
// Global Lexical Enviroment: all function in this module 
export function createPagination(list, prevFn, nextFn, moveToFn) {
  // Outer Lexical enviroment: arguments (list, prevFn, nextFn, moveToFn) and all let and const variables
  // Outer Functon return object with inner functions { getCurrentPage, updatePagination, moveTo, next, prev }
  const appendTo = '.page-content';
  const pageSize = 10;

  let paginationBar = null;
  let currentPageNumber = 1;
  let pages = chunk(list, pageSize);
  let currentPage = pages[currentPageNumber - 1];
  let pageCount = size(pages);

  const renderPaginationBar = () => {
    const parent = document.querySelector(appendTo);
    removePagesList(paginationBar);
    if(pageCount > 1) {
      appendPagesList(paginationBar, pageCount, moveToFn);
      parent.append(paginationBar);
      updateActive(currentPageNumber);
    } else if (parent.contains(paginationBar)) {
      parent.removeChild(paginationBar);
    }
  }

  const updatePagination = (list) => {
    updatePages(list);
    renderPaginationBar();
    updateActive(currentPageNumber);
    updateBtns();
  }

  const updateActive = (page) => {
    const pageNumbers = document.querySelectorAll('.page-number');
    pageNumbers.forEach(el => +el.dataset.page === +page ? el.classList.add('active') : el.classList.remove('active'));
  }

  const updateBtns = () => {
    const nextBtn = document.querySelector('#next');
    const prevBtn = document.querySelector('#prev');
    if(nextBtn && prevBtn) {
      nextBtn.disabled = currentPageNumber === pageCount;
      prevBtn.disabled = currentPageNumber === 1;
    }
  }

  // Inner Lexical Enviroment { object }
  const getCurrentPage = () => ({ page: currentPage, number: currentPageNumber });

  const updatePages = (list) => {
    pages = chunk(list, pageSize);
    pageCount = size(pages);
    currentPageNumber = 1;
    currentPage = pages[currentPageNumber - 1];
  }

  // Inner Lexical Enviroment { page }
  const moveTo = (page) => {
    currentPageNumber = +page;
    currentPage = pages[page - 1];
    updateActive(currentPageNumber);
    updateBtns();
    return currentPage;
  };

  // Inner Lexical Enviroment { }
  const prev = () => {
    if(currentPageNumber > 1) {
      currentPageNumber--
      currentPage = pages[currentPageNumber - 1];
      updateActive(currentPageNumber);
      updateBtns();
      return currentPage;
    }
  }

  // Inner Lexical Enviroment { }
  const next = () => {
    if(currentPageNumber < pageCount) {
      currentPageNumber++
      currentPage = pages[currentPageNumber - 1];
      updateActive(currentPageNumber);
      updateBtns();
      return currentPage;
    }
  }

  paginationBar = buildPaginationBar(prevFn, nextFn);
  renderPaginationBar();
  updateBtns();

  return {
    getCurrentPage,
    updatePagination,
    moveTo,
    next,
    prev,
  }
}

function chunk(array, size) {
  let count = 0;
  return array.reduce((acc, item, indx) => {
    if(indx === 0) {
      acc.push([item]);
      return acc;
    }
    if(indx === size || indx % size === 0) {
      count += 1;
      acc.push([item]);
      return acc; 
    } else {
      acc[count].push(item);
      return acc; 
    }
  }, []);
}

function size(collection) {
  return Object.keys(collection).length;
}

function buildPaginationBar(prevFn, nextFn) {
  const container = createElement('div', 'pagination-container');
  
  const controllerPrev = createElement('div', ['pagination-controller', 'prev']);
  const prev = createElement('button', 'controller', 'Prev');
  addAttr(prev, { id: 'prev', disabled: true });
  prev.addEventListener('click', () => prevFn());
  controllerPrev.append(prev);

  const pages = createElement('div', 'pagination-pages');
  
  const controllerNext = createElement('div', ['pagination-controller', 'next']);
  const next = createElement('button', 'controller', 'Next');
  next.id = 'next';
  next.addEventListener('click', () => nextFn());
  controllerNext.append(next);

  container.append(controllerPrev, pages, controllerNext);
  return container;
}

function appendPagesList(appendTo, pageCount, clickFn) {
  const target = appendTo.querySelector('.pagination-pages');
  for(let i = 0; i < pageCount; i++) {
    const button = createElement('button', 'page-number', i + 1);
    button.dataset['page'] = i + 1;
    button.addEventListener('click', event => clickFn(event.target.dataset.page));
    target.append(button);
  }
}

function removePagesList(removeFrom) {
  const target = removeFrom.querySelector('.pagination-pages')
  const children = target.children;
  if(!children.length) {
    return;
  }

  for(let i = children.length - 1; i >= 0; i--) {
    target.removeChild(children[i]);
  }
}