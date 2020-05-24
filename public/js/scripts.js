// Search Recipes
const recipes = document.querySelectorAll('.recipe');

for (let i = 0; i < recipes.length; i++) {
    recipes[i].addEventListener('click', function () {
        window.location.href = `/receitas/${i}`;
    });
}

// Hidden/Show Ingredients
const buttonIngredients = document.querySelector('.button-hidden-ingredients');
const ingredientsItems = document.querySelector('.recipe-page-items-ingredients');

document.querySelector('.button-hidden-ingredients').addEventListener('click', function () {
    if (buttonIngredients.classList.contains('hidden')) {
        buttonIngredients.classList.remove('hidden');
        buttonIngredients.classList.add('show');
        buttonIngredients.innerHTML = 'Mostrar';
        ingredientsItems.classList.add('hidden-recipe');
    } else {
        buttonIngredients.classList.remove('show');
        buttonIngredients.classList.add('hidden');
        buttonIngredients.innerHTML = 'Esconder';
        ingredientsItems.classList.remove('hidden-recipe');
    }
});

// Hidden/Show Preparation
const buttonPreparation = document.querySelector('.button-hidden-preparation');
const preparationItems = document.querySelector('.recipe-page-items-preparation');

document.querySelector('.button-hidden-preparation').addEventListener('click', function () {
    if (buttonPreparation.classList.contains('hidden')) {
        buttonPreparation.classList.remove('hidden');
        buttonPreparation.classList.add('show');
        buttonPreparation.innerHTML = 'Mostrar';
        preparationItems.classList.add('hidden-recipe');
    } else {
        buttonPreparation.classList.remove('show');
        buttonPreparation.classList.add('hidden');
        buttonPreparation.innerHTML = 'Esconder';
        preparationItems.classList.remove('hidden-recipe');
    }
});

// Hidden/Show Info
const buttonInfo = document.querySelector('.button-hidden-info');
const info = document.querySelector('.recipe-page-items-info');

document.querySelector('.button-hidden-info').addEventListener('click', function () {
    if (buttonInfo.classList.contains('hidden')) {
        buttonInfo.classList.remove('hidden');
        buttonInfo.classList.add('show');
        buttonInfo.innerHTML = 'Mostrar';
        info.classList.add('hidden-recipe');
    } else {
        buttonInfo.classList.remove('show');
        buttonInfo.classList.add('hidden');
        buttonInfo.innerHTML = 'Esconder';
        info.classList.remove('hidden-recipe');
    }
});