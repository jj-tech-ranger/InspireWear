document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const productsContainer = document.getElementById('productsContainer');
    const accountBtn = document.getElementById('accountBtn');
    const accountModal = document.getElementById('accountModal');
    const accountClose = document.getElementById('accountClose');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistModal = document.getElementById('wishlistModal');
    const wishlistClose = document.getElementById('wishlistClose');
    const wishlistContainer = document.getElementById('wishlistContainer');
    const wishlistEmpty = document.getElementById('wishlistEmpty');
    const wishlistCount = document.getElementById('wishlistCount');
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const cartClose = document.getElementById('cartClose');
    const cartContainer = document.getElementById('cartContainer');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartCount = document.getElementById('cartCount');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartDelivery = document.getElementById('cartDelivery');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartSummary = document.getElementById('cartSummary');
    const applyFilters = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const priceRange = document.getElementById('priceRange');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const sortBy = document.getElementById('sortBy');
    const categoryBtns = document.querySelectorAll('.category-btn');

    // In-memory data stores
    let products = [];
    let user = {
        wishlist: [],
        cart: []
    };

    // --- API Communication ---
    /**
     * Fetches data from the backend API.
     * @param {string} endpoint - The API endpoint to fetch from.
     * @param {object} [options={}] - Optional fetch options (method, headers, body).
     * @returns {Promise<any>} - The JSON response from the API.
     */
    async function fetchFromAPI(endpoint, options = {}) {
        morphOverlay.classList.add('active');
        try {
            const response = await fetch(endpoint, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            showNotification('Failed to load data from the server.', 'error');
            throw error; // Re-throw to allow caller to handle
        } finally {
            // Use a timeout to prevent the overlay from disappearing too quickly
            setTimeout(() => morphOverlay.classList.remove('active'), 500);
        }
    }


    // --- Initialization ---
    /**
     * Initializes the page by fetching products and user data.
     */
    async function initPage() {
        try {
            // Fetch products and user data concurrently
            const [productsData, userData] = await Promise.all([
                fetchFromAPI('/api/products'),
                fetchFromAPI('/api/user')
            ]);

            products = productsData || [];
            user = userData || { wishlist: [], cart: [] };

            loadProducts(products);
            updateWishlistCount();
            updateCartCount();
            updatePriceRange();

        } catch (error) {
            console.error("Initialization failed:", error);
            productsContainer.innerHTML = '<p class="error-message">Could not load products. Please try again later.</p>';
        }
    }


    // --- UI & Display Functions ---
    /**
     * Formats a number as Kenyan Shillings.
     * @param {number} amount - The amount to format.
     * @returns {string} - The formatted currency string.
     */
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Renders a list of products to the DOM.
     * @param {Array<object>} productsToLoad - The array of product objects to display.
     */
    function loadProducts(productsToLoad) {
        if (!productsToLoad || productsToLoad.length === 0) {
            productsContainer.innerHTML = '<p>No products found. Try adjusting your filters.</p>';
            return;
        }

        let html = productsToLoad.map(product => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            const isInWishlist = user.wishlist.includes(product.id);

            return `
                <div class="product-card" data-id="${product.id}" data-category="${product.category.join(' ')}" data-price="${product.price}" data-rating="${product.rating}">
                    ${product.isNew ? '<span class="product-badge">NEW</span>' : discount > 0 ? `<span class="product-badge">${discount}% OFF</span>` : ''}
                    <img src="${product.image}" alt="${product.title}" class="product-image" onerror="this.src='https://via.placeholder.com/300x400?text=Image+Not+Found'">
                    <div class="product-info">
                        <h3 class="product-title">${product.title}</h3>
                        <div class="product-price">
                            <span class="current-price">${formatCurrency(product.price)}</span>
                            ${product.originalPrice > product.price ? `<span class="original-price">${formatCurrency(product.originalPrice)}</span>` : ''}
                        </div>
                        <div class="product-rating">
                            ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}
                            ${product.rating % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                            ${'<i class="far fa-star"></i>'.repeat(5 - Math.ceil(product.rating))}
                            <span>(${product.rating})</span>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn-icon wishlist-btn" title="${isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}">
                            <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        <button class="btn-add-to-cart">Add to Cart</button>
                    </div>
                </div>
            `;
        }).join('');

        productsContainer.innerHTML = html;
        addProductEventListeners();
    }

    /**
     * Shows a notification message.
     * @param {string} message - The message to display.
     * @param {string} [type='success'] - The type of notification ('success' or 'error').
     */
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    // --- Wishlist, Cart, and User Data Management ---

    /**
     * Toggles a product in the user's wishlist and updates the server.
     * @param {number} productId - The ID of the product.
     */
    async function toggleWishlist(productId) {
        const index = user.wishlist.indexOf(productId);
        const heartIcon = document.querySelector(`.product-card[data-id="${productId}"] .wishlist-btn i`);

        if (index === -1) {
            user.wishlist.push(productId);
            if (heartIcon) heartIcon.className = 'fas fa-heart';
            showNotification('Added to wishlist');
        } else {
            user.wishlist.splice(index, 1);
            if (heartIcon) heartIcon.className = 'far fa-heart';
            showNotification('Removed from wishlist');
        }

        updateWishlistCount();
        try {
            await updateUserOnServer();
        } catch (error) {
            showNotification('Could not update wishlist.', 'error');
            // Revert optimistic UI update on failure
            user.wishlist.includes(productId) ? user.wishlist.splice(user.wishlist.indexOf(productId), 1) : user.wishlist.push(productId);
            if (heartIcon) heartIcon.className = user.wishlist.includes(productId) ? 'fas fa-heart' : 'far fa-heart';
            updateWishlistCount();
        }
    }

    /**
     * Adds a product to the cart and updates the server.
     * @param {number} productId - The ID of the product.
     */
    async function addToCart(productId) {
        const existingItem = user.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            user.cart.push({ id: productId, quantity: 1 });
        }

        updateCartCount();
        showNotification('Item added to cart');

        try {
            await updateUserOnServer();
        } catch (error) {
            showNotification('Could not update cart.', 'error');
            // Revert optimistic UI update
            const item = user.cart.find(item => item.id === productId);
            if (item.quantity > 1) item.quantity--;
            else user.cart.pop();
            updateCartCount();
        }
    }

    /**
     * Sends the current user object to the server.
     */
    async function updateUserOnServer() {
        await fetchFromAPI('/api/user/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
    }


    // --- Filtering and Sorting ---

    /**
     * Fetches products from the API based on current filter settings.
     */
    async function filterProducts() {
        const params = new URLSearchParams();
        const selectedCategory = document.querySelector('.category-btn.active').dataset.category;
        if (selectedCategory !== 'all') {
            params.append('category', selectedCategory);
        }
        params.append('price_max', priceRange.value);
        params.append('sort_by', sortBy.value);

        // Add other filters like size, color, location if needed
        // const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(el => el.value);
        // if (selectedSizes.length > 0) params.append('sizes', selectedSizes.join(','));

        try {
            const filteredProducts = await fetchFromAPI(`/api/products?${params.toString()}`);
            products = filteredProducts || [];
            loadProducts(products);
        } catch (error) {
            showNotification('Could not apply filters.', 'error');
        }
    }

    /**
     * Resets all filters to their default state and reloads all products.
     */
    function resetAllFilters() {
        // Reset UI
        document.querySelector('.category-btn.active').classList.remove('active');
        document.querySelector('.category-btn[data-category="all"]').classList.add('active');
        priceRange.value = priceRange.max;
        sortBy.value = 'popular';
        // Reset other filter inputs...

        updatePriceRange();
        // Refetch all products
        initPage();
    }


    // --- Event Listeners ---
    function addProductEventListeners() {
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const productId = parseInt(this.closest('.product-card').dataset.id);
                toggleWishlist(productId);
            });
        });

        document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const productId = parseInt(this.closest('.product-card').dataset.id);
                addToCart(productId);
            });
        });
    }

    // Modal listeners
    [accountBtn, wishlistBtn, cartBtn].forEach(btn => {
        btn.addEventListener('click', function () {
            const modalId = this.id.replace('Btn', 'Modal');
            document.getElementById(modalId).classList.add('active');
            // Potentially load modal content here, e.g., loadCart(), loadWishlist()
        });
    });

    [accountClose, wishlistClose, cartClose].forEach(btn => {
        btn.addEventListener('click', function () {
            this.closest('.modal').classList.remove('active');
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) this.classList.remove('active');
        });
    });

    // Filter and sort listeners
    applyFilters.addEventListener('click', filterProducts);
    resetFiltersBtn.addEventListener('click', resetAllFilters);
    priceRange.addEventListener('input', updatePriceRange);
    sortBy.addEventListener('change', filterProducts);
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelector('.category-btn.active').classList.remove('active');
            this.classList.add('active');
            filterProducts();
        });
    });

    // Theme toggle
    themeToggle.addEventListener('click', function () {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('shopTheme', newTheme);
        this.querySelector('.theme-icon').className = `theme-icon fas ${newTheme === 'light' ? 'fa-moon' : 'fa-sun'}`;
    });

    // --- Initial Load ---
    // Set theme from localStorage
    const savedTheme = localStorage.getItem('shopTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.querySelector('.theme-icon').className = `theme-icon fas ${savedTheme === 'light' ? 'fa-moon' : 'fa-sun'}`;

    // Start the application
    initPage();
});