const { ProductImage } = require("./ProductImage");
const { Quantity } = require("./Quantity");
const AddToCart = require("./AddToCart").default;

class ProductVariation {
    constructor() {
        this.products = window.variantData;
        this.price = document.getElementById("price");
        this.variations = document.querySelectorAll(".product-variant");
        this.form = document.getElementById("variations");
        this.initializer();
    }

    childrenClass() {
        this.productImage = new ProductImage();
        this.quantityInput = new Quantity();
        this.cart = new AddToCart();
    }

    initializer() {
        this.childrenClass();
        if (this.variations.length === 0) {
            this.withoutVariantInitializer();
        } else {
            this.withVariantInitializer();
        }
    }

    withoutVariantInitializer() {
        if (
            !this.products.products[0].active |
            (this.products.products[0].stock == 0)
        ) {
            this.cart.disableCart();
        } else {
            this.quantityInput.setQuantityLimit(
                this.products.products[0].stock
            );
            this.cart.updateSelectedProduct(this.products.products[0].id);
        }
    }

    withVariantInitializer() {
        this.retreiveVariations();
        this.clickListener();
        if (this.variations.length === 1) {
            this.singleVariantTypeValidator();
        }
    }

    retreiveVariations() {
        let selectionDivElements = [];
        this.variationName = [];
        this.variations.forEach((variation) => {
            this.variationName.push(variation.dataset.variant);
            const options = variation.querySelectorAll("div");
            options.forEach((variant) => selectionDivElements.push(variant));
        });
        this.selectionDivElements = selectionDivElements;
    }

    clickListener() {
        this.selectionDivElements.forEach((element) => {
            element
                .querySelector("input")
                .addEventListener("change", this.evaluator.bind(this));
        });
    }

    singleVariantTypeValidator() {
        this.products.products.forEach((variant) => {
            if (!variant.active | (variant.stock == 0)) {
                document.querySelector(
                    `input[value=${
                        variant[this.variations[0].dataset.variant]
                    }]`
                ).disabled = true;
            }
        });
    }

    doubleVariantTypeValidator(selected) {
        let filtered = this.products.products.filter((variant) => {
            if (variant[selected.name] == selected.value) {
                return variant;
            }
        });

        filtered.forEach((variant) => {
            const input = document.querySelector(
                `input[value=${selected.name}]`
            );
            if (!variant.active | (variant.stock == 0)) {
                input.disabled = true;
            } else {
                input.disabled = false;
            }
        });
    }

    evaluator() {
        let selected = [];

        this.variationName.forEach((name) => {
            const selectedValue = this.form.querySelector(
                `input[name=${name}]:checked`
            ).value;
            if (selectedValue === "" || selectedValue === null) {
                return;
            }

            selected.filter((selection) => {
                if (selection.name !== name) {
                    return selection;
                }
            });

            if (this.variationName.length !== 1) {
                this.doubleVariantTypeValidator({
                    name: name,
                    value: selectedValue,
                });
            }

            selected.push({ name: name, value: selectedValue });
        });

        if (selected.length === this.variationName.length) {
            this.filterVariants(selected);
            selected.splice(0, selected.length);
        }
    }

    filterVariants(selectedData) {
        let filtered = this.products.products;

        for (const data of selectedData) {
            filtered = filtered.filter((variant) => {
                if (variant[data.name] === data.value) {
                    return variant;
                }
            });
        }

        if (filtered.length === 1) {
            this.applyChange(filtered[0]);
        }
    }

    applyChange(product) {
        if (product.discount_price) {
            this.price.innerHTML = `<del><span class="text-muted">${product.price}</span></del>${product.discount_price}`;
        } else {
            this.price.textContent = product.price;
        }
        if (product.image) {
            this.productImage.addVariantImage(product.image);
        }
        this.quantityInput.setQuantityLimit(product.stock);
        this.cart.updateSelectedProduct(product.id);
    }
}

export default ProductVariation;
