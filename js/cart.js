// ===== Cart Manager =====
const CartManager = {
    // Get cart from localStorage
    getCart() {
        const cart = localStorage.getItem('foodiehub_cart');
        return cart ? JSON.parse(cart) : [];
    },

    // Save cart to localStorage
    saveCart(cart) {
        localStorage.setItem('foodiehub_cart', JSON.stringify(cart));
        this.updateCartCount();
    },

    // Add item to cart
    addItem(itemId, size) {
        const cart = this.getCart();
        const menuItem = DataManager.getItemById(itemId);
        
        if (!menuItem) return false;

        // Check if same item with same size already exists
        const existingIndex = cart.findIndex(
            item => item.itemId === itemId && item.size === size
        );

        if (existingIndex !== -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({
                cartId: Date.now() + Math.random(),
                itemId: itemId,
                name: menuItem.name,
                category: menuItem.category,
                image: menuItem.image,
                size: size,
                price: menuItem.prices[size],
                quantity: 1
            });
        }

        this.saveCart(cart);
        return true;
    },

    // Remove item from cart
    removeItem(cartId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.cartId !== cartId);
        this.saveCart(cart);
        return cart;
    },

    // Update quantity
    updateQuantity(cartId, change) {
        const cart = this.getCart();
        const index = cart.findIndex(item => item.cartId === cartId);
        
        if (index !== -1) {
            cart[index].quantity += change;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        }

        this.saveCart(cart);
        return cart;
    },

    // Get cart total
    getTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Get cart item count
    getItemCount() {
        const cart = this.getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
    },

    // Clear cart
    clearCart() {
        localStorage.removeItem('foodiehub_cart');
        this.updateCartCount();
    },

    // Update cart count badge on all pages
    updateCartCount() {
        const count = this.getItemCount();
        const countElements = document.querySelectorAll('#cartCount');
        countElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    // Get delivery fee
    getDeliveryFee() {
        return 150;
    },

    // Get grand total (subtotal + delivery)
    getGrandTotal() {
        const cart = this.getCart();
        if (cart.length === 0) return 0;
        return this.getTotal() + this.getDeliveryFee();
    }
};

// ===== Toast Notification =====
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// ===== Mobile Menu Toggle =====
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Update cart count on page load
    CartManager.updateCartCount();
});

// ===== Format Price =====
function formatPrice(price) {
    return 'Rs. ' + price.toLocaleString();
}
