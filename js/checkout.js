// ===== Checkout Page Logic =====
document.addEventListener('DOMContentLoaded', () => {
    const checkoutContainer = document.getElementById('checkoutContainer');
    const emptyCheckout = document.getElementById('emptyCheckout');
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutDelivery = document.getElementById('checkoutDelivery');
    const checkoutTotal = document.getElementById('checkoutTotal');
    const checkoutForm = document.getElementById('checkoutForm');
    const successModal = document.getElementById('successModal');
    const orderId = document.getElementById('orderId');
    
    // ===== Mobile Menu Toggle =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // ===== Check if cart has items =====
    function initCheckout() {
        const cart = CartManager.getCart();

        if (cart.length === 0) {
            if (checkoutContainer) checkoutContainer.style.display = 'none';
            if (emptyCheckout) emptyCheckout.style.display = 'block';
            return;
        }

        if (checkoutContainer) checkoutContainer.style.display = 'grid';
        if (emptyCheckout) emptyCheckout.style.display = 'none';

        renderCheckoutItems(cart);
        updateCheckoutSummary();
    }

    // ===== Render Checkout Items =====
    function renderCheckoutItems(cart) {
        if (!checkoutItems) return;

        checkoutItems.innerHTML = cart.map(item => `
            <div class="checkout-item">
                <div class="checkout-item-info">
                    <h4>${item.name}</h4>
                    <span>${item.size} × ${item.quantity}</span>
                </div>
                <span class="checkout-item-price">${formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('');
    }

    // ===== Update Checkout Summary =====
    function updateCheckoutSummary() {
        const subtotal = CartManager.getTotal();
        const deliveryFee = CartManager.getDeliveryFee();
        const total = subtotal + deliveryFee;

        if (checkoutSubtotal) checkoutSubtotal.textContent = formatPrice(subtotal);
        if (checkoutDelivery) checkoutDelivery.textContent = formatPrice(deliveryFee);
        if (checkoutTotal) checkoutTotal.textContent = formatPrice(total);
    }

    // ===== Handle Form Submission =====
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                area: document.getElementById('area').value,
                payment: document.querySelector('input[name="payment"]:checked').value,
                instructions: document.getElementById('instructions').value,
                items: CartManager.getCart(),
                subtotal: CartManager.getTotal(),
                deliveryFee: CartManager.getDeliveryFee(),
                total: CartManager.getGrandTotal(),
                orderDate: new Date().toISOString()
            };

            // Generate order ID
            const orderNumber = 'FH-' + Date.now().toString().slice(-8);

            // Save order to localStorage (for demo purposes)
            const orders = JSON.parse(localStorage.getItem('foodiehub_orders') || '[]');
            orders.push({ ...formData, orderId: orderNumber });
            localStorage.setItem('foodiehub_orders', JSON.stringify(orders));

            // Clear cart
            CartManager.clearCart();

            // Show success modal
            if (orderId) orderId.textContent = 'Order ID: ' + orderNumber;
            if (successModal) successModal.classList.add('active');

            showToast('Order placed successfully!');
        });
    }

    // ===== Initialize =====
    initCheckout();
});
