// Procura receitas
const recipes = document.querySelectorAll('.recipe');
const idRecipes = document.querySelectorAll('.recipe-id');

for (let i = 0; i < recipes.length; i++) {
    recipes[i].addEventListener('click', function () {
        const idSelected = idRecipes[i].innerText;
        window.location.href = `/receita/${idSelected}`;
    });
}