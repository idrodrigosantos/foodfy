const modalOverlay = document.querySelector('.modal-overlay');
const recipes = document.querySelectorAll('.recipe');

for (let recipe of recipes) {
    recipe.addEventListener('click', function () {
        const recipeImage = recipe.querySelector('.recipe img').src;
        const recipeImageAlt = recipe.querySelector('.recipe img').alt;
        const recipeTitle = recipe.querySelector('.recipe-name').innerHTML;
        const recipeChef = recipe.querySelector('.recipe-chef').innerHTML;

        modalOverlay.classList.add('active');
        modalOverlay.querySelector('img').src = recipeImage;
        modalOverlay.querySelector('img').alt = recipeImageAlt;
        modalOverlay.querySelector('h1').innerHTML = recipeTitle;
        modalOverlay.querySelector('h2').innerHTML = recipeChef;
    });
}

document.querySelector('.close-modal').addEventListener('click', function () {
    modalOverlay.classList.remove('active');
    modalOverlay.querySelector('img').src = '';
    modalOverlay.querySelector('img').alt = '';
    modalOverlay.querySelector('h1').innerHTML = '';
    modalOverlay.querySelector('h2').innerHTML = '';
});