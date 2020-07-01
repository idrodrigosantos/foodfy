// Paginação
function paginate(selectedPage, totalPages) {
    let pages = [], oldPage;

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
        const pagesBeforeSelectedPages = currentPage >= selectedPage - 2;
        const pagesAfterSelectedPages = currentPage <= selectedPage + 2;

        if (firstAndLastPage || pagesBeforeSelectedPages && pagesAfterSelectedPages) {
            if (oldPage && currentPage - oldPage > 2) {
                pages.push('...');
            }

            if (oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1);
            }

            pages.push(currentPage);

            oldPage = currentPage;
        }
    }

    return pages;
}

function createPagination(pagination) {
    // + transforma a string em número
    const page = +pagination.dataset.page;
    const total = +pagination.dataset.total;
    const pages = paginate(page, total);

    let elements = '';

    for (let page of pages) {
        if (String(page).includes('...')) {
            elements += `<span>${page}</span>`;
        } else {
            elements += `<a href="?page=${page}">${page}</a>`;
        }
    }

    pagination.innerHTML = elements;
}

const pagination = document.querySelector('.pagination');

if (pagination) {
    createPagination(pagination);
}