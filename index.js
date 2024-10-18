
document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();
    const API_KEY = "TgEWQqGv2se7aC9tbNK5M4wWCasX4ZNu1JzYzSlY6Xg";
    const BASE_URL = `https://api.openbrewerydb.org/breweries`;
    
    const API_URL = "http://localhost:3000/recipes";
    const mealsLists = document.querySelector(".meals-lists");
    const form = document.querySelector("#recipe-form"); // Form for creating/updating
    const nameInput = document.querySelector("#recipe-name");
    const imageInput = document.querySelector("#recipe-image");
    const instructionsInput = document.querySelector("#recipe-instructions");

    // Fetch and Display All Recipes
    function getMeals() {
        fetch(API_URL)
            .then((r) => r.json())
            .then((data) => data.forEach((meals) => displayMeal(meals)));
    }

    // Helper function to create and display a meal
    function displayMeal(meals) {
        const meal = document.createElement("div");
        meal.classList.add("meal-container");
        meal.innerHTML = `
            <img src="${meals.image}" alt="" class="meal">
            <span class="mealname">${meals.name}</span>
            <button class="show">View Recipe</button>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        `;

        // View Recipe Details
        meal.querySelector(".show").addEventListener("click", () => viewRecipe(meals.id));

        // Edit Recipe
        meal.querySelector(".edit").addEventListener("click", () => openEditForm(meals));

        // Delete Recipe
        meal.querySelector(".delete").addEventListener("click", () => deleteRecipe(meals.id));

        mealsLists.appendChild(meal);
    }

    // Function to View Recipe Details
    function viewRecipe(id) {
        fetch(`${API_URL}/${id}`)
            .then((r) => r.json())
            .then((data) => {
                const instraction = document.createElement("div");
                instraction.classList.add("intractions");
                instraction.innerHTML = `
                    <div class="mealnamecd">${data.name}</div>
                    <div class="instruction">
                        <h1>Instructions:</h1>
                        <p>${data.instructions}</p>
                    </div>
                `;
                document.body.appendChild(instraction);
                document.body.addEventListener("click", () => instraction.remove(), { once: true });
            });
    }

    // Create New Recipe (POST)
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const newRecipe = {
            name: nameInput.value,
            image: imageInput.value,
            instructions: instructionsInput.value,
        };

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRecipe),
        })
            .then((r) => r.json())
            .then((data) => {
                displayMeal(data);
                form.reset();
            });
    });

    // Open Edit Form with Recipe Data
    function openEditForm(meal) {
        nameInput.value = meal.name;
        imageInput.value = meal.image;
        instructionsInput.value = meal.instructions;
        form.dataset.id = meal.id; // Store the recipe ID in the form
    }

    // Update Recipe (PUT/PATCH)
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = form.dataset.id;
        const updatedRecipe = {
            name: nameInput.value,
            image: imageInput.value,
            instructions: instructionsInput.value,
        };

        const method = id ? "PATCH" : "POST"; // If ID exists, PATCH; otherwise, POST

        fetch(`${API_URL}/${id || ""}`, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedRecipe),
        })
            .then((r) => r.json())
            .then((data) => {
                if (id) {
                    mealsLists.innerHTML = ""; // Clear and re-render meals
                    getMeals();
                } else {
                    displayMeal(data); // Add new meal
                }
                form.reset();
                delete form.dataset.id; // Clear the stored ID
            });
    });

    // Delete Recipe (DELETE)
    function deleteRecipe(id) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => {
                mealsLists.innerHTML = ""; // Clear and re-render meals
                getMeals();
            });
    }

    // Initial Fetch of Meals
    getMeals();
});
