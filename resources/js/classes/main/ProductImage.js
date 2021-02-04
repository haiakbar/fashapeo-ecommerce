class ProductImage {
    constructor() {
        this.productImage = document.getElementById("productImage");
        this.productImageThumbnails = document.getElementById(
            "productImageThumbnails"
        );
        this.imageGallery(this.imageList());
        this.eventListeners();
        this.setDefault();
    }

    eventListeners() {
        this.productImageThumbnails.addEventListener(
            "click",
            this.thumbnailHandler.bind(this)
        );

        this.productImage.addEventListener(
            "click",
            this.productImageHandler.bind(this)
        );
        this.slideChange();
        // listen event ketika kombinasi varian terpilih dan terpadat gambar
        // cek juga alternatif di class sebelah
    }

    setDefault() {
        const firstImage = this.images[0];
        this.changeProductImage(firstImage);
    }

    imageGallery(images) {
        this.lightbox = window.GLightbox({ elements: images });
    }

    imageList() {
        this.images = this.productImageThumbnails.querySelectorAll("img");
        return Array.from(this.images).map((element) => {
            return {
                href: element.src,
                type: "image",
                index: element.dataset.index,
            };
        });
    }

    changeProductImage(image) {
        this.productImage.style.backgroundImage = `url('${image.src}')`;
        this.productImage.dataset.index = image.dataset.index;
    }

    thumbnailHandler(event) {
        event.stopPropagation();
        let image = event.target.closest("img");
        if (image) {
            this.changeProductImage(image);
        }
    }

    productImageHandler(event) {
        this.lightbox.openAt(event.target.dataset.index);
    }

    slideChange() {
        this.lightbox.on("slide_changed", ({ prev, current }) => {
            const currentImageNode = this.images[current.index];
            this.changeProductImage(currentImageNode);
        });
    }
}

module.exports = ProductImage;
