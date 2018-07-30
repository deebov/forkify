// DOM elements
export const DOM = {};

DOM.searchInput = $('.search__field');
DOM.searchForm = $('.search');
DOM.searchRes = $('.results');
DOM.searchResList = $('.results__list');
DOM.searchResPages = $('.results__pages');
DOM.recipe = $('.recipe');

// DOM strings
export const DOMStrings = {};

DOMStrings.loader = 'loader';
DOMStrings.searchLink = 'results__link';
DOMStrings.searchLinkActive = 'results__link--active';

// Function to select DOM elements
function $(selector) {
  return document.querySelector(selector);
}

// Function to render the loader
export const renderLoader = parent => {
  const loader = `    
          <div class="${DOMStrings.loader}">
            <svg>
                <use xlink:href="img/icons.svg#icon-cw"></use>
            </svg>
          </div>`;

  parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = parent => {
  const loader = parent.querySelector(`.${DOMStrings.loader}`);

  if (loader) parent.removeChild(loader);
};
