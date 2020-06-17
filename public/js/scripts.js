// Procura receitas
const recipes = document.querySelectorAll('.recipe');

for (let i = 0; i < recipes.length; i++) {
    recipes[i].addEventListener('click', function () {
        window.location.href = `/receita/${i + 1}`;
    });
}