export function createElement(tag, classList, innerHTML) {
  const el = document.createElement(tag);
  if(Array.isArray(classList) && classList.length) {
    el.classList.add(...classList)
  } else {
    classList && classList.length ? el.classList.add(classList) : null;
  }
  innerHTML ? el.innerHTML = innerHTML : null;
  return el;
}

export function addAttr(el, params) {
  const atrr = Object.keys(params);
  atrr.forEach(key => el.setAttribute(key, params[key]));
  return el;
}

export function openFiltersModal(target, filterFn, clearFilterFn, params) {
  const overlay = createElement('div', 'modal-overlay');
  const modalClose = () => overlay.remove();
  overlay.addEventListener('click', event => event.target.classList.contains('modal-overlay') ? modalClose() : null);

  const popup = createElement('div', ['modal-card', 'filters']);
  const closeBtn = createElement('button', 'modal-card__btn-close');
  closeBtn.addEventListener('click', () => modalClose());
  const icon = createElement('img', 'btn-close__icon');
  icon.src = './img/close-btn.svg';
  closeBtn.append(icon);

  const header = createElement('h2', 'modal-card__header', 'Filters');
  const content = createElement('form', 'modal-card__content');
  content.addEventListener('submit', event => filterConfirmHandler(event, target, filterFn, modalClose));

  const species = createElement('div', 'inputs-group-column');
  const speciesTitle = createElement('h3', null, 'Species');
  const dataSet = params.species.values();
  for(const specie of dataSet) {
    const label = createModalFilterCheckbox(specie, 'species', specie);
    species.append(label);
  }

  const gender = createModalFilterCheckboxGroup(2, ['male', 'female'], 'gender', ['Male', 'Female']);
  const genderTitle = createElement('h3', null, 'Gender');
  const state = createModalFilterCheckboxGroup(2, ['alive', 'died'], 'state', ['Alive', 'Died']);
  const stateTitle = createElement('h3', null, 'State');
  const favorite = createModalFilterCheckboxGroup(1, 'favorite', 'favorite', 'Favorite');
  const favoriteTitle = document.createElement('h3', null, 'Favorite');

  const btnGroup = createElement('div','inputs-group-row');
  const confirm = createElement('button', ['btn', 'btn-controller'], 'Confirm');
  confirm.type = 'submit';
  const reset = createElement('button', ['btn', 'btn-controller'], 'Clear Filter');
  reset.type = 'reset';
  reset.addEventListener('click', () => filterResetHandler(clearFilterFn, modalClose));
  btnGroup.append(reset, confirm);

  content.append(speciesTitle, species, genderTitle, gender, stateTitle, state, favoriteTitle, favorite, btnGroup);
  popup.append(closeBtn, header, content);
  overlay.append(popup);
  return overlay;
}

function filterConfirmHandler(event, filterBtn, filterFn, modalCloseFn) {
  event.preventDefault();
  const filterOptions = {};
  filterOptions.species = [].filter.call(event.target.elements.species, chbx => chbx.checked).map(chbx => chbx.id);
  filterOptions.gender = [].filter.call(event.target.elements.gender, chbx => chbx.checked).map(chbx => chbx.id);
  filterOptions.state = [].filter.call(event.target.elements.state, chbx => chbx.checked).map(chbx => chbx.id);
  filterOptions.favorite = event.target.elements.favorite.checked ? [true] : [];
  filterFn(filterOptions, filterBtn);
  modalCloseFn();
}

function filterResetHandler(clearFilterFn, modalCloseFn) {
  clearFilterFn();
  modalCloseFn();
}

function createModalFilterCheckbox(id, name, innerHTML) {
  const checkbox = createElement('input', 'filter-checkbox');
  addAttr(checkbox, { id, type: 'checkbox', name });
  const label = createElement('label', 'filter-label');
  addAttr(label, { for: id });
  const span = createElement('span', null, innerHTML);
  label.append(checkbox, span);
  return label;
}

function createModalFilterCheckboxGroup(labelCount, id, name, values) {
  const container = createElement('div', 'inputs-group');
  if(labelCount > 1) {
    for(let i = 0; i < labelCount; i++) {
      const label = createModalFilterCheckbox(id[i], name, values[i]);
      container.append(label);
    }
  } else {
    const label = createModalFilterCheckbox(id, name, values);
    container.append(label);
  }
  return container;
}