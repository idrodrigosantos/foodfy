// Paginação
function paginate(totalPages, selectedPage) {
    let pages = [], oldPage;

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
        const pagesAfterSelectedPage = currentPage <= selectedPage + 1;
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 1;
        if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
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

function createPagination() {
    const filter = pagination.dataset.filter;
    const totalPages = +pagination.dataset.total;
    const selectedPage = +pagination.dataset.page;
    const pages = paginate(totalPages, selectedPage);

    let elements = '';

    for (let page of pages) {
        if (String(page).includes('...')) {
            elements += `<span>...</span>`;
        } else {
            if (!filter) {
                elements += `<a href="?page=${page}" ${(selectedPage == page ? 'class="active"' : '')}>${page}</a>`;
            } else {
                elements += `<a href="?filter=${filter}&page=${page}" ${(selectedPage == page ? 'class="active"' : '')}>${page}</a>`;
            }
        }
    }

    pagination.innerHTML = elements;
}

const pagination = document.querySelector('.pagination');

if (pagination) {
    createPagination();
}