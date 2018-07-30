// Import the search model
import Search from './models/Search';
// Import the Recipe model
import Recipe from './models/Recipe';
import { DOM, renderLoader, clearLoader } from './views/base';
// Import the search view
import * as searchView from './views/searchView';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};
/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // Get query from view
  const query = searchView.getInput();

  if (query) {
    // New search object and add to state
    state.search = new Search(query);

    // Prepare UI for results
    // Clear the search input
    searchView.clearInput();
    // Clear the results list
    searchView.clearResults();
    // Render the loader
    renderLoader(DOM.searchRes);
    try {
      // Search for recipes
      await state.search.getResults();

      // Render results on UI
      // Hide the loader from the result
      clearLoader(DOM.searchRes);
      // Reander results
      searchView.renderResults(state.search.result);
    } catch (err) {
      console.log(err);
      alert('Something went wrong with search!');
    }
  }
};

DOM.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

DOM.searchResPages.addEventListener('click', function(e) {
  const btn = e.target.closest('.btn-inline');

  if (btn) {
    const page = btn.dataset.goto;
    searchView.clearResults();
    searchView.renderResults(state.search.result, +page);
  }
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
  const recipe = new Recipe();
  const id = window.location.hash.substr(1);

  if (id) {
    // Prepare UI for changes

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      
      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      // Render recipe

      console.log(state.recipe);
    } catch (err) {
      console.log(err);

      alert('Error processing recipe!');
    }
  }
};

window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);
