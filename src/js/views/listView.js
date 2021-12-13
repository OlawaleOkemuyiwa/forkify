import { elements } from './base';

export const renderItem = item => { //we didnt loop over this.items array to get each item here bcos in the controller we will loop over recipe.ingredients array to call addItem() (which returns the created item) and we use each of these items as they're created  
    const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = id => {
    const item = document.querySelector(`li[data-itemid=${id}]`);  //select an element to be deleted using its id
    if (item) item.parentElement.removeChild(item);
};