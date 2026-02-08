// ===== Main App - Menu Page =====
document.addEventListener('DOMContentLoaded', () => {
    const menuGrid = document.getElementById('menuGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // ===== Mobile Menu Toggle =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle icon between bars and times
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
    
    // Track selected sizes per item
    const selectedSizes = {};

    // ===== Render Menu Items =====
    function renderMenuItems(category = 'all') {
        const items = DataManager.getItemsByCategory(category);
        
        if (!menuGrid) return;

        if (items.length === 0) {
            menuGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #e9ecef; margin-bottom: 15px;"></i>
                    <h3 style="color: #6c757d;">No items found</h3>
                    <p style="color: #adb5bd;">Check back later for new additions!</p>
                </div>
            `;
            return;
        }

        menuGrid.innerHTML = items.map(item => {
            // Default to medium size
            if (!selectedSizes[item.id]) {
                selectedSizes[item.id] = 'medium';
            }
            const currentSize = selectedSizes[item.id];
            const currentPrice = item.prices[currentSize];

            return `
                <div class="menu-card" data-category="${item.category}">
                    <div class="card-image">
                        <img src="${item.image}" alt="${item.name}" 
                             onerror="this.src='https://via.placeholder.com/500x350/ff6b35/ffffff?text=${encodeURIComponent(item.name)}'">
                        <span class="card-badge">${item.category}</span>
                    </div>
                    <div class="card-content">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        
                        <div class="size-selector">
                            <button class="size-btn ${currentSize === 'small' ? 'active' : ''}" 
                                    onclick="selectSize(${item.id}, 'small')">
                                <span class="size-label">Small</span>
                                <span class="size-price">${formatPrice(item.prices.small)}</span>
                            </button>
                            <button class="size-btn ${currentSize === 'medium' ? 'active' : ''}" 
                                    onclick="selectSize(${item.id}, 'medium')">
                                <span class="size-label">Medium</span>
                                <span class="size-price">${formatPrice(item.prices.medium)}</span>
                            </button>
                            <button class="size-btn ${currentSize === 'large' ? 'active' : ''}" 
                                    onclick="selectSize(${item.id}, 'large')">
                                <span class="size-label">Large</span>
                                <span class="size-price">${formatPrice(item.prices.large)}</span>
                            </button>
                        </div>

                        <div class="card-footer">
                            <span class="card-price" id="price-${item.id}">${formatPrice(currentPrice)}</span>
                            <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ===== Size Selection =====
    window.selectSize = function(itemId, size) {
        selectedSizes[itemId] = size;
        const item = DataManager.getItemById(itemId);
        if (item) {
            // Update price display
            const priceEl = document.getElementById(`price-${itemId}`);
            if (priceEl) {
                priceEl.textContent = formatPrice(item.prices[size]);
            }

            // Update active size button
            const card = document.querySelector(`.menu-card[data-category="${item.category}"]`);
            // Re-render to update active states properly
            renderMenuItems(document.querySelector('.filter-btn.active')?.dataset.category || 'all');
        }
    };

    // ===== Add to Cart =====
    window.addToCart = function(itemId) {
        const size = selectedSizes[itemId] || 'medium';
        const success = CartManager.addItem(itemId, size);
        
        if (success) {
            const item = DataManager.getItemById(itemId);
            showToast(`${item.name} (${size}) added to cart!`);
        }
    };

    // ===== Filter Buttons =====
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMenuItems(btn.dataset.category);
        });
    });

    // ===== Initial Render =====
    renderMenuItems();
});
