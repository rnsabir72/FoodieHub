// ===== Toast Notification System =====
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

// ===== Cart Functions =====
function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('foodiehub_cart')) || [];
    
    const existingItem = cart.find(i => i.id === item.id && i.size === item.size);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...item, quantity: 1});
    }
    
    localStorage.setItem('foodiehub_cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${item.name} (${item.size}) added to cart!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('foodiehub_cart')) || [];
    const cartCount = document.getElementById('cartCount');
    
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function removeFromCart(itemId, size) {
    let cart = JSON.parse(localStorage.getItem('foodiehub_cart')) || [];
    cart = cart.filter(item => !(item.id === itemId && item.size === size));
    localStorage.setItem('foodiehub_cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function updateQuantity(itemId, size, change) {
    let cart = JSON.parse(localStorage.getItem('foodiehub_cart')) || [];
    const item = cart.find(i => i.id === itemId && i.size === size);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId, size);
        } else {
            localStorage.setItem('foodiehub_cart', JSON.stringify(cart));
            updateCartCount();
            renderCartItems();
        }
    }
}

function calculateTotal() {
    const cart = JSON.parse(localStorage.getItem('foodiehub_cart')) || [];
    return cart.reduce((sum, item) => sum + (item.prices[item.size] * item.quantity), 0);
}

