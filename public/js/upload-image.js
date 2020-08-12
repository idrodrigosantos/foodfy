const PhotosUpload = {
    input: '',
    preview: document.querySelector('#photo-preview'),
    uploadLimit: 0,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target;
        this.input = event.target;
        this.uploadLimit = this.input.dataset.limit;
        if (this.hasLimit(event)) return;
        Array.from(fileList).forEach(file => {
            this.files.push(file);
            const reader = new FileReader();
            reader.onload = () => {
                const image = new Image();
                image.src = String(reader.result);
                const div = this.getContainer(image);
                this.preview.appendChild(div);
            }
            reader.readAsDataURL(file);
        });
        this.input.files = this.getAllFiles();
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = this;
        const { files: fileList } = input;
        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`);
            event.preventDefault();
            return true;
        }
        const photosDiv = [];
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == 'photo') {
                photosDiv.push(item);
            }
        });
        const totalPhotos = fileList.length + photosDiv.length;
        if (totalPhotos > uploadLimit) {
            alert('Você atingiu o limite máximo de fotos');
            event.preventDefault();
            return true;
        }
        return false;
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer();
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file));
        return dataTransfer.files;
    },
    getContainer(image) {
        const div = document.createElement('div');
        div.classList.add('photo');
        div.onclick = this.removePhoto;
        div.appendChild(image);
        div.appendChild(this.getRemoveButton());
        return div;
    },
    getRemoveButton() {
        const button = document.createElement('i');
        button.classList.add('material-icons');
        button.innerHTML = 'close';
        return button;
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode;
        const photosArray = Array.from(PhotosUpload.preview.children);
        const index = photosArray.indexOf(photoDiv) - 1;
        PhotosUpload.files.splice(index, 1);
        PhotosUpload.input.files = PhotosUpload.getAllFiles();
        photoDiv.remove(index);
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode;
        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]');
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`;
            }
        }
        photoDiv.remove();
    }
}