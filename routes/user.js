var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");
const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT userID FROM users").then((users) => {
      if (users.find((x) => x.userID === req.session.user_id)) { 
        req.user_id = req.session.user_id;
        next();
      } else {
        res.sendStatus(401);
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipe_id;
    await user_utils.markAsFavorite(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipesIDsArray = await user_utils.getFavoriteRecipesIDs(user_id);
    const FavoriteRecipes = await recipe_utils.getRecipesBulk(recipesIDsArray);
    res.status(200).send(FavoriteRecipes);
  } catch(error){
    next(error); 
  }
});

router.post('/my-recipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_name = req.body.recipe_name;
    const ingredients = JSON.stringify(req.body.ingredients);
    const instructions = JSON.stringify(req.body.instructions);
    const vegan = req.body.vegan;
    const gluten_free = req.body.gluten_free;
    await user_utils.addRecipeToMyRecipes(user_id, recipe_name, ingredients, instructions, vegan, gluten_free);
    res.status(200).send("The Recipe successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

router.get('/my-recipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const my_recipes = await user_utils.getMyRecipes(user_id);
    res.status(200).send(my_recipes);
  } catch(error){
    next(error); 
  }
});

router.get('/last-viewed', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    console.log("the user id is: " + user_id);
    const RecipesIDsArray = await user_utils.get3LastViewedRecipes(user_id);
    const LastViewedRecipes = await recipe_utils.getRecipesBulk(RecipesIDsArray);
    res.status(200).send(LastViewedRecipes);
  }
  catch(error){
    next(error);
  }
});

router.post('/last-viewed', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipe_id;
     await user_utils.insertNewViewedRecipe(user_id,recipe_id);
     await user_utils.deleteOldViewedRecipes(user_id);
    res.status(200).send({message: "New Recipe Viewed", success: true});
  }
  catch(error){
  next(error);
  }
});




 
module.exports = router;
