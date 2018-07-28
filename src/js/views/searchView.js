import { DOM } from "./base";
// Function to get the search input value
export const getInput = () => DOM.searchInput.value;
// Function to truncate a recipe title
const trunc = (str, limit) => {
  if (str.length > limit) {
    return str.slice(0, limit > 3 ? limit-3 : limit) + '...';
  }
  return str;
}
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
              <h4 class="results__name">${trunc(recipe.title, 25)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
    </li>`;
  // Insert the markup to the results list
  DOM.searchResList.insertAdjacentHTML("beforeend", markup);
};
// Function to render results
export const renderResults = results => {
  for (let recipe of results) {
    renderRecipe(recipe);
  }
};
// Function to clear the search input
export const clearInput = () => DOM.searchInput.value = '';
// Function to clear the results list
export const clearResults = () => DOM.searchResList.innerHTML = '';
