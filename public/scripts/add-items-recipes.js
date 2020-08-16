// Adiciona ingredientes no create/edit receitas do admin
const ingredients = document.querySelector('#ingredients');
const fieldContainerIngredients = document.querySelectorAll('.ingredient');

document.querySelector('.add-ingredient').addEventListener('click', function () {
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainerIngredients[fieldContainerIngredients.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == '') {
        return false;
    }

    // Deixa o valor do input vazio
    newField.children[0].value = '';
    ingredients.appendChild(newField);
});

// Adiciona modos de preparo no create/edit receitas do admin
const preparations = document.querySelector('#preparations');
const fieldContainerPreparation = document.querySelectorAll('.preparation');

document.querySelector('.add-preparation').addEventListener('click', function () {
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainerPreparation[fieldContainerPreparation.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == '') {
        return false;
    }

    // Deixa o valor do input vazio
    newField.children[0].value = '';
    preparations.appendChild(newField);
});