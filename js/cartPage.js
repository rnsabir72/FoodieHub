// ===== Cart Page Logic =====
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartContainer = document.getElementById('cartContainer');
    const emptyCart = document.getElementById('emptyCart');
    const subtotalEl = document.getElementById('subtotal');
    const deliveryFeeEl = document.getElementById('deliveryFee');
    const totalAmountEl = document.getElementById('totalAmount');
    const clearCartBtn = document.getElementById('clearCartBtn');
    
    // ===== Mobile Menu Toggle =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        const handleMobileMenu = (e) => {
            if (e) e.preventDefault();
            navLinks.classList.toggle('active');
            
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        };
        
        mobileMenuBtn.addEventListener('click', handleMobileMenu);
        mobileMenuBtn.addEventListener('touchend', handleMobileMenu);
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // ===== Render Cart Items =====
    function renderCart() {
        const cart = CartManager.getCart();

        if (cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartContainer) cartContainer.style.display = 'none';
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        if (cartContainer) cartContainer.style.display = 'grid';

        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item" data-cart-id="${item.cartId}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}"
                             onerror="this.src='https://via.placeholder.com/100x100/ff6b35/ffffff?text=Food'">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="item-size"><i class="fas fa-ruler"></i> Size: ${item.size}</p>
                        <p class="item-price">${formatPrice(item.price)} each</p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="qty-btn" onclick="changeQuantity(${item.cartId}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="qty-value">${item.quantity}</span>
                            <button class="qty-btn" onclick="changeQuantity(${item.cartId}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <span style="font-weight: 700; color: #ff6b35; font-size: 1.1rem;">
                            ${formatPrice(item.price * item.quantity)}
                        </span>
                        <button class="remove-btn" onclick="removeFromCart(${item.cartId})">
                            <i class="fas fa-trash-alt"></i> Remove
                        </button>
                    </div>
                </div>
            `).join('');
        }

        updateSummary();
    }

    // ===== Update Summary =====
    function updateSummary() {
        const subtotal = CartManager.getTotal();
        const deliveryFee = CartManager.getDeliveryFee();
        const total = subtotal + deliveryFee;

        if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
        if (deliveryFeeEl) deliveryFeeEl.textContent = formatPrice(deliveryFee);
        if (totalAmountEl) totalAmountEl.textContent = formatPrice(total);
    }

    // ===== Change Quantity =====
    window.changeQuantity = function(cartId, change) {
        CartManager.updateQuantity(cartId, change);
        renderCart();
    };

    // ===== Remove Item =====
    window.removeFromCart = function(cartId) {
        CartManager.removeItem(cartId);
        showToast('Item removed from cart');
        renderCart();
    };

    // ===== Clear Cart =====
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your cart?')) {
                CartManager.clearCart();
                showToast('Cart cleared');
                renderCart();
            }
        });
    }

    // ===== Initial Render =====
    renderCart();
});
