// ===== Admin Panel Logic =====
document.addEventListener('DOMContentLoaded', () => {
    // ===== DOM Elements =====
    const adminLogin = document.getElementById('adminLogin');
    const adminDashboard = document.getElementById('adminDashboard');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');
    const addItemForm = document.getElementById('addItemForm');
    const adminTableBody = document.getElementById('adminTableBody');
    const adminCategoryFilter = document.getElementById('adminCategoryFilter');

    // Edit Modal Elements
    const editModal = document.getElementById('editModal');
    const editItemForm = document.getElementById('editItemForm');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelEdit = document.getElementById('cancelEdit');

    // Delete Modal Elements
    const deleteModal = document.getElementById('deleteModal');
    const deleteItemName = document.getElementById('deleteItemName');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');

    // Stats Elements
    const burgerCount = document.getElementById('burgerCount');
    const pizzaCount = document.getElementById('pizzaCount');
    const sandwichCount = document.getElementById('sandwichCount');
    const totalItems = document.getElementById('totalItems');

    let deleteTargetId = null;

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

    // ===== Check if already logged in =====
    function checkAuth() {
        const isLoggedIn = sessionStorage.getItem('foodiehub_admin');
        if (isLoggedIn === 'true') {
            showDashboard();
        }
    }

    // ===== Login Handler =====
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const id = document.getElementById('adminId').value.trim();
            const password = document.getElementById('adminPassword').value;

            if (id === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
                sessionStorage.setItem('foodiehub_admin', 'true');
                if (loginError) loginError.style.display = 'none';
                showDashboard();
                showToast('Welcome, Admin!');
            } else {
                if (loginError) loginError.style.display = 'flex';
                // Shake animation
                loginForm.style.animation = 'none';
                setTimeout(() => {
                    loginForm.style.animation = '';
                }, 10);
            }
        });
    }

    // ===== Logout Handler =====
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('foodiehub_admin');
            if (adminDashboard) adminDashboard.style.display = 'none';
            if (adminLogin) adminLogin.style.display = 'flex';
            showToast('Logged out successfully');
        });
    }

    // ===== Show Dashboard =====
    function showDashboard() {
        if (adminLogin) adminLogin.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'block';
        updateStats();
        renderAdminTable();
    }

    // ===== Update Stats =====
    function updateStats() {
        const counts = DataManager.getCategoryCounts();
        if (burgerCount) burgerCount.textContent = counts.burger;
        if (pizzaCount) pizzaCount.textContent = counts.pizza;
        if (sandwichCount) sandwichCount.textContent = counts.sandwich;
        if (totalItems) totalItems.textContent = counts.total;
    }

    // ===== Render Admin Table =====
    function renderAdminTable(category = 'all') {
        const items = DataManager.getItemsByCategory(category);

        if (!adminTableBody) return;

        if (items.length === 0) {
            adminTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #6c757d;">
                        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                        No items found in this category
                    </td>
                </tr>
            `;
            return;
        }

        adminTableBody.innerHTML = items.map(item => `
            <tr>
                <td>
                    <img src="${item.image}" alt="${item.name}" class="item-thumb"
                         onerror="this.src='https://via.placeholder.com/50x50/ff6b35/ffffff?text=IMG'">
                </td>
                <td><strong>${item.name}</strong></td>
                <td><span class="category-badge ${item.category}">${item.category}</span></td>
                <td>${formatPrice(item.prices.small)}</td>
                <td>${formatPrice(item.prices.medium)}</td>
                <td>${formatPrice(item.prices.large)}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn edit" onclick="openEditModal(${item.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="openDeleteModal(${item.id}, '${item.name.replace(/'/g, "\\'")}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // ===== Add Item Handler =====
    if (addItemForm) {
        addItemForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newItem = {
                name: document.getElementById('itemName').value.trim(),
                category: document.getElementById('itemCategory').value,
                description: document.getElementById('itemDescription').value.trim(),
                image: document.getElementById('itemImage').value.trim(),
                prices: {
                    small: parseInt(document.getElementById('priceSmall').value),
                    medium: parseInt(document.getElementById('priceMedium').value),
                    large: parseInt(document.getElementById('priceLarge').value)
                }
            };

            DataManager.addItem(newItem);
            addItemForm.reset();
            updateStats();
            renderAdminTable(adminCategoryFilter ? adminCategoryFilter.value : 'all');
            showToast(`"${newItem.name}" added successfully!`);
        });
    }

    // ===== Category Filter =====
    if (adminCategoryFilter) {
        adminCategoryFilter.addEventListener('change', () => {
            renderAdminTable(adminCategoryFilter.value);
        });
    }

    // ===== Edit Modal =====
    window.openEditModal = function(itemId) {
        const item = DataManager.getItemById(itemId);
        if (!item) return;

        document.getElementById('editItemId').value = item.id;
        document.getElementById('editName').value = item.name;
        document.getElementById('editCategory').value = item.category;
        document.getElementById('editDescription').value = item.description;
        document.getElementById('editImage').value = item.image;
        document.getElementById('editPriceSmall').value = item.prices.small;
        document.getElementById('editPriceMedium').value = item.prices.medium;
        document.getElementById('editPriceLarge').value = item.prices.large;

        if (editModal) editModal.classList.add('active');
    };

    function closeEditModalFn() {
        if (editModal) editModal.classList.remove('active');
    }

    if (closeEditModal) closeEditModal.addEventListener('click', closeEditModalFn);
    if (cancelEdit) cancelEdit.addEventListener('click', closeEditModalFn);

    // ===== Edit Form Submit =====
    if (editItemForm) {
        editItemForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const itemId = parseInt(document.getElementById('editItemId').value);
            const updatedData = {
                name: document.getElementById('editName').value.trim(),
                category: document.getElementById('editCategory').value,
                description: document.getElementById('editDescription').value.trim(),
                image: document.getElementById('editImage').value.trim(),
                prices: {
                    small: parseInt(document.getElementById('editPriceSmall').value),
                    medium: parseInt(document.getElementById('editPriceMedium').value),
                    large: parseInt(document.getElementById('editPriceLarge').value)
                }
            };

            DataManager.updateItem(itemId, updatedData);
            closeEditModalFn();
            updateStats();
            renderAdminTable(adminCategoryFilter ? adminCategoryFilter.value : 'all');
            showToast(`"${updatedData.name}" updated successfully!`);
        });
    }

    // ===== Delete Modal =====
    window.openDeleteModal = function(itemId, itemName) {
        deleteTargetId = itemId;
        if (deleteItemName) deleteItemName.textContent = itemName;
        if (deleteModal) deleteModal.classList.add('active');
    };

    function closeDeleteModalFn() {
        if (deleteModal) deleteModal.classList.remove('active');
        deleteTargetId = null;
    }

    if (closeDeleteModal) closeDeleteModal.addEventListener('click', closeDeleteModalFn);
    if (cancelDelete) cancelDelete.addEventListener('click', closeDeleteModalFn);

    // ===== Confirm Delete =====
    if (confirmDelete) {
        confirmDelete.addEventListener('click', () => {
            if (deleteTargetId !== null) {
                const item = DataManager.getItemById(deleteTargetId);
                const itemName = item ? item.name : 'Item';
                DataManager.deleteItem(deleteTargetId);
                closeDeleteModalFn();
                updateStats();
                renderAdminTable(adminCategoryFilter ? adminCategoryFilter.value : 'all');
                showToast(`"${itemName}" deleted successfully!`);
            }
        });
    }

    // ===== Close modals on overlay click =====
    [editModal, deleteModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
    });

    // ===== Close modals on Escape key =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeEditModalFn();
            closeDeleteModalFn();
        }
    });

    // ===== Initialize =====
    checkAuth();
});
