import Search from "./models/Search";
import { DOM, renderLoader, clearLoader } from "./views/base";
import * as searchView from "./views/searchView";

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

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
    // Search for recipes
    await state.search.getResults();

    // Render results on UI
    // Hide the loader from the result
    clearLoader(DOM.searchRes);
    // Reander results
    searchView.renderResults(state.search.result);
  }
};

DOM.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});