function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('foodiehub_cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Size: ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}</p>
                        <p class="cart-item-price">Rs. ${item.prices[item.size] * item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, '${item.size}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, '${item.size}', 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id}, '${item.size}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (cartTotalElement) {
        cartTotalElement.textContent = `Rs. ${calculateTotal()}`;
    }
}

// ===== Menu Functions =====
function renderMenuItems(category = 'all') {
    const menuGrid = document.getElementById('menuGrid');
    const items = DataManager.getItemsByCategory(category);
    
    if (menuGrid) {
        if (items.length === 0) {
            menuGrid.innerHTML = '<div class="no-items">No items found</div>';
        } else {
            menuGrid.innerHTML = items.map(item => `
                <div class="menu-item" data-category="${item.category}">
                    <div class="menu-item-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                        <span class="category-badge ${item.category}">${item.category}</span>
                    </div>
                    <div class="menu-item-content">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <div class="menu-item-footer">
                            <div class="price-options">
                                <button class="price-btn" onclick="addToCart({id: ${item.id}, name: '${item.name}', size: 'small', prices: ${JSON.stringify(item.prices)}})">
                                    Small - Rs. ${item.prices.small}
                                </button>
                                <button class="price-btn" onclick="addToCart({id: ${item.id}, name: '${item.name}', size: 'medium', prices: ${JSON.stringify(item.prices)}})">
                                    Medium - Rs. ${item.prices.medium}
                                </button>
                                <button class="price-btn" onclick="addToCart({id: ${item.id}, name: '${item.name}', size: 'large', prices: ${JSON.stringify(item.prices)}})">
                                    Large - Rs. ${item.prices.large}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// ===== Carousel Functions =====
let currentSlide = 1;
const totalSlides = 3;
let isAnimating = false;

function showSlide(slideNum) {
    if (isAnimating || slideNum === currentSlide) return;
    isAnimating = true;
    
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    // Get current and next slide
    const currentSlideEl = slides[currentSlide - 1];
    const nextSlideEl = slides[slideNum - 1];
    
    // Remove active class from current, add sliding-out
    currentSlideEl.classList.remove('active');
    currentSlideEl.classList.add('sliding-out');
    
    // Add sliding-in to next slide
    nextSlideEl.classList.add('sliding-in');
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === slideNum - 1);
    });
    
    // Clean up after animation
    setTimeout(() => {
        currentSlideEl.classList.remove('sliding-out');
        nextSlideEl.classList.remove('sliding-in');
        nextSlideEl.classList.add('active');
        currentSlide = slideNum;
        isAnimating = false;
    }, 600);
}

function nextSlide() {
    const next = currentSlide < totalSlides ? currentSlide + 1 : 1;
    showSlide(next);
}

function prevSlide() {
    const prev = currentSlide > 1 ? currentSlide - 1 : totalSlides;
    showSlide(prev);
}

// ===== Initialize Carousel =====
function initCarousel() {
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dots = document.querySelectorAll('.dot');
    const slides = document.querySelectorAll('.carousel-slide');
    
    // Set initial slide state
    if (slides.length > 0) {
        slides[0].classList.add('active');
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index + 1);
        });
    });
    
    // Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000);
}

// ===== DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', () => {
    // ===== Initialize Cart =====
    updateCartCount();
    renderCartItems();
    
    // ===== Initialize Menu =====
    renderMenuItems();
    
    // ===== Initialize Carousel =====
    initCarousel();
    
    // ===== Category Filter =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            renderMenuItems(category);
        });
    });
    
    // ===== Location Selector =====
    const locationSelector = document.getElementById('locationSelector');
    const currentLocationSpan = document.getElementById('currentLocation');

    // Karachi areas for location selection
    const karachiAreas = [
        "Clifton", "Defence", "Gulshan-e-Iqbal", "Nazimabad", "Saddar",
        "Lyari", "Korangi", "Landhi", "Malir", "Bin Qasim",
        "Gulistan-e-Johar", "North Nazimabad", "Shah Faisal", "Johar",
        "Model Colony", "New Karachi", "Orangi Town", "Baldia"
    ];

    // Function to update location display
    function updateLocationDisplay(location) {
        if (currentLocationSpan) {
            currentLocationSpan.innerHTML = location;
        }
    }

    // Auto-detect GPS location on page load
    function autoDetectLocation() {
        if (navigator.geolocation) {
            currentLocationSpan.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Detecting...</span>';

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    // Use reverse geocoding to get address
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                        .then(response => response.json())
                        .then(data => {
                            let location = 'Your Location';

                            if (data.address) {
                                const address = data.address;
                                
                                if (address.suburb || address.neighbourhood) {
                                    location = address.suburb || address.neighbourhood;
                                } else if (address.road) {
                                    location = address.road;
                                } else if (address.city_district || address.county) {
                                    location = address.city_district || address.county;
                                }
                                
                                if (address.city || address.town || address.village) {
                                    location += ', ' + (address.city || address.town || address.village);
                                }
                            }

                            updateLocationDisplay(location);
                            localStorage.setItem('foodiehub_location', location);
                        })
                        .catch(error => {
                            console.error('Geocoding error:', error);
                            const location = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                            updateLocationDisplay(location);
                            localStorage.setItem('foodiehub_location', location);
                        });
                },
                (error) => {
                    // Fall back to saved location or default
                    const savedLocation = localStorage.getItem('foodiehub_location');
                    if (savedLocation) {
                        updateLocationDisplay(savedLocation);
                    } else {
                        updateLocationDisplay('Clifton, Karachi');
                    }
                }
            );
        } else {
            // Geolocation not supported, use saved or default
            const savedLocation = localStorage.getItem('foodiehub_location');
            if (savedLocation) {
                updateLocationDisplay(savedLocation);
            } else {
                updateLocationDisplay('Clifton, Karachi');
            }
        }
    }

    // Try auto-detect on load, but don't block rendering
    autoDetectLocation();

    // Main location selector click handler - Opens modal
    if (locationSelector) {
        locationSelector.addEventListener('click', (e) => {
            e.stopPropagation();
            const modal = document.getElementById('locationModal');
            modal.classList.add('show');
            
            // Reset selection
            const locationList = document.getElementById('locationList');
            const selectBtn = document.getElementById('selectLocationBtn');
            const searchInput = document.getElementById('locationSearch');
            const selectBtnText = document.getElementById('selectBtnText');
            
            // Clear previous selection
            document.querySelectorAll('.location-item').forEach(item => item.classList.remove('selected'));
            selectBtn.disabled = true;
            searchInput.value = '';
            
            // Check if location is already saved - change button text to "Update Location"
            const savedLocation = localStorage.getItem('foodiehub_location');
            if (savedLocation) {
                selectBtnText.textContent = 'Update Location';
                
                // Pre-select the saved location in the list
                const savedArea = savedLocation.split(',')[0].trim();
                const existingItem = locationList.querySelector(`[data-area="${savedArea}"]`);
                if (existingItem) {
                    existingItem.classList.add('selected');
                    selectBtn.disabled = false;
                }
            } else {
                selectBtnText.textContent = 'Select';
            }
            
            // Populate location list
            populateLocationList(karachiAreas);
        });
    }
    
    // Function to populate location list
    function populateLocationList(areas, filter = '') {
        const locationList = document.getElementById('locationList');
        const filteredAreas = filter ? areas.filter(area => 
            area.toLowerCase().includes(filter.toLowerCase())
        ) : areas;
        
        locationList.innerHTML = filteredAreas.map(area => `
            <div class="location-item" data-area="${area}">
                <i class="fas fa-map-marker-alt"></i>
                <span>${area}</span>
            </div>
        `).join('');
        
        // Add click handlers to all items
        const selectBtn = document.getElementById('selectLocationBtn');
        locationList.querySelectorAll('.location-item').forEach(item => {
            item.addEventListener('click', () => {
                // Remove selected from all
                locationList.querySelectorAll('.location-item').forEach(i => i.classList.remove('selected'));
                // Add selected to clicked
                item.classList.add('selected');
                // Enable select button
                selectBtn.disabled = false;
            });
        });
        
        // If there's only one match, auto-select it
        if (filteredAreas.length === 1) {
            const onlyItem = locationList.querySelector('.location-item');
            if (onlyItem) {
                onlyItem.classList.add('selected');
                selectBtn.disabled = false;
            }
        }
    }
    
    // Close modal with X button
    document.getElementById('locationModalClose')?.addEventListener('click', () => {
        document.getElementById('locationModal').classList.remove('show');
    });
    
    // Close modal when clicking overlay
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('locationModal');
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
    
    // ===== Order Modal =====
    const orderModal = document.getElementById('orderModal');
    const orderModalMenu = document.getElementById('orderModalMenu');
    let currentOrderCategory = 'all';
    
    // Populate order modal with menu items
    function populateOrderModal(category = 'all') {
        if (!orderModalMenu) return;
        const items = DataManager.getItemsByCategory(category);
        
        if (items.length === 0) {
            orderModalMenu.innerHTML = '<div class="no-items">No items found</div>';
            return;
        }
        
        orderModalMenu.innerHTML = items.map((item, idx) => `
            <div class="order-menu-item" data-id="${item.id}" data-name="${item.name}" data-prices='${JSON.stringify(item.prices).replace(/'/g, "&#39;")}'>
                <img src="${item.image}" alt="${item.name}">
                <div class="order-menu-item-info">
                    <div class="order-menu-item-name">${item.name}</div>
                    <div class="order-menu-item-category">${item.category}</div>
                    <div class="order-menu-item-price">Rs. ${item.prices.small} - ${item.prices.large}</div>
                </div>
                <button class="order-add-btn" data-idx="${idx}">
                    <i class="fas fa-cart-plus"></i> Add
                </button>
            </div>
        `).join('');
        
        // Add event listeners for add buttons
        document.querySelectorAll('.order-add-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemEl = this.closest('.order-menu-item');
                const id = parseInt(itemEl.dataset.id);
                const name = itemEl.dataset.name;
                const prices = JSON.parse(itemEl.dataset.prices.replace(/&#39;/g, "'"));
                addToCartFromModal(id, name, prices);
            });
        });
    }
    
    // Add to cart from modal
    function addToCartFromModal(id, name, prices) {
        // Get existing cart
        let cart = JSON.parse(localStorage.getItem('foodiehub_cart')) || [];
        
        // Create item object
        const item = {
            id: id,
            name: name,
            size: 'medium',
            prices: prices,
            price: prices.medium,
            quantity: 1
        };
        
        // Check if item already exists
        const existingIndex = cart.findIndex(cartItem => 
            cartItem.id === item.id && cartItem.size === item.size
        );
        
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push(item);
        }
        
        // Save to localStorage
        localStorage.setItem('foodiehub_cart', JSON.stringify(cart));
        
        // Update cart count - find all cart count elements
        const cartCounts = document.querySelectorAll('#cartCount');
        const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
        cartCounts.forEach(el => {
            if (el) el.textContent = totalItems;
        });
        
        // Show toast notification
        showToast(`${name} added to cart!`);
    }
    
    // Open order modal
    document.querySelectorAll('.order-now-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (orderModal) {
                currentOrderCategory = 'all';
                populateOrderModal('all');
                // Update active filter button
                document.querySelectorAll('.order-filter-btn').forEach(b => b.classList.remove('active'));
                document.querySelector('.order-filter-btn[data-category="all"]')?.classList.add('active');
                orderModal.classList.add('show');
            }
        });
    });
    
    // Filter buttons in order modal
    document.querySelectorAll('.order-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.order-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            currentOrderCategory = category;
            populateOrderModal(category);
        });
    });
    
    // Close order modal
    document.getElementById('orderModalClose')?.addEventListener('click', () => {
        orderModal?.classList.remove('show');
    });
    
    // Close order modal when clicking overlay
    orderModal?.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            orderModal.classList.remove('show');
        }
    });
    
    // Order type toggle
    document.querySelectorAll('.order-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.order-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Use current location button
    document.getElementById('useCurrentLocation')?.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                        .then(response => response.json())
                        .then(data => {
                            let detectedArea = '';
                            if (data.address) {
                                const address = data.address;
                                detectedArea = address.suburb || address.neighbourhood || address.road || 
                                               address.city_district || address.county || '';
                            }
                            
                            // Update navbar immediately
                            const fullLocation = detectedArea ? `${detectedArea}, Karachi` : 'Current Location';
                            updateLocationDisplay(fullLocation);
                            localStorage.setItem('foodiehub_location', fullLocation);
                            
                            // Populate search box with detected area
                            const searchInput = document.getElementById('locationSearch');
                            searchInput.value = detectedArea;
                            
                            // Filter location list based on detected area (without city suffix)
                            populateLocationList(karachiAreas, detectedArea);
                            
                            // Auto-select the matching area item
                            const selectBtn = document.getElementById('selectLocationBtn');
                            const selectBtnText = document.getElementById('selectBtnText');
                            const locationList = document.getElementById('locationList');
                            
                            // Change button to "Close" since location is already updated
                            selectBtnText.textContent = 'Close';
                            selectBtn.disabled = false;
                            
                            // Try to find exact match first
                            let selectedItem = null;
                            const allItems = locationList.querySelectorAll('.location-item');
                            
                            allItems.forEach(item => {
                                const areaName = item.dataset.area.toLowerCase();
                                if (detectedArea && (areaName === detectedArea.toLowerCase() || 
                                    areaName.includes(detectedArea.toLowerCase()) || 
                                    detectedArea.toLowerCase().includes(areaName))) {
                                    selectedItem = item;
                                }
                            });
                            
                            // If no match found, select first item
                            if (!selectedItem && allItems.length > 0) {
                                selectedItem = allItems[0];
                            }
                            
                            if (selectedItem) {
                                locationList.querySelectorAll('.location-item').forEach(i => i.classList.remove('selected'));
                                selectedItem.classList.add('selected');
                            }
                            
                            showToast(`Location updated to ${fullLocation}`);
                        })
                        .catch(() => {
                            showToast('Could not detect location');
                        });
                },
                () => {
                    showToast('Location permission denied');
                }
            );
        } else {
            showToast('Geolocation not supported');
        }
    });
    
    // Location search
    document.getElementById('locationSearch')?.addEventListener('input', (e) => {
        populateLocationList(karachiAreas, e.target.value);
    });
    
    // Select location button
    document.getElementById('selectLocationBtn')?.addEventListener('click', () => {
        const selected = document.querySelector('.location-item.selected');
        const selectBtnText = document.getElementById('selectBtnText');
        
        // If button says "Close", just close the modal
        if (selectBtnText && selectBtnText.textContent === 'Close') {
            document.getElementById('locationModal').classList.remove('show');
            return;
        }
        
        if (selected) {
            const area = selected.dataset.area;
            const fullLocation = `${area}, Karachi`;
            updateLocationDisplay(fullLocation);
            localStorage.setItem('foodiehub_location', fullLocation);
            
            // Update button text to "Update Location" for future use
            if (selectBtnText) {
                selectBtnText.textContent = 'Update Location';
            }
            
            showToast(`Location changed to ${fullLocation}!`);
            document.getElementById('locationModal').classList.remove('show');
        }
    });
    
    // ===== Toggle Menu =====
    const toggleBtn = document.getElementById('toggleMenuBtn');
    const toggleDropdown = document.getElementById('toggleDropdown');
    
    if (toggleBtn && toggleDropdown) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!toggleBtn.contains(e.target) && !toggleDropdown.contains(e.target)) {
                toggleDropdown.classList.remove('active');
            }
        });
    }
    
    // ===== Smooth Scroll =====
    document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
