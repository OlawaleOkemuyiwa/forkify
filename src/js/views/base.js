export const elements = { //we can only down select DOM elements that are on the page when the page loads and JS is parsed
    searchInput: document.querySelector('.search__field'),
    searchForm: document.querySelector('.search'),
    searchResList: document.querySelector('.results__list'),
    searchResult: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list'),
    searchBtn: document.querySelector('.search__btn')
};

const elementString = {
    loader: 'loader'
};

export const renderLoader = parent => { //Render the loader HTML depending on what its parent is. It is needed more than once with different parents(for results and for recipe)
    const loader = `
        <div class="${elementString.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementString.loader}`); //we cant use elements.loader cause that means we are prematurely selecting an element which isnt on the page on the time of loading the page. So we have to select its DOM only after the element has been rendered on the page 
    if(loader) {
        loader.parentNode.removeChild(loader);
    }
};