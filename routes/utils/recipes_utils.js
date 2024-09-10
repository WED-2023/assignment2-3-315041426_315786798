const axios = require("axios");
const { get } = require("http");
const api_domain = "https://api.spoonacular.com/recipes";


/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}

async function searchRecipe(searchQuery, cuisinesArray, dietsArray, intolerancesArray, number) {
    const cuisines = cuisinesArray.join(',');
    const diets = dietsArray.join(',');
    const intolerances = intolerancesArray.join(',');
    const response = await axios.get(`${api_domain}/complexSearch`, {
        params: {
            query: searchQuery,
            cuisine: cuisines,
            diet: diets,
            intolerances: intolerances,
            number: number,
            addRecipeInstructions: true,
            addRecipeInformation: true,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response.data.results;
}

async function getRandomRecipes(number) {
    const response = await axios.get(`${api_domain}/random`, {
        params: {
            number: number,
            apiKey: process.env.spooncular_apiKey // Ensure this matches your .env variable name
        }
    });
    return response.data;

}

async function getRecipesBulk(array_of_ids) {
    const ids_string = array_of_ids.join(',');
    const response = await axios.get(`${api_domain}/informationBulk`, {
        params: {
            ids: ids_string,
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response.data;
}




module.exports = {getRecipeDetails, searchRecipe, getRandomRecipes, getRecipesBulk};



