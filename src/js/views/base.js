export const DOM = {};

DOM.searchInput = $('.search__field');
DOM.searchForm = $('.search');
DOM.searchResList = $('.results__list');

// Function to select DOM elements
function $(selector) {
  return document.querySelector(selector);
}