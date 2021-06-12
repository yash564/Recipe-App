let randomMealImage=document.querySelector(".recipe-image img");
let recipeContent=document.querySelector(".recipe-content");
let favouriteRecipe=document.querySelector(".favourite-recipe");
let searchInput=document.querySelector(".searchbox input");
let searchButton=document.querySelector(".searchlogo");
let favMealPopup=document.querySelector(".fav-meal-info-container");
let popUpClose=document.querySelector(".close-button");
let mealInfo=document.querySelector(".meal-info");

getRandomMeal();
fetchFavMeals();
async function getRandomMeal(){
    const resp=await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    let data=await resp.json();
    let randomMeal=data.meals[0];
    console.log(randomMeal);
    addMeal(randomMeal);
}

async function getMealById(id){
    const resp=await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id);
    let data=await resp.json();
    let meals=data.meals;
    return meals;
}

async function getsearchMeal(term){
    const resp=await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+term);
    let data=await resp.json();
    let search=data.meals;
    return search;
}

function addMeal(randomMeal){
    let randomRecipe=document.createElement("div");
    let Ingredients=[];

    for(let i=1;i<=20;i++){
        if(randomMeal['strIngredient'+i]){
            Ingredients.push(`${randomMeal['strIngredient'+i]} - ${randomMeal['strMeasure'+i]}`);
        }else{
            break;
        }
    }  
    randomRecipe.classList.add("box");
    randomRecipe.innerHTML=`<div class="first-box">
    <div class="recipes">
        <div class="recipe-image">
            <img src="${randomMeal.strMealThumb}" alt="">
        </div>
        <div class="recipe">
            <div class="recipe-name">${randomMeal.strMeal}</div>
            <div class="heart-logo">
                <i class="far fa-heart"></i>
            </div>
        </div>
    </div>
</div>
<div class="second-box">
    <div class="heading">Ingredients:-</div>
    <br>
    <ul>
    ${Ingredients.map(ing=>`
    <li>${ing}</li>`).join('')}
    <br>
    <br>
    <div class="heading">Instructions:-</div>
    <br>
    <div class="paragarph">${randomMeal.strInstructions}</div>
    <br>
    <div class="heading">YouTube Link:-</div>
    <br>
    <a target="_blank" href="${randomMeal.strYoutube}">ClickHere</a>
    <br>
</div>`
    recipeContent.appendChild(randomRecipe); 
    let heart=randomRecipe.querySelector(".far");
    heart.addEventListener("click",function(e){
        if(heart.classList.contains("fas")){
            heart.classList.remove("fas");
            heart.classList.add("far");
            removeMealFromLS(randomMeal.idMeal);
        }
        else{
            heart.classList.remove("far");
            heart.classList.add("fas");
            addMealToLS(randomMeal.idMeal);
        }
        fetchFavMeals();
    });


}

function addMealToLS(mealId){
    const mealIds=getMealFromLS();
    localStorage.setItem('mealIds',JSON.stringify([...mealIds,mealId]));
}

function removeMealFromLS(mealId){
    const mealIds=getMealFromLS();
    localStorage.setItem('mealIds',JSON.stringify(mealIds.filter((id)=>id!==mealId)));
}

function getMealFromLS(){
    const mealIds=JSON.parse(localStorage.getItem('mealIds'));
    return mealIds==null?[]:mealIds;
}

async function fetchFavMeals(){
    favouriteRecipe.innerHTML='';
    const mealIds=getMealFromLS();
    for(let i=0;i<mealIds.length;i++){
        const mealId=mealIds[i];
        const meal=await getMealById(mealId);
        addMealToFav(meal[0]);
    }
}

function addMealToFav(mealData){
    let favourite=document.createElement("div");
    favourite.classList.add("favourite-container");
    favourite.innerHTML=`<div class="favourite-box-1">
    <div class="favourite-image">
    <img src="${mealData.strMealThumb}" alt="">
    </div>
    <div class="favourite-image-name">${mealData.strMeal}</div>
    </div>
    <div class="favourite-box-2">
    <i class="fas fa-times"></i>
    </div>`;
    let removeLogo=favourite.querySelector(".favourite-box-2");
    
    removeLogo.addEventListener("click",function(e){
        removeMealFromLS(mealData.idMeal);
        fetchFavMeals();
    });

    let fav=favourite.querySelector(".favourite-box-1");

    fav.addEventListener("click",function(e){
        showMealInfo(mealData);
    })

    favouriteRecipe.appendChild(favourite);
}

function showMealInfo(mealData){
    mealInfo.innerHTML='';
    let mealEle=document.createElement("div");
    
    let Ingredients=[];

    for(let i=1;i<=20;i++){
        if(mealData['strIngredient'+i]){
            Ingredients.push(`${mealData['strIngredient'+i]} - ${mealData['strMeasure'+i]}`);
        }else{
            break;
        }
    }  

    mealEle.innerHTML=`
    <h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}" alt="">
    <br>
    <div class="heading">Ingredients:-</div>
    <br>
    <ul>
    ${Ingredients.map(ing=>`
    <li>${ing}</li>`).join('')}
    <br>
    <div class="heading">Instructions:-</div>
    <br>
    <div class="paragarph">${mealData.strInstructions}</div>
    <br>
    <div class="heading">YouTube Link:-</div>
    <br>
    <a target="_blank" href="${mealData.strYoutube}">ClickHere</a>
    `
    mealInfo.appendChild(mealEle);
    favMealPopup.classList.remove("hide");
}

searchButton.addEventListener("click",async function(e){
    let button=searchButton.querySelector(".searchlogo button");
    button.style.transform="scale(0.8)";
    setTimeout(function (){
        button.style.transform="scale(1)";
    },200);
    recipeContent.innerHTML='';
    let searchedRecipe=searchInput.value;
    if(searchedRecipe){
        let meals=await getsearchMeal(searchedRecipe);
        if(meals){
            meals.forEach(meal => {
                addMeal(meal);
            });
        }
    }
});

popUpClose.addEventListener("click",function(e){
    favMealPopup.classList.add("hide");
});
