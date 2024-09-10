var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here at /recipes!"));

/**
 * This path is for searching a recipe
 */
router.get("/search", async (req, res, next) => {
  try {
    const searchQuery = req.body.searchQuery;
    const cuisinesArray = req.body.cuisinesArray || [];
    const dietsArray = req.body.dietsArray || [];
    const intolerancesArray = req.body.intolerancesArray || [];
    const number = req.body.number || 2;
    const results = await recipes_utils.searchRecipe(searchQuery, cuisinesArray, dietsArray, intolerancesArray, number);
    res.send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a random recipes
 */

router.get("/random", async (req, res, next) => {
  try {
    const number = req.query.number || 3;
    const results = await recipes_utils.getRandomRecipes(number);
    res.send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */

router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
