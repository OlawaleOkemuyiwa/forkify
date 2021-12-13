//we wish to represent the shopping list as an object. In this object, we push in items as objs(comprises count, unit and ingredient) into the items array
import uniqid from 'uniqid';

export default class List {
    constructor () {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };
        this.items.push(item); 
 
        return item;
    }

    deleteItem (id) { //id parameter here is the one extracted from the UI(gotten from uniqid when a new item is added)
        const index = this.items.findIndex(item => item.id === id);
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.items.find(item => item.id === id).count = newCount;
    }
}