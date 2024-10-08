const e = require("express");
const DButils = require("./DButils");

async function markAsFavorite(userID, recipeID){
    try{
         await DButils.execQuery(`INSERT INTO favoriterecipes (userID, recipeID) VALUES ('${userID}',${recipeID})`);
        }
    catch(error)
        {
        console.log(error);
        }
   
}

async function removeFavorite(userID, recipeID){

    const response = await DButils.execQuery(`DELETE FROM favoriterecipes WHERE userID='${userID}' AND recipeID=${recipeID}`);
    return response;
}

async function isRecipeInFavorites(userID, recipeID){
    const response = await DButils.execQuery(`SELECT * FROM favoriterecipes WHERE userID='${userID}' AND recipeID=${recipeID}`);
    return response.length > 0;
}

async function getFavoriteRecipesIDs(user_id){
    const queryResult = await DButils.execQuery(`select recipeID from FavoriteRecipes where userID='${user_id}'`);
    return queryResult.map((row) => row.recipeID); // return recipeIDs array
}

async function addRecipeToMyRecipes(userID, recipeName, ingredients, instructions, vegan, glutenFree, time_to_make){
    // convert the vegan and glutenFree from string to Integer, and arrays into JSONS.
    if (vegan === 'true' || vegan === true)
    {
        vegan = 1;
    }
    else{
        vegan = 0;
    }
    if (glutenFree === 'true' || glutenFree === true)
    {
        glutenFree = 1;
    }
    else{
        glutenFree = 0;
    }
    instructions = JSON.stringify(instructions);
    ingredients = JSON.stringify(ingredients);
    await DButils.execQuery(`INSERT INTO my_recipes (userID, recipeName, Ingredients, Instructions, vegan, glutenFree, time_to_make) VALUES ('${userID}','${recipeName}','${ingredients}','${instructions}','${vegan}','${glutenFree}','${time_to_make}')`);
}
async function getMyRecipes(userID){
    const my_recipes = await DButils.execQuery(`select RecipeID,recipeName,Ingredients,Instructions,vegan,glutenFree,time_to_make FROM my_recipes WHERE UserID='${userID}'`);
    return my_recipes;

}
async function get3LastViewedRecipes(userID){
    const queryResult = await DButils.execQuery(
    `SELECT recipe_id FROM userviewedrecipes WHERE user_id ='${userID}'`);
     const RecipesArray = queryResult.map((row) => row.recipe_id);
     return RecipesArray;
}

async function insertNewViewedRecipe(userID, recipeID){
    await DButils.execQuery(`INSERT INTO userviewedrecipes (user_id, recipe_id, viewed_at)
VALUES ('${userID}', '${recipeID}', CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE viewed_at = CURRENT_TIMESTAMP;
`);
}

async function deleteOldViewedRecipes(userID){
    await DButils.execQuery(
    `DELETE FROM UserViewedRecipes 
    WHERE user_id = ${userID} 
    AND recipe_id NOT IN (
        SELECT recipe_id 
        FROM (
            SELECT recipe_id 
            FROM UserViewedRecipes 
            WHERE user_id = ${userID} 
            ORDER BY viewed_at DESC 
            LIMIT 3
        ) AS temp
    );`);
}

module.exports = {get3LastViewedRecipes ,insertNewViewedRecipe,deleteOldViewedRecipes ,addRecipeToMyRecipes ,markAsFavorite,removeFavorite, getFavoriteRecipesIDs,isRecipeInFavorites, getMyRecipes};