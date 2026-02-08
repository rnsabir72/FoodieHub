// ===== Default Menu Data =====
const DEFAULT_MENU_ITEMS = [
    // ===== BURGERS =====
    {
        id: 1,
        name: "Classic Beef Burger",
        category: "burger",
        description: "Juicy beef patty with fresh lettuce, tomato, onion, and our special sauce on a toasted sesame bun.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=350&fit=crop",
        prices: {
            small: 450,
            medium: 650,
            large: 850
        }
    },
    {
        id: 2,
        name: "Chicken Zinger Burger",
        category: "burger",
        description: "Crispy fried chicken fillet with coleslaw, pickles, and spicy mayo in a soft brioche bun.",
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&h=350&fit=crop",
        prices: {
            small: 400,
            medium: 600,
            large: 800
        }
    },
    {
        id: 3,
        name: "Double Smash Burger",
        category: "burger",
        description: "Two smashed beef patties with melted cheese, caramelized onions, and smoky BBQ sauce.",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&h=350&fit=crop",
        prices: {
            small: 550,
            medium: 750,
            large: 950
        }
    },

    // ===== PIZZAS =====
    {
        id: 4,
        name: "Margherita Pizza",
        category: "pizza",
        description: "Classic Italian pizza with fresh mozzarella, San Marzano tomato sauce, and fragrant basil leaves.",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=350&fit=crop",
        prices: {
            small: 600,
            medium: 900,
            large: 1200
        }
    },
    {
        id: 5,
        name: "Pepperoni Supreme",
        category: "pizza",
        description: "Loaded with spicy pepperoni, mozzarella cheese, and our signature tomato sauce on a crispy crust.",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=350&fit=crop",
        prices: {
            small: 700,
            medium: 1000,
            large: 1400
        }
    },
    {
        id: 6,
        name: "BBQ Chicken Pizza",
        category: "pizza",
        description: "Smoky BBQ sauce base topped with grilled chicken, red onions, bell peppers, and mozzarella.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=350&fit=crop",
        prices: {
            small: 750,
            medium: 1050,
            large: 1450
        }
    },

    // ===== SANDWICHES =====
    {
        id: 7,
        name: "Club Sandwich",
        category: "sandwich",
        description: "Triple-decker sandwich with grilled chicken, turkey, bacon, lettuce, tomato, and mayo.",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&h=350&fit=crop",
        prices: {
            small: 350,
            medium: 500,
            large: 700
        }
    },
    {
        id: 8,
        name: "Grilled Panini",
        category: "sandwich",
        description: "Pressed Italian sandwich with mozzarella, sun-dried tomatoes, pesto, and grilled vegetables.",
        image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=500&h=350&fit=crop",
        prices: {
            small: 400,
            medium: 550,
            large: 750
        }
    },
    {
        id: 9,
        name: "Philly Cheesesteak",
        category: "sandwich",
        description: "Thinly sliced beef steak with melted provolone cheese, sautéed onions, and peppers on a hoagie roll.",
        image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&h=350&fit=crop",
        prices: {
            small: 500,
            medium: 700,
            large: 900
        }
    }
];

// ===== Admin Credentials =====
const ADMIN_CREDENTIALS = {
    id: "admin",
    password: "admin123"
};

// ===== Data Manager =====
const DataManager = {
    // Get all menu items from localStorage or use defaults
    getMenuItems() {
        const stored = localStorage.getItem('foodiehub_menu');
        if (stored) {
            return JSON.parse(stored);
        }
        // Initialize with default items
        this.saveMenuItems(DEFAULT_MENU_ITEMS);
        return DEFAULT_MENU_ITEMS;
    },

    // Save menu items to localStorage
    saveMenuItems(items) {
        localStorage.setItem('foodiehub_menu', JSON.stringify(items));
    },

    // Add a new item
    addItem(item) {
        const items = this.getMenuItems();
        // Generate new ID
        const maxId = items.reduce((max, i) => Math.max(max, i.id), 0);
        item.id = maxId + 1;
        items.push(item);
        this.saveMenuItems(items);
        return item;
    },

    // Update an existing item
    updateItem(id, updatedData) {
        const items = this.getMenuItems();
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updatedData, id: id };
            this.saveMenuItems(items);
            return items[index];
        }
        return null;
    },

    // Delete an item
    deleteItem(id) {
        let items = this.getMenuItems();
        items = items.filter(item => item.id !== id);
        this.saveMenuItems(items);
        return true;
    },

    // Get items by category
    getItemsByCategory(category) {
        const items = this.getMenuItems();
        if (category === 'all') return items;
        return items.filter(item => item.category === category);
    },

    // Get single item by ID
    getItemById(id) {
        const items = this.getMenuItems();
        return items.find(item => item.id === id);
    },

    // Get category counts
    getCategoryCounts() {
        const items = this.getMenuItems();
        return {
            burger: items.filter(i => i.category === 'burger').length,
            pizza: items.filter(i => i.category === 'pizza').length,
            sandwich: items.filter(i => i.category === 'sandwich').length,
            total: items.length
        };
    },

    // Reset to default items
    resetToDefaults() {
        this.saveMenuItems(DEFAULT_MENU_ITEMS);
        return DEFAULT_MENU_ITEMS;
    }
};
