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

const priceFloat = (price, currency) => parseFloat(price.split(currency)[0]);
const percentageOnSale = (daysOnSale) => {
    const mapOnSalePercentage = {
        0: 100,
        1: 100,
        2: 80,
        3: 20
    };
    return !mapOnSalePercentage[daysOnSale] ? 0 : mapOnSalePercentage[daysOnSale];
}
const priceAccordingDaysOnSale = (fullPrice, daysOnSale = 1, currency = '€') => {
    const priceAdapted = (priceFloat(fullPrice, currency) / 100) * percentageOnSale(daysOnSale);
    return priceAdapted > 0 ? `${priceAdapted}${currency}` : 0;
};

// date utils
const numberOfDayBetweenTwoDate = (dateFrom, dateTo = new Date()) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((dateFrom - dateTo) / oneDay));
};

module.exports = {
    ingredientsId,
    ingredientsWithinRecipes,
    getIngredientsInfo,
    priceAccordingDaysOnSale,
    numberOfDayBetweenTwoDate
};