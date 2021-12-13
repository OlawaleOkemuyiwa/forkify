import axios from 'axios';

export default class Search {
    constructor (query) {
        this.query = query;
    }

    async getResults() {
        //no need for api key or cors proxy here (crossorigin.me) 
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            //console.log(res);
            this.result = res.data.recipes; //an array containing 28 different recipes (each recipe in the array is an obj) based on the query(e.g pizza)
        } catch (error) {
            alert(error);
        }  
    };
}
