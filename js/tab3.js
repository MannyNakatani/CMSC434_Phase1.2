
const recipeQuery = document.getElementById("recipe-query");
const recipeFilter = document.getElementById("recipe-filter");

const expiringRecipes = document.getElementById("expiring-recipes");
const favoriteRecipes = document.getElementById("favorite-recipes");
const allRecipes = document.getElementById("all-recipes");
const recipeEmpty = document.getElementById("recipe-empty");

//all the elements for the recipe form to add new ones manually
const openRecipeForm = document.getElementById("open-recipe-form");
const closeRecipeForm = document.getElementById("close-recipe-form");
const recipeModal = document.getElementById("recipe-modal");
const addRecipeForm = document.getElementById("add-recipe-form");
const newRecipeName = document.getElementById("new-recipe-name");
const newRecipeIngredients = document.getElementById("new-recipe-ingredients");
const newRecipeTime = document.getElementById("new-recipe-time");
const recipeFormError = document.getElementById("recipe-form-error");

//example recipe data
//available represents whether an ingredient is in the fridge
//expiringDays is null if the ingredient is not expiring soon
const recipes = [
    {
        id: 1,
        name: "Chicken Stir-Fry",
        time: 25,
        favorite: true,
        ingredients: [
            { name: "Chicken", available: true, expiringDays: 2 },
            { name: "Rice", available: true, expiringDays: null },
            { name: "Broccoli", available: true, expiringDays: 1 },
            { name: "Soy Sauce", available: false, expiringDays: null }
        ]
    },

    {
        id: 2,
        name: "Pancakes",
        time: 20,
        favorite: false,
        ingredients: [
            { name: "Flour", available: true, expiringDays: null },
            { name: "Milk", available: true, expiringDays: 4 },
            { name: "Eggs", available: true, expiringDays: null }
        ]
    },
    
    {
        id: 3,
        name: "Grilled Cheese",
        time: 10,
        favorite: false,
        ingredients: [
            { name: "Bread", available: true, expiringDays: null },
            { name: "Cheese", available: true, expiringDays: null },
            { name: "Butter", available: false, expiringDays: null }
        ]
    },

    {
        id: 4,
        name: "Green Eggs and Ham",
        time: 30,
        favorite: false,
        ingredients: [
            { name: "Eggs", available: true, expiringDays: null },
            { name: "Ham", available: true, expiringDays: null },
            { name: "Sauce", available: false, expiringDays: 4 }
        ]
    }
];

//create a recipe card which holds the contents of a recipe 
function createRecipeCard(recipe) {
    const card = document.createElement("article");
    card.className = "recipe-card";

    const heading = document.createElement("div");
    heading.className = "recipe-heading";

    const title = document.createElement("h3");
    title.textContent = recipe.name;

    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";
    favoriteButton.className = "favorite-button";

    if (recipe.favorite) {
        favoriteButton.classList.add("is-favorite");
    }

    favoriteButton.textContent = recipe.favorite ? "★" : "☆";
    favoriteButton.setAttribute(
        "aria-label",
        recipe.favorite
            ? "Remove " + recipe.name + " from favorites"
            : "Add " + recipe.name + " to favorites"
    );
    favoriteButton.setAttribute(
        "aria-pressed",
        String(recipe.favorite)
    );
    favoriteButton.dataset.recipeId = recipe.id;

    heading.append(title, favoriteButton);

    const time = document.createElement("p");
    time.className = "recipe-time";
    time.textContent = "Cooking time: " + recipe.time + " min";

    const ingredientsHeading = document.createElement("strong");
    ingredientsHeading.textContent = "Ingredients:";

    const ingredientList = document.createElement("ul");
    ingredientList.className = "recipe-ingredients";

    let availableCount = 0;

    recipe.ingredients.forEach(function (ingredient) {
        const li = document.createElement("li");

        if (ingredient.available) {
            availableCount++;
        }

        const ingredientName = document.createElement("span");
        ingredientName.textContent = ingredient.name;

        if (ingredient.expiringDays !== null) {
            ingredientName.className = "ingredient-expiring";

            const expiry = document.createElement("span");
            expiry.className = "days-left";

            const dayText =
                ingredient.expiringDays === 1 ? "day" : "days";

            expiry.textContent =
                " (Expiring in " +
                ingredient.expiringDays +
                " " + dayText + ")";

            ingredientName.appendChild(expiry);
        }

        li.appendChild(ingredientName);
        ingredientList.appendChild(li);
    });

    const availability = document.createElement("p");
    availability.className = "recipe-availability";
    availability.textContent =
        "In fridge: " + availableCount +
        " of " + recipe.ingredients.length + " ingredients";

    card.append(
        heading,
        time,
        ingredientsHeading,
        ingredientList,
        availability
    );

    return card;
}

