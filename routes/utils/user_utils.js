const DButils = require("./DButils");

async function addNewUser(username, password, first_name, last_name, email, country){
    await DButils.execQuery(`insert into users values ('${username}','${password}','${first_name}','${last_name}','${email}','${country}')`); 
}

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function getMyRecipes(userID){
    const my_recipes = await DButils.execQuery(`select recipe_id,recipeName,ingredients,instructions,vegan,glutenFree from my-recipes where user_id='${userID}'`);
    return my_recipes;


}
module.exports = {addNewUser, markAsFavorite, getFavoriteRecipes, getMyRecipes};
