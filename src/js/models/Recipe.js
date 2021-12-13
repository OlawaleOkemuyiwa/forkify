import axios from 'axios'; //a default import, axios here can be a, axi, anything.

export default class Recipe {
    constructor (id) {
        this.id = id;
    }
    
    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            console.log(res); //a recipe obj with title, publisher etc
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            alert(error);
        }      
    } 

    calcTime() {
        //assuming for every 3 ingredients we spend 15 mins
        const numOfIng = this.ingredients.length;
        const periods = Math.ceil(numOfIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4; //assume for the given recipe ingredients from the api, we can get 4 servings
    } 

    parseIngredients() { //change each ingredient string in the ingredients array into {count, unit and the ingredients itself}
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        
        const units = [...unitsShort, 'kg', 'g'];
        
        const newIngredients = this.ingredients.map(el => { //el here is each ingredient in the ingredients array e.g "1 1/2 cups(small) of Garri"
            // 1) make the units uniform
            let ingredient = el.toLowerCase(); //convert each ingredient string to lower case and save in ingredient variable
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]); //replace elements of unitsLong in ingredient with elements of unitsShort
            });

            // 2) Remove parantheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); //replace any parantheses in the string with a space

            // 3) parse ingredients into count, unit, and ingredient description
            const arrayIngredient = ingredient.split(' '); //["1", "1/2", "cup", "garri"]
            const unitIndex = arrayIngredient.findIndex(cur => units.includes(cur)); //return the index of the 1st element that is presnt in unitsShort array

            let objIng;
            if (unitIndex > -1) {   //There is a unit, automatically we can assume the 1st (or maybe the 2nd) element is a number e.g [1, cup, of, garri] or [1, 1/2, cup, of, garri]
                const arrCount = arrayIngredient.slice(0, unitIndex); //["1"] or ["1-1/3"] or ["1", "1/2"]
                
                let count;
                if (arrCount.length === 1) {     //first element is a likely a number 
                    
                    if (parseInt(arrCount[0], 10)) {    //first element is a number
                        count = eval(arrayIngredient[0].replace('-', '+'));
                    } else { //first element is an empty string
                        count = 1;
                    }  

                } else {  //first, 2nd or more are numbers
                    count = eval(arrayIngredient.slice(0, unitIndex).join('+')); //eval("1+1/2") --> 1.5
                }

                objIng = {
                    count: count, //we could write just count,
                    unit: arrayIngredient[unitIndex],
                    ingredient: arrayIngredient.slice(unitIndex + 1).join(' ')
                };
                //console.log(typeof(count));

            } else if (parseInt(arrayIngredient[0], 10)) { //There is NO unit, but the first element is a number e.g 1 slice of bread
                objIng = {
                    count: parseInt(arrayIngredient[0], 10),
                    unit: '',
                    ingredient: arrayIngredient.slice(1).join(' ')                                            
                };

            } else if (unitIndex === -1) {   //There is NO unit present, the first element is not a number e.g semolina flour
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient: ingredient  //we could write just ingredient,
                };
            }
            
            return objIng; //return the value of the ingredient object after each iteration(push the values to the newIngredients array)
        });
        
        this.ingredients = newIngredients; //update this.ingredients from an array of strings to an array of objects5 after we've called parseIngredients method 
    }

    updateServings(type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings); //update the counts in each ingredient obj in the ingredients array
        })
        
        this.servings = newServings; //update the servings
    }
}
























