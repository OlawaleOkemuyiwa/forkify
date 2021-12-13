import Search from './models/Search'; //the default export from Search.js is imported as Search. Only one default export is allowed from a module
import Recipe from './models/Recipe';  
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView'; //import all exported functions, variables from searView.js as methods, properties etc of searchView object
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base'; //how to import named export, we used named import when what we import from a module isnt so many e.g 2,3 imports

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - shoppping list object
 * - Liked recipes object
 */

const state = {};
console.log(state);
//The state obj is declared with const. Global variables declared with let and const are not stored as the property of the window object. Unlike global variables declared with var and global func declaration/expressions that are properties and methods of the window objects respectively. Classes too arent stored in the windows obj.
//window.state = state; //window is the global object of the browser and the state object is stored in it before localzhost was used to store this data towards the ending of the project. If we had declared the state using var, we wouldnt have needed to manually save the state object as a property of the window obj as done here


/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => { 
    // 1) Get the input search query
    const query = searchView.getInput(); //returns the value of the input field (the searched food)

    if (query) {
        // 2) Next search object and add it to state 
        state.search = new Search(query); //storing the new query obj as search in the global STATE obj

        // 3) Prepare UI for results (show a loading spinner, clearing input, clearing previous results etc)
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);
        
        try {
            // 4) Search for recipes
            await state.search.getResults(); //we await the call of an async method so that defines this.result property

            // 5) Display results on UI (only after we await/receive the results from the api)
            clearLoader();
            searchView.renderResults(state.search.result);              //result = recipe.data.recipes
        } catch (error) {
            alert('Something is wrong with the search');
            clearLoader();
        }   
    }
};

elements.searchForm.addEventListener('submit', event => { //we use submit on forms(this is trigerred if either an enter btn is pressed or when the search btn is clicked)
    event.preventDefault(); //to prevent the page from reloading after a form is submitted
    controlSearch();
});

elements.searchResPages.addEventListener('click', event => { //event.target returns the node element in the delegated container on which a click was performed 
    const btn = event.target.closest('.btn-inline')  //closest() tranverses up the event.target element to its parent and ancestor elements till it finds the nearest element that matches the provided selector string. We wish to select only the btn-inline, but there are some elements in it that we can also click on during event delegation. so we ensure its indeed the btn-inline that is selected
    //basically we want to select the element in the closest bracket, which must be the event.target element itself or its nearest parent/ancestor. If non exist, the method returns null 
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto); 
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);  //rendering result based on the page no clicked on
    }
});


/**
 * RECIPE CONTROLLER
 */

 const controlRecipe = async () => {
     //Get ID from URL
    const id = window.location.hash.replace('#', ''); //window.location is the entire URL

    if (id) {
        //Prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        //Create new recipe object
        state.recipe = new Recipe(id); //the recipe obj contains only this.id(harsh no) here as none of the methods use to assign new properties have not been called
        
        try {
            //Get recipe data and parse Ingredient
            await state.recipe.getRecipe();  //update the recipe obj with the defined properties in this method
            state.recipe.parseIngredients(); //update this.ingredients array of strings to an array of objects

            //calc servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe on UI
            clearLoader(elements.recipe);
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id)); //we have access to the state.likes through the localStorage value available on load
        } catch (error) {
            alert('Error processing recipe');
            console.log(error);
        }
    }
 };

// window.addEventListener('hashchange', controlRecipe); //window is the global object in javascript(the browser), calls the func when the hash no changes 
// window.addEventListener('load', controlRecipe); //calls the func when the page loads (and in this case with the hash no(maybe the page was bookmarked or sth earlier))
['hashchange', 'load'].forEach(el => window.addEventListener(el, controlRecipe)) //call the func whenever we change the hash in the browser(by clicking on another recipe with a different hash no) or when we load the URL containing the hash no

//Handling recipe button clicks 
elements.recipe.addEventListener('click', event => { //we cant use closest here cause there are more than one thing we might want to potentially select
    if (event.target.matches('.btn-decrease, .btn-decrease *')) { //.matches return true or false if our target element matches that of the provided class, then execute the code in the if bock
        //Decrease servings button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        //Increase servings button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Add ingredients to shopping list
        controlList();
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        //Add recipe to likes list
        controlLike();
    }
}); 


/**
 * LIST CONTROLLER
 */

const  controlList = () => {
    //Only create a list if there is none yet, because its possible to create more than one list object(i.e a list from click a recipe, then opening another recipe then clicking to open another list) 
    if (!state.list) state.list = new List(); 

    //Add each ingredient to the list and render one after the other
    state.recipe.ingredients.forEach(ing => {
        const item = state.list.addItem(ing.count, ing.unit, ing.ingredient);
    });
};

//Handling delete and update list items events after items list has been rendered
elements.shopping.addEventListener('click', event => {
    //Get the id string (generated from uniqid) of the item to be deleted 
    const id = event.target.closest('.shopping__item').dataset.itemid; 

    //Handle the delete button 
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {//delete only if we re clicking on delete button/the elements in it
        //Delete from state 
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);

    //Handle the count update in the data model
    } else if (event.target.matches('.shopping__count-value')) {
        //console.log(event.target)
        const val = parseFloat(event.target.value, 10);  //parseFloat converts strings to floating no e.g '5.50' to 5.50 unlike parseInt which converts to interger 5
        state.list.updateCount(id, val);  //event.target here is the value of the each new step when the increase or decrease button is hit
    }

});


/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();

    const recipeID = state.recipe.id;

    //the current recipe hasnt being liked
    if (!state.likes.isLiked(recipeID)) {               
        //Add liked recipe to the state (likes array)
        const newLike = state.likes.addLike( //addLike returns a newly added like and we save it in newLike variable
            recipeID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //Toggle the like button 
        likesView.toggleLikeBtn(true);

        //Add liked recipe to UI list
        likesView.renderLike(newLike);    
    
    //the current recipe is already liked 
    } else {                                   
        //Remove liked recipe from the state (likes array)
        state.likes.deleteLike(recipeID);

        //Toggle the like button 
        likesView.toggleLikeBtn(false);

        //Remove liked recipe from UI list
        likesView.deleteLike(recipeID);  
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes()); //to make the likesMenu button visible or invisible depending on if any recipe has been liked or not
};

//Restore liked recipe on page load (local storage)
window.addEventListener('load', () => {
    state.likes = new Likes();          //this.like would be an empty array here

    // Restore likes from local storage 
    state.likes.readStorage();          //this.like is now be equal to the stored likes array in the local storage 

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing item(s)
    state.likes.likes.forEach(like => likesView.renderLike(like));
});






