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

function showSlide(slideNum) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === slideNum - 1) {
            slide.classList.add('active');
        }
    });
    
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === slideNum - 1) {
            dot.classList.add('active');
        }
    });
    
    currentSlide = slideNum;
}

function nextSlide() {
    currentSlide = currentSlide < totalSlides ? currentSlide + 1 : 1;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = currentSlide > 1 ? currentSlide - 1 : totalSlides;
    showSlide(currentSlide);
}

// ===== Initialize Carousel =====
function initCarousel() {
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dots = document.querySelectorAll('.dot');
    
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
            
            if (category === 'all') {
                window.location.href = 'index.html#menu';
            } else {
                window.location.href = 'index.html#menu';
                setTimeout(() => {
                    renderMenuItems(category);
                }, 100);
            }
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
                            
                            // Populate search box with detected area
                            const searchInput = document.getElementById('locationSearch');
                            searchInput.value = detectedArea;
                            
                            // Filter location list based on detected area (without city suffix)
                            populateLocationList(karachiAreas, detectedArea);
                            
                            // Auto-select the matching area item if exists
                            setTimeout(() => {
                                const selectBtn = document.getElementById('selectLocationBtn');
                                const locationList = document.getElementById('locationList');
                                
                                // Try to find exact or partial match
                                let selectedItem = locationList.querySelector(`[data-area="${detectedArea}"]`);
                                
                                // If no exact match, try first item that partially matches
                                if (!selectedItem) {
                                    const allItems = locationList.querySelectorAll('.location-item');
                                    allItems.forEach(item => {
                                        const areaName = item.dataset.area.toLowerCase();
                                        if (detectedArea && areaName.includes(detectedArea.toLowerCase()) || 
                                            detectedArea.toLowerCase().includes(areaName)) {
                                            selectedItem = item;
                                        }
                                    });
                                }
                                
                                // If still no match, select first item
                                if (!selectedItem) {
                                    selectedItem = locationList.querySelector('.location-item');
                                }
                                
                                if (selectedItem) {
                                    locationList.querySelectorAll('.location-item').forEach(i => i.classList.remove('selected'));
                                    selectedItem.classList.add('selected');
                                    selectBtn.disabled = false;
                                }
                            }, 100);
                            
                            showToast(`Detected: ${detectedArea || 'Current Location'}`);
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
        if (selected) {
            const area = selected.dataset.area;
            const fullLocation = `${area}, Karachi`;
            updateLocationDisplay(fullLocation);
            localStorage.setItem('foodiehub_location', fullLocation);
            
            // Update button text to "Update Location" for future use
            const selectBtnText = document.getElementById('selectBtnText');
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
