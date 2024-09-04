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
    const my_recipes = await DButils.execQuery(`select recipeName,ingredients,instructions,vegan,glutenFree FROM my_recipes WHERE UserID='${userID}'`);
    return my_recipes;

}
async function get3LastViewedRecipes(userID){
    const last3ViewedRecipes = await DButils.execQuery(
    `SELECT recipe_id 
    FROM UserViewedRecipes 
    WHERE user_id = '${userID}' 
    ORDER BY viewed_at DESC 
    LIMIT 3;`);
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

module.exports = {get3LastViewedRecipes ,insertNewViewedRecipe,deleteOldViewedRecipes ,addRecipeToMyRecipes ,markAsFavorite, getFavoriteRecipes, getMyRecipes};