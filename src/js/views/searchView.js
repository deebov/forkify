import { DOM, DOMStrings } from './base';
// Function to get the search input value
export const getInput = () => DOM.searchInput.value;
// Function to truncate a recipe title
export const trunc = (str, limit) => {
  if (str.length > limit) {
    return str.slice(0, limit > 3 ? limit - 3 : limit) + '...';
  }
  return str;
};
// Function to render result item
const renderRecipe = recipe => {
  // Recipe item markup
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${trunc(recipe.title, 23)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
    </li>`;
  // Insert the markup to the results list
  DOM.searchResList.insertAdjacentHTML('beforeend', markup);
};
// Function to render results
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // Start point of the array
  const begin = (page - 1) * resPerPage;
  // End point of the array
  const end = page * resPerPage;

  recipes.slice(begin, end).forEach(renderRecipe);
  renderButtons(page, recipes.length, resPerPage);
};

// Function to highlight an active search item
export const highlightSelected = id => {
  // Delete active link class if it is
  const link = document.querySelector(`.${DOMStrings.searchLinkActive}`);
  if (link) link.classList.remove(DOMStrings.searchLinkActive);
  // Add active link class
  const activeLink = document.querySelector(`.results__link[href*="#${id}"]`);
  if(activeLink) activeLink.classList.add(DOMStrings.searchLinkActive);
    
};

// Function to create the pagination button
const createButton = (page, type) => `
                    <button class="btn-inline results__btn--${type}" data-goto="${
  type === 'prev' ? page - 1 : page + 1
}">
                      <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                      <svg class="search__icon">
                          <use href="img/icons.svg#icon-triangle-${
                            type === 'prev' ? 'left' : 'right'
                          }"></use>
                      </svg>
                    </button>`;
// Function to render the pagination buttons
const renderButtons = (page, numResults, resPerPage) => {
  // Calculate all pages
  const pages = Math.ceil(numResults / resPerPage);
  let button = '';
  if (page === 1 && pages > 1) {
    // Only button to go next page
    button = createButton(page, 'next');
  } else if (page < pages) {
    // Both buttons
    button = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
    `;
  } else if (page === pages && page > 1) {
    // Only button to go next page
    button = createButton(page, 'prev');
  }

  DOM.searchResPages.insertAdjacentHTML('afterbegin', button);
};
// Function to clear the search input
export const clearInput = () => (DOM.searchInput.value = '');
// Function to clear the results list
export const clearResults = () => {
  DOM.searchResList.innerHTML = '';
  DOM.searchResPages.innerHTML = '';
};
