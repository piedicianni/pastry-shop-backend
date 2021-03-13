// ingredients utils
const removeDuplicateIngredients = ingredients => [...new Set(ingredients)];
const ingredientsId = ingredients => ingredients.map(ingredient => ingredient.id);
const ingredientsWithinRecipes = recipes => removeDuplicateIngredients(
    recipes.map(recipe => ingredientsId(recipe.ingredients)).flat()
);
const ingredientsDetails = (id, ingredientsList) => ingredientsList.find(ingredient => {
    if (String(ingredient._id) === String(id)) return ingredient;
});
const getIngredientsInfo = (ingredients, ingredientsList) => {
    return ingredients.map(ingredient => {
        return { ...ingredientsDetails(ingredient.id, ingredientsList), value: ingredient.value };
    });
};

// date utils
const numberOfDayBetweenTwoDate = (dateFrom, dateTo) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((dateFrom - dateTo) / oneDay));
};

module.exports = {
    ingredientsId,
    ingredientsWithinRecipes,
    getIngredientsInfo,
    numberOfDayBetweenTwoDate
};