import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => { //used in recipe controller but created in the searchView beacuse this DOM manipulation occurs on the searchView
    const resultsNodelist = document.querySelectorAll('.results__link'); 
    resultsNodelist.forEach(el => {
        el.classList.remove('results__link--active')
    }); //removing active class from all .results__link elements

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active'); //to highlight each one of them we have to use their specific ids to select them, thats why we selected with a[href] here
};

//type: 'prev' or 'next' to create the actual btns clicked on
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;
    
const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);  //to know how many pages there would be, we the total number of results to be displayed and the amount of result to br displayed by page. E.g if we have 30 results and 10 should be displayed by page, then we would need 30/10 === 3 pages

    let button;
    if (page === 1 && pages > 1) { //if we are in page 1 amd their are more than 1 page to be dsiplayed
        // render only the next button
        button = createButton(page, 'next');
    } else if (page > 1 && page < pages) { 
        //render both prev and next buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        //render only prev button
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};


// "Pasta with tomato and spinach" -> ['pasta', 'with', 'tomato', 'and' 'pasta']
export const limitRecipeTitle = (title, titleLimit = 17) => { //title argument to be passed in here is a string, string also have the .length property and titleLimit is the no of chararacters we wish to limit the title to
    const newTitle = [];
    let newTitleJoined;
    if (title.length > titleLimit) {
        title.split(' ').reduce((acc, el) => {  //reduce method receives two parameters: the reducer callback function and the initial value of the accumulator
            if (acc + el.length <= titleLimit) { 
                newTitle.push(el);
            }
            return acc + el.length;  //the returned value from the reducer callback func after each iteration is the value of the accumulator for the next iteration
        }, 0); // Initial value here is set to 0, which is the value of accumulator for the 1st iteration of the loop. If no I.V is set, the accumulator for the 1st iteration would be the first element in the array and the currentElement for that iteration would be the second element of the array

        //return the result
        newTitleJoined = newTitle.join(' ');
        return `${newTitleJoined} ...` //join is the exact opposite of split (joins elements in an arrray into a string seperated by ('whatever is here'))
    }

    return title; //return title as it is if the length is already less than the limit we to set it to

    //since we are returning a value in the if block when the condition is met(also stopping the execution of the function), therefore its redundant to put the else statement in order to return title because surely when the if condition isnt met, the title will then be returned.
};

const renderRecipe = recipe => { //recipe here is each recipe obj in the recipes array that we're looping over
    const listItem = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML("beforeend", listItem);
};

export const renderResults = (recipeArray, page = 1, resPerPage = 10) => { //recipeArray is an array that contains 28 recipes(state.search.result)
    //render results per page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipeArray.slice(start, end).forEach(renderRecipe);    //or  (el => renderRecipes(el)) [quite redudant, just showing this can be done this way]

    //render Button
    renderButtons(page, recipeArray.length, resPerPage);
};

