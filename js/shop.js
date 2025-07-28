document.addEventListener('DOMContentLoaded', function() {
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
    const resetFiltersBtn = document.getElementById('resetFilters'); // Renamed to avoid conflict
    const priceRange = document.getElementById('priceRange');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const sortBy = document.getElementById('sortBy');
    const categoryBtns = document.querySelectorAll('.category-btn');

    // Expanded product data for Kenyan clothing store
    const products = [
        {
            id: 1,
            title: 'Men\'s Flannel Shirt',
            category: ['men', 'shirts'],
            price: 2499,
            originalPrice: 2999,
            rating: 4.5,
            location: 'Nairobi',
            color: 'red',
            sizes: ['S', 'M', 'L', 'XL'],
            image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            isNew: true
        },
        {
            id: 2,
            title: 'Women\'s Maxi Dress',
            category: ['women', 'dresses'],
            price: 3499,
            originalPrice: 3999,
            rating: 4.8,
            location: 'Mombasa',
            color: 'blue',
            sizes: ['XS', 'S', 'M'],
            image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680e956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 3,
            title: 'Men\'s Chino Trousers',
            category: ['men', 'trousers'],
            price: 1999,
            originalPrice: 2499,
            rating: 4.2,
            location: 'Nairobi',
            color: 'black',
            sizes: ['M', 'L', 'XL'],
            image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            isNew: true
        },
        {
            id: 4,
            title: 'Women\'s Denim Jacket',
            category: ['women'],
            price: 3999,
            originalPrice: 4499,
            rating: 4.7,
            location: 'Kisumu',
            color: 'blue',
            sizes: ['S', 'M', 'L'],
            image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 5,
            title: 'Kids\' T-Shirt Set',
            category: ['kids'],
            price: 1499,
            originalPrice: 1999,
            rating: 4.3,
            location: 'Nakuru',
            color: 'green',
            sizes: ['XS', 'S'],
            image: 'https://images.unsplash.com/photo-1604917018619-6fe5be289a0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            isNew: true
        },
        {
            id: 6,
            title: 'Men\'s Casual Shirt',
            category: ['men', 'shirts'],
            price: 1799,
            originalPrice: 2299,
            rating: 4.0,
            location: 'Eldoret',
            color: 'white',
            sizes: ['S', 'M', 'L'],
            image: 'https://images.unsplash.com/photo-1620012253295-c15cc3b65e8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 7,
            title: 'Women\'s Printed Scarf',
            category: ['women', 'accessories'],
            price: 899,
            originalPrice: 1299,
            rating: 4.6,
            location: 'Nairobi',
            color: 'red',
            sizes: ['One Size'],
            image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 8,
            title: 'Men\'s Leather Belt',
            category: ['men', 'accessories'],
            price: 1299,
            originalPrice: 1599,
            rating: 4.1,
            location: 'Mombasa',
            color: 'black',
            sizes: ['M', 'L'],
            image: 'https://images.unsplash.com/photo-1595341595379-cf0f0f02e8b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 9,
            title: 'Women\'s Ankara Dress',
            category: ['women', 'dresses'],
            price: 2799,
            originalPrice: 3299,
            rating: 4.9,
            location: 'Nairobi',
            color: 'red',
            sizes: ['S', 'M', 'L'],
            image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            isNew: true
        },
        {
            id: 10,
            title: 'Men\'s Kikoi Shorts',
            category: ['men', 'trousers'],
            price: 1599,
            originalPrice: 1999,
            rating: 4.4,
            location: 'Mombasa',
            color: 'blue',
            sizes: ['M', 'L', 'XL'],
            image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 11,
            title: 'Kids\' Denim Overalls',
            category: ['kids'],
            price: 2299,
            originalPrice: 2799,
            rating: 4.7,
            location: 'Nairobi',
            color: 'blue',
            sizes: ['XS', 'S', 'M'],
            image: 'https://images.unsplash.com/photo-1601944179066-29786cb9d32a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 12,
            title: 'Women\'s Kitenge Handbag',
            category: ['women', 'accessories'],
            price: 1899,
            originalPrice: 2299,
            rating: 4.5,
            location: 'Kisumu',
            color: 'green',
            sizes: ['One Size'],
            image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            isNew: true
        },
        {
            id: 13,
            title: 'Men\'s Business Suit',
            category: ['men'],
            price: 5999,
            originalPrice: 6999,
            rating: 4.8,
            location: 'Nairobi',
            color: 'black',
            sizes: ['S', 'M', 'L', 'XL'],
            image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 14,
            title: 'Women\'s Office Blouse',
            category: ['women', 'shirts'],
            price: 1999,
            originalPrice: 2499,
            rating: 4.3,
            location: 'Nakuru',
            color: 'white',
            sizes: ['XS', 'S', 'M', 'L'],
            image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 15,
            title: 'Unisex Baseball Cap',
            category: ['men', 'women', 'accessories'],
            price: 799,
            originalPrice: 999,
            rating: 4.0,
            location: 'Eldoret',
            color: 'black',
            sizes: ['One Size'],
            image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        }
    ];

    // User data
    let user = {
        wishlist: [],
        cart: []
    };

    // Initialize the page
    function initPage() {
        // Load products
        loadProducts(products);

        // Load user data from localStorage if available
        const savedUser = localStorage.getItem('shopUser');
        if (savedUser) {
            user = JSON.parse(savedUser);
            updateWishlistCount();
            updateCartCount();
        }

        // Set price range values
        updatePriceRange();

        // Hide loading overlay after a short delay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 1000);
    }

    // Format currency for KES
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Load products into the grid
    function loadProducts(productsToLoad) {
        let html = '';

        productsToLoad.forEach(product => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

            html += `
                <div class="product-card" data-id="${product.id}" data-category="${product.category.join(' ')}" data-price="${product.price}" data-rating="${product.rating}" data-location="${product.location}" data-color="${product.color}" data-sizes="${product.sizes.join(',')}">
                    ${product.isNew ? '<span class="product-badge">NEW</span>' : discount > 0 ? `<span class="product-badge">${discount}% OFF</span>` : ''}
                    <img src="${product.image}" alt="${product.title}" class="product-image" onerror="this.src='https://via.placeholder.com/300x400?text=Product+Image'">
                    <div class="product-info">
                        <h3 class="product-title">${product.title}</h3>
                        <div class="product-price">
                            <span class="current-price">KSh ${formatCurrency(product.price)}</span>
                            ${product.originalPrice > product.price ? `<span class="original-price">KSh ${formatCurrency(product.originalPrice)}</span>` : ''}
                        </div>
                        <div class="product-rating">
                            ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}
                            ${product.rating % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                            ${'<i class="far fa-star"></i>'.repeat(5 - Math.ceil(product.rating))}
                            <span>(${product.rating})</span>
                        </div>
                        <div class="product-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${product.location}</span>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn-icon wishlist-btn" title="Add to wishlist">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="btn-add-to-cart">Add to Cart</button>
                    </div>
                </div>
            `;
        });

        productsContainer.innerHTML = html;

        // Add event listeners to the new buttons
        addProductEventListeners();
    }

    // Add event listeners to product buttons
    function addProductEventListeners() {
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const productId = parseInt(this.closest('.product-card').dataset.id);
                toggleWishlist(productId);
            });
        });

        document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const productId = parseInt(this.closest('.product-card').dataset.id);
                addToCart(productId);
            });
        });

        // Update wishlist button states for products already in wishlist
        if (user.wishlist.length > 0) {
            user.wishlist.forEach(productId => {
                const heartIcon = document.querySelector(`.product-card[data-id="${productId}"] .wishlist-btn i`);
                if (heartIcon) {
                    heartIcon.classList.remove('far', 'fa-heart');
                    heartIcon.classList.add('fas', 'fa-heart');
                }
            });
        }
    }

    // Toggle product in wishlist
    function toggleWishlist(productId) {
        const index = user.wishlist.indexOf(productId);
        const heartIcon = document.querySelector(`.product-card[data-id="${productId}"] .wishlist-btn i`);

        if (index === -1) {
            // Add to wishlist
            user.wishlist.push(productId);
            heartIcon.classList.remove('far', 'fa-heart');
            heartIcon.classList.add('fas', 'fa-heart');
            showNotification('Added to wishlist');
        } else {
            // Remove from wishlist
            user.wishlist.splice(index, 1);
            heartIcon.classList.remove('fas', 'fa-heart');
            heartIcon.classList.add('far', 'fa-heart');
            showNotification('Removed from wishlist');
        }

        updateWishlistCount();
        saveUserData();
    }

    // Add product to cart
    function addToCart(productId) {
        const existingItem = user.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cart.push({
                id: productId,
                quantity: 1
            });
        }

        updateCartCount();
        saveUserData();

        // Show a quick notification
        showNotification('Item added to cart');
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Update wishlist count display
    function updateWishlistCount() {
        wishlistCount.textContent = user.wishlist.length;

        if (user.wishlist.length > 0) {
            wishlistCount.style.display = 'flex';
        } else {
            wishlistCount.style.display = 'none';
        }
    }

    // Update cart count display
    function updateCartCount() {
        const totalItems = user.cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;

        if (totalItems > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }

    // Load wishlist modal content
    function loadWishlist() {
        if (user.wishlist.length === 0) {
            wishlistContainer.style.display = 'none';
            wishlistEmpty.style.display = 'flex';
            return;
        }

        let html = '';
        const wishlistProducts = products.filter(product => user.wishlist.includes(product.id));

        wishlistProducts.forEach(product => {
            html += `
                <div class="wishlist-item" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.title}" class="wishlist-item-img" onerror="this.src='https://via.placeholder.com/300x400?text=Product+Image'">
                    <div class="wishlist-item-details">
                        <h4 class="wishlist-item-title">${product.title}</h4>
                        <p class="wishlist-item-price">KSh ${formatCurrency(product.price)}</p>
                        <p class="wishlist-item-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${product.location}
                        </p>
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="wishlist-remove" title="Remove">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn-primary move-to-cart">Add to Cart</button>
                    </div>
                </div>
            `;
        });

        wishlistContainer.innerHTML = html;
        wishlistContainer.style.display = 'block';
        wishlistEmpty.style.display = 'none';

        // Add event listeners to wishlist items
        document.querySelectorAll('.wishlist-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.closest('.wishlist-item').dataset.id);
                removeFromWishlist(productId);
            });
        });

        document.querySelectorAll('.move-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.closest('.wishlist-item').dataset.id);
                addToCart(productId);
                showNotification('Item moved to cart');
            });
        });
    }

    // Remove item from wishlist
    function removeFromWishlist(productId) {
        const index = user.wishlist.indexOf(productId);
        if (index !== -1) {
            user.wishlist.splice(index, 1);
            saveUserData();
            updateWishlistCount();
            loadWishlist();

            // Update heart icon in products grid
            const heartIcon = document.querySelector(`.product-card[data-id="${productId}"] .wishlist-btn i`);
            if (heartIcon) {
                heartIcon.classList.remove('fas', 'fa-heart');
                heartIcon.classList.add('far', 'fa-heart');
            }
        }
    }

    // Load cart modal content
    function loadCart() {
        if (user.cart.length === 0) {
            cartContainer.style.display = 'none';
            cartEmpty.style.display = 'flex';
            cartSummary.style.display = 'none';
            return;
        }

        let html = '';
        let subtotal = 0;

        user.cart.forEach(cartItem => {
            const product = products.find(p => p.id === cartItem.id);
            if (product) {
                const itemTotal = product.price * cartItem.quantity;
                subtotal += itemTotal;

                html += `
                    <div class="cart-item" data-id="${product.id}">
                        <img src="${product.image}" alt="${product.title}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/300x400?text=Product+Image'">
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${product.title}</h4>
                            <p class="cart-item-price">KSh ${formatCurrency(product.price)}</p>
                            <p class="cart-item-location">
                                <i class="fas fa-map-marker-alt"></i>
                                ${product.location}
                            </p>
                        </div>
                        <div class="cart-item-actions">
                            <button class="cart-remove" title="Remove">
                                <i class="fas fa-trash"></i>
                            </button>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease">-</button>
                                <input type="number" class="quantity-input" value="${cartItem.quantity}" min="1">
                                <button class="quantity-btn increase">+</button>
                            </div>
                            <p class="item-total">KSh ${formatCurrency(itemTotal)}</p>
                        </div>
                    </div>
                `;
            }
        });

        cartContainer.innerHTML = html;
        cartContainer.style.display = 'block';
        cartEmpty.style.display = 'none';
        cartSummary.style.display = 'block';

        // Calculate totals
        const delivery = subtotal > 5000 ? 0 : 300;
        const total = subtotal + delivery;

        cartSubtotal.textContent = `KSh ${formatCurrency(subtotal)}`;
        cartDelivery.textContent = delivery === 0 ? 'FREE' : `KSh ${formatCurrency(delivery)}`;
        cartTotal.textContent = `KSh ${formatCurrency(total)}`;

        // Add event listeners to cart items
        document.querySelectorAll('.cart-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.closest('.cart-item').dataset.id);
                removeFromCart(productId);
            });
        });

        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.closest('.cart-item').dataset.id);
                updateCartQuantity(productId, -1);
            });
        });

        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.closest('.cart-item').dataset.id);
                updateCartQuantity(productId, 1);
            });
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const productId = parseInt(this.closest('.cart-item').dataset.id);
                const newQuantity = parseInt(this.value) || 1;
                updateCartQuantity(productId, 0, newQuantity);
            });
        });
    }

    // Remove item from cart
    function removeFromCart(productId) {
        const index = user.cart.findIndex(item => item.id === productId);
        if (index !== -1) {
            user.cart.splice(index, 1);
            saveUserData();
            updateCartCount();
            loadCart();
            showNotification('Item removed from cart');
        }
    }

    // Update cart item quantity
    function updateCartQuantity(productId, change, newQuantity = null) {
        const item = user.cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity !== null) {
                item.quantity = newQuantity;
            } else {
                item.quantity += change;
            }

            // Ensure quantity is at least 1
            if (item.quantity < 1) {
                item.quantity = 1;
            }

            saveUserData();
            loadCart();
            updateCartCount();
        }
    }

    // Save user data to localStorage
    function saveUserData() {
        localStorage.setItem('shopUser', JSON.stringify(user));
    }

    // Update price range display
    function updatePriceRange() {
        minPrice.textContent = formatCurrency(priceRange.min);
        maxPrice.textContent = formatCurrency(priceRange.value);
    }

    // Filter products based on selected filters
    function filterProducts() {
        const selectedCategory = document.querySelector('.category-btn.active').dataset.category;
        const priceMin = parseInt(priceRange.min);
        const priceMax = parseInt(priceRange.value);
        const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(el => el.value);
        const selectedColors = Array.from(document.querySelectorAll('input[name="color"]:checked')).map(el => el.value);
        const selectedLocation = document.querySelector('.location-filter').value;
        const sortOption = sortBy.value;

        let filteredProducts = [...products];

        // Filter by category
        if (selectedCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product =>
                product.category.includes(selectedCategory)
            );
        }

        // Filter by price
        filteredProducts = filteredProducts.filter(product =>
            product.price >= priceMin && product.price <= priceMax
        );

        // Filter by size
        if (selectedSizes.length > 0) {
            filteredProducts = filteredProducts.filter(product =>
                selectedSizes.some(size => product.sizes.includes(size))
            );
        }

        // Filter by color
        if (selectedColors.length > 0) {
            filteredProducts = filteredProducts.filter(product =>
                selectedColors.includes(product.color)
            );
        }

        // Filter by location
        if (selectedLocation) {
            filteredProducts = filteredProducts.filter(product =>
                product.location === selectedLocation
            );
        }

        // Sort products
        switch (sortOption) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                // Assuming newer products have higher IDs
                filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // 'popular' - we'll use rating as a proxy for popularity
                filteredProducts.sort((a, b) => b.rating - a.rating);
        }

        loadProducts(filteredProducts);
    }

    // Reset all filters
    function resetAllFilters() {
        // Reset category
        document.querySelector('.category-btn[data-category="all"]').classList.add('active');
        document.querySelectorAll('.category-btn:not([data-category="all"])').forEach(btn => {
            btn.classList.remove('active');
        });

        // Reset price range
        priceRange.value = priceRange.max;
        updatePriceRange();

        // Reset size filters
        document.querySelectorAll('input[name="size"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset color filters
        document.querySelectorAll('input[name="color"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset location filter
        document.querySelector('.location-filter').value = '';

        // Reset sort option
        sortBy.value = 'popular';

        // Reload all products
        loadProducts(products);
    }

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('shopTheme', newTheme);

        // Update icon
        const icon = this.querySelector('.theme-icon');
        if (newTheme === 'light') {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });

    // Account Modal
    accountBtn.addEventListener('click', function() {
        accountModal.classList.add('active');
    });

    accountClose.addEventListener('click', function() {
        accountModal.classList.remove('active');
    });

    accountModal.addEventListener('click', function(e) {
        if (e.target === this) {
            accountModal.classList.remove('active');
        }
    });

    // Wishlist Modal
    wishlistBtn.addEventListener('click', function() {
        loadWishlist();
        wishlistModal.classList.add('active');
    });

    wishlistClose.addEventListener('click', function() {
        wishlistModal.classList.remove('active');
    });

    wishlistModal.addEventListener('click', function(e) {
        if (e.target === this) {
            wishlistModal.classList.remove('active');
        }
    });

    // Cart Modal
    cartBtn.addEventListener('click', function() {
        loadCart();
        cartModal.classList.add('active');
    });

    cartClose.addEventListener('click', function() {
        cartModal.classList.remove('active');
    });

    cartModal.addEventListener('click', function(e) {
        if (e.target === this) {
            cartModal.classList.remove('active');
        }
    });

    // Checkout Button
    checkoutBtn.addEventListener('click', function() {
        // In a real app, this would redirect to a checkout page
        alert('Redirecting to checkout page...');
    });

    // Price Range Slider
    priceRange.addEventListener('input', function() {
        updatePriceRange();
    });

    // Apply Filters Button
    applyFilters.addEventListener('click', function() {
        filterProducts();
    });

    // Reset Filters Button
    resetFiltersBtn.addEventListener('click', function() {
        resetAllFilters();
    });

    // Category Buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.category-btn.active').classList.remove('active');
            this.classList.add('active');
            filterProducts();
        });
    });

    // Sort Options
    sortBy.addEventListener('change', function() {
        filterProducts();
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('shopTheme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Update icon
        const icon = themeToggle.querySelector('.theme-icon');
        if (savedTheme === 'light') {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    // Show loading overlay initially
    morphOverlay.classList.add('active');

    // Initialize the page
    initPage();
});