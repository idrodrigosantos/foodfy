// Galeria de imagens
const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e;
        this.previews.forEach(preview => preview.classList.remove('active'));
        target.classList.add('active');
        this.highlight.src = target.src;
        Lightbox.image.src = target.src;
    }
};