// ============================================================================
// RecipeJS - Functional Cooking Companion
// A functional programming approach to recipe management
// ============================================================================

// Sample Recipe Data
const recipes = [
  {
    id: 1,
    name: 'Pasta Carbonara',
    cuisine: 'Italian',
    difficulty: 'Medium',
    time: 20,
    ingredients: ['Pasta', 'Eggs', 'Bacon', 'Parmesan', 'Black Pepper'],
    instructions: 'Cook pasta, fry bacon, mix eggs and cheese, combine all.'
  },
  {
    id: 2,
    name: 'Chicken Stir-Fry',
    cuisine: 'Asian',
    difficulty: 'Easy',
    time: 15,
    ingredients: ['Chicken', 'Bell Peppers', 'Soy Sauce', 'Garlic', 'Ginger'],
    instructions: 'Dice chicken, stir-fry with vegetables and sauce.'
  },
  {
    id: 3,
    name: 'Vegetable Soup',
    cuisine: 'International',
    difficulty: 'Easy',
    time: 30,
    ingredients: ['Carrots', 'Celery', 'Onions', 'Tomatoes', 'Broth'],
    instructions: 'Chop vegetables, simmer in broth for 30 minutes.'
  },
  {
    id: 4,
    name: 'Tiramisu',
    cuisine: 'Italian',
    difficulty: 'Hard',
    time: 120,
    ingredients: ['Mascarpone', 'Eggs', 'Coffee', 'Ladyfingers', 'Cocoa'],
    instructions: 'Layer mascarpone cream and dipped ladyfingers, chill.'
  }
];

// ============================================================================
// Pure Utility Functions (Functional Programming)
// ============================================================================

/**
 * Filter recipes by difficulty level
 * @param {string} level - 'Easy', 'Medium', or 'Hard'
 * @returns {function} Filtering function
 */
const filterByDifficulty = (level) => (recipe) => recipe.difficulty === level;

/**
 * Filter recipes by maximum preparation time
 * @param {number} minutes - Maximum time in minutes
 * @returns {function} Filtering function
 */
const filterByTime = (minutes) => (recipe) => recipe.time <= minutes;

/**
 * Filter recipes by cuisine
 * @param {string} cuisine - Cuisine type
 * @returns {function} Filtering function
 */
const filterByCuisine = (cuisine) => (recipe) => recipe.cuisine === cuisine;

/**
 * Sort recipes by a given property
 * @param {string} prop - Property to sort by
 * @returns {function} Sorting function
 */
const sortBy = (prop) => (a, b) => {
  if (typeof a[prop] === 'string') {
    return a[prop].localeCompare(b[prop]);
  }
  return a[prop] - b[prop];
};

/**
 * Compose multiple filter functions
 * @param {...functions} filters - Filter functions to compose
 * @returns {function} Combined filter function
 */
const compose = (...filters) => (recipe) =>
  filters.every(filter => filter(recipe));

/**
 * Pipe functions left to right
 * @param {*} value - Initial value
 * @param {...functions} fns - Functions to apply
 * @returns {*} Result after applying all functions
 */
const pipe = (value, ...fns) =>
  fns.reduce((acc, fn) => fn(acc), value);

// ============================================================================
// DOM Manipulation Functions
// ============================================================================

/**
 * Create a recipe card HTML element
 * @param {object} recipe - Recipe object
 * @returns {string} HTML string
 */
const createRecipeCard = (recipe) => `
  <div class="recipe-card">
    <div class="recipe-header">
      <h2>${recipe.name}</h2>
      <span class="cuisine-badge">${recipe.cuisine}</span>
    </div>
    <div class="recipe-meta">
      <span class="difficulty ${recipe.difficulty.toLowerCase()}">${recipe.difficulty}</span>
      <span class="time">⏱️ ${recipe.time} min</span>
    </div>
    <div class="recipe-content">
      <h3>Ingredients:</h3>
      <ul>
        ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
      </ul>
      <h3>Instructions:</h3>
      <p>${recipe.instructions}</p>
    </div>
  </div>
`;

/**
 * Render recipes to the DOM
 * @param {array} recipesToRender - Array of recipes to display
 */
const renderRecipes = (recipesToRender) => {
  const container = document.getElementById('recipe-container');
  const html = recipesToRender
    .map(createRecipeCard)
    .join('');
  container.innerHTML = html;
};

/**
 * Display recipes with optional filtering and sorting
 * @param {array} data - Recipes array
 * @param {object} options - Filter and sort options
 */
const displayRecipes = (data, options = {}) => {
  const {
    difficulty = null,
    maxTime = null,
    cuisine = null,
    sortProperty = 'name'
  } = options;

  const filters = [];
  if (difficulty) filters.push(filterByDifficulty(difficulty));
  if (maxTime) filters.push(filterByTime(maxTime));
  if (cuisine) filters.push(filterByCuisine(cuisine));

  const filtered = filters.length > 0
    ? data.filter(compose(...filters))
    : data;

  const sorted = filtered.sort(sortBy(sortProperty));

  renderRecipes(sorted);
};

/**
 * Search recipes by name or ingredient
 * @param {string} query - Search query
 * @returns {function} Filter function
 */
const searchRecipes = (query) => (recipe) => {
  const lowerQuery = query.toLowerCase();
  return (
    recipe.name.toLowerCase().includes(lowerQuery) ||
    recipe.ingredients.some(ing => ing.toLowerCase().includes(lowerQuery))
  );
};

// ============================================================================
// Event Handlers
// ============================================================================

/**
 * Initialize event listeners
 */
const initializeEventListeners = () => {
  // Document ready handler
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
};

/**
 * Main initialization function
 */
const initialize = () => {
  // Display all recipes on initial load
  displayRecipes(recipes);

  // Example: Display easy recipes
  console.log('Easy Recipes:', recipes.filter(filterByDifficulty('Easy')));

  // Example: Display recipes under 20 minutes
  console.log('Quick Recipes (under 20 min):', recipes.filter(filterByTime(20)));

  // Example: Search for recipes with 'Chicken'
  const chickenRecipes = recipes.filter(searchRecipes('Chicken'));
  console.log('Chicken Recipes:', chickenRecipes);
};

// ============================================================================
// Public API
// ============================================================================

window.RecipeApp = {
  displayRecipes,
  filterByDifficulty,
  filterByTime,
  filterByCuisine,
  searchRecipes,
  sortBy,
  compose,
  pipe,
  recipes
};

// Initialize the app
initializeEventListeners();

