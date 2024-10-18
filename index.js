document.addEventListener("DOMContentLoaded", (e)=>{
    e.preventDefault();
    const API_KEY = "TgEWQqGv2se7aC9tbNK5M4wWCasX4ZNu1JzYzSlY6Xg"
    const BASE_URL=`https://api.openbrewerydb.org/breweries`;
    
    const mealsLists = document.querySelector(".meals-lists");
    function getMeals(){
        fetch("http://localhost:3000/recipes")
        .then((r) => r.json())
        .then((data) => data.forEach(meals => {
            const meal = document.createElement("div");
            meal.classList.add("meal-container");
            meal.innerHTML = `
                    <img src="${meals.image}" alt="" class="meal">
                    <span class="mealname">${meals.name}</span>
                    <button class="show" id="view">View Recipe</button>
                `
            meal.querySelector(".show").addEventListener("click",()=>{
                fetch(`http://localhost:3000/recipes/${meals.id}`)
                .then((r)=> r.json())
                .then((data) => {
                    const instraction = document.createElement("div");
                    instraction.classList.add("intractions");
                    instraction.innerHTML = `
                    <div class="mealnamecd">${data.name}</div>
                    <div class="instruction">
                        <h1>instructions:</h1>
                        <p class="instruction">
                            ${data.instructions}
                        </p>
                    </div>`;
                    
                    document.body.appendChild(instraction);
                    
                    document.body.addEventListener("click", ()=>{
                        instraction.remove();
                    })
                })
                

            })

            mealsLists.appendChild(meal);
        }))
    }
    getMeals()
})