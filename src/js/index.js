import { DOM, renderLoader, clearLoader } from './views/base';
// Import the search model
import Search from './models/Search';
// Import the Recipe model
import Recipe from './models/Recipe';
// Import the List model
import List from './models/List';
// Import the Likes model
import Likes from './models/Likes';
// Import the search view
import * as searchView from './views/searchView';
// Import the recipe view
import * as recipeView from './views/recipeView';
// Import the recipe view
import * as listView from './views/listView';
// Import the likes view
import * as likesView from './views/likesView';

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
    recipeView.clearRecipe();
    renderLoader(DOM.recipe);
    // Highlight selected search item
    if (state.search) searchView.highlightSelected(id);
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
      clearLoader(DOM.recipe);
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      console.log(err);

      alert('Error processing recipe!');
    }
  }
};

window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);

/**
 * LIST CONTROLLER
 */

const controlList = () => {
  if (!state.list) state.list = new List();
  console.log(state.list);
  
  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

DOM.shopping.addEventListener('click', function(e) {
  const id = e.target.closest('.shopping__item').dataset.itemId;

  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from the state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    const value = parseFloat(e.target.value);
    state.list.updateCount(id, value);
  }
});

/**
 * LIKE CONTROLLER
 */

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    state.likes.persistData();
    // Toggle the like button
    likesView.toggleLikeBtn(true);

    // Add like to UI list
    likesView.renderLike(newLike);
  } else {
    // Remove like from the state
    state.likes.deleteLike(currentID);
    // Toggle the like button
    likesView.toggleLikeBtn(false);
    // Remove like from UI list
    likesView.deleteLike(currentID);
  }

  likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// Restore liked recipes on page load
window.addEventListener('load', function() {
  state.likes = new Likes();
  // Restore likes
  state.likes.readStorage();
  // Toggle the like menu
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  // Render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like, ));
});


DOM.recipe.addEventListener('click', function(e) {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updataServings(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updataServings(state.recipe);
  } else if (e.target.matches('.recipe__btn, .recipe__btn *')) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    controlLike();
  }
});