//adding a recipe to a grouping 
function renderRecipeSection(container, recipeArray) {
    container.innerHTML = "";

    recipeArray.forEach(function (recipe) {
        container.appendChild(createRecipeCard(recipe));
    });
}

//search and filter the recipes, then divide them into sections
function renderRecipes() {
    const query = recipeQuery.value.trim().toLowerCase();
    const filter = recipeFilter.value;

    const matchingRecipes = recipes.filter(function (recipe) {
        const matchesName = recipe.name.toLowerCase().includes(query);

        const matchesFilter =
            filter === "all" ||
            (filter === "favorites" && recipe.favorite) ||
            (filter === "expiring" &&
                recipe.ingredients.some(function (ingredient) {
                    return ingredient.expiringDays !== null;
                }));

        return matchesName && matchesFilter;
    });

    const useSoon = matchingRecipes.filter(function (recipe) {
        return recipe.ingredients.some(function (ingredient) {
            return ingredient.expiringDays !== null;
        });
    });

    const favorites = matchingRecipes.filter(function (recipe) {
        return recipe.favorite &&
            !useSoon.some(function (expiringRecipe) {
                return expiringRecipe.id === recipe.id;
            });
    });

    const otherRecipes = matchingRecipes.filter(function (recipe) {
        return !recipe.favorite &&
            !useSoon.some(function (expiringRecipe) {
                return expiringRecipe.id === recipe.id;
            });
    });

    renderRecipeSection(expiringRecipes, useSoon);
    renderRecipeSection(favoriteRecipes, favorites);
    renderRecipeSection(allRecipes, otherRecipes);

    //hide section headings when their section has no recipes
    document.getElementById("expiring-section").hidden =
        useSoon.length === 0;

    document.getElementById("favorites-section").hidden =
        favorites.length === 0;

    document.getElementById("all-section").hidden =
        otherRecipes.length === 0;

    recipeEmpty.hidden = matchingRecipes.length !== 0;
}

//update the screen whenever the search or filter changes
recipeQuery.addEventListener("input", renderRecipes);
recipeFilter.addEventListener("change", renderRecipes);

//handle favorite buttons functionality
document.getElementById("recipe-results").addEventListener(
    "click",
    function (event) {
        const button = event.target.closest(".favorite-button");

        if (!button) return;

        const recipeId = Number(button.dataset.recipeId);

        const recipe = recipes.find(function (item) {
            return item.id === recipeId;
        });

        if (!recipe) return;

        recipe.favorite = !recipe.favorite;
        renderRecipes();
    }
);

//display the example
renderRecipes();

//opening the pop up for adding recipes form
openRecipeForm.addEventListener("click", function () {
    recipeModal.hidden = false;
    newRecipeName.focus();
});

//close and clear form
function closeRecipeModal() {
    recipeModal.hidden = true;
    addRecipeForm.reset();
    recipeFormError.textContent = "";
}

closeRecipeForm.addEventListener("click", closeRecipeModal);

//add the recipe to the list of recipes upon submission
addRecipeForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = newRecipeName.value.trim();
    const ingredientText = newRecipeIngredients.value.trim();
    const time = Number(newRecipeTime.value);

    //name validation
    if (!name) {
        recipeFormError.textContent = "Enter a recipe name";
        newRecipeName.focus();
        return;
    }

    //mandatory inclusion of ingredients
    if (!ingredientText) {
        recipeFormError.textContent = "Enter at least one ingredient";
        newRecipeIngredients.focus();
        return;
    }

    //input validation for time being only numbers
    if (!newRecipeTime.value || !Number.isInteger(time) || time < 1) {
        recipeFormError.textContent =
            "Cooking time must be a positive whole number";
        newRecipeTime.focus();
        return;
    }

    //convert the list of ingredients separated by comma into an array
    const ingredientNames = ingredientText.split(",");

    const ingredients = ingredientNames
        .map(function (ingredient) {
            return ingredient.trim();
        })
        .filter(function (ingredient) {
            return ingredient.length > 0;
        });

    if (ingredients.length === 0) {
        recipeFormError.textContent = "Enter at least one ingredient";
        newRecipeIngredients.focus();
        return;
    }

    //create the new recipe
    const newRecipe = {
        id: Date.now(),
        name: name,
        time: time,
        favorite: false,

        ingredients: ingredients.map(function (ingredient) {
            return {
                name: ingredient,
                available: false,
                expiringDays: null
            };
        })
    };

    //add the new recipe to list of existing ones
    recipes.push(newRecipe);

    //refresh the recipe screen
    renderRecipes();

    //close the form and clear for another use
    closeRecipeModal();
});

