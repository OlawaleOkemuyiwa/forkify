export default class Likes {
    constructor () {
        this.likes = [];
    } 

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        //Persist data in local storage i.e set the "likes" item of the local storage as this.likes array whenever a new item is added to the array
        this.peristData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);  

        //Persist data in local storage i.e set the "likes" item of the local storage as this.likes array whenever a new item is deleted from the array
        this.peristData();
    }

    isLiked(id) { //return true if the recipe is already liked, false if otherwise
        //return this.likes.findIndex(el => el.id === id) !== -1; OLD WAY
        return this.likes.some(el => el.id === id);  //some method returns true if any of the elements of the array satisfies the condition in the callback fnc or returns false if none does. In this case it would return true if there is any element of the likes array with its id === id we're checking (i.e it is already in the liked array cause its being liked)
    }

    getNumLikes() { //to no if any recipe has been liked, in order to have the heart icon filled or not
        return this.likes.length;
    }

    peristData() { //to store the this.likes array into localStorage everytime the method is called
        localStorage.setItem('likes', JSON.stringify(this.likes)); //a string must be passed in as the value of localStorage property, so we convert the likes array into a string.
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes')); //JSON.parse() converts the string back to an array (it is synchronous that parses a string and returns a js object i.e object here is the likes array) 

        //Restoring likes array from the localstorage (this.likes = storage) only if 'likes' key is not null(i.e no liked item, this.like empty)
        if (storage) this.likes = storage;  
    }
}