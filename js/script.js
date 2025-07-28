document.addEventListener('DOMContentLoaded', function() {
    // Loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');

    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme') ||
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Update icon based on current theme
    if (savedTheme === 'dark') {
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // Animate module cards sequentially
    const moduleCards = document.querySelectorAll('.module__card');
    moduleCards.forEach((card, index) => {
        const delay = card.getAttribute('data-delay') || index * 100;
        card.style.animationDelay = `${delay}ms`;

        // Add intersection observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(card);
    });

    // Animate dashboard widget
    const widget = document.querySelector('.dashboard-widget');
    if (widget) {
        widget.classList.add('animate__animated', 'animate__fadeIn');
    }

    // Add hover effect to widget items
    const widgetItems = document.querySelectorAll('.widget-item');
    widgetItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Real-time stats update (simulated)
    function updateStats() {
        const stats = [
            Math.floor(Math.random() * 5) + 10, // Orders
            Math.floor(Math.random() * 10),    // Alerts
            Math.floor(Math.random() * 5)       // Messages
        ];

        document.querySelectorAll('.widget-value').forEach((el, i) => {
            gsap.to(el, {
                innerText: stats[i],
                duration: 1,
                snap: { innerText: 1 }
            });
        });
    }

    // Update stats every 30 seconds
    setInterval(updateStats, 30000);

    // Initial update
    updateStats();
});