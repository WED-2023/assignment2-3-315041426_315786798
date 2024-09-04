const DButils = require("./DButils");

async function markAsFavorite(userID, recipeID){
    await DButils.execQuery(`INSERT INTO favoriterecipes (userID, recipeID) VALUES ('${userID}',${recipeID})`);
}


async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipeID from FavoriteRecipes where userID='${user_id}'`);
    return recipes_id;
}

async function addRecipeToMyRecipes(userID, recipeName, ingredients, instructions, vegan, glutenFree){
    await DButils.execQuery(`INSERT INTO my_recipes (userID, recipeName, Ingredients, Instructions, vegan, glutenFree) VALUES ('${userID}','${recipeName}','${ingredients}','${instructions}','${vegan}','${glutenFree}')`);
}
async function getMyRecipes(userID){
    const my_recipes = await DButils.execQuery(`select recipeName,ingredients,instructions,vegan,glutenFree from my_recipes where userID='${userID}'`);
    return my_recipes;


}
module.exports = {addRecipeToMyRecipes ,markAsFavorite, getFavoriteRecipes, getMyRecipes};
S