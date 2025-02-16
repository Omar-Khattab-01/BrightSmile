// In services_script.js
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const body = document.body;
    const html = document.documentElement;
    //const searchInput = document.getElementById('serviceSearch');
    const serviceItems = document.querySelectorAll('.service-item');
    
    // Create back to top button
    const backToTop = document.createElement('a');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    body.appendChild(backToTop);

    // Debounce function
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Scroll handler
    const handleScroll = debounce(() => {
        backToTop.classList.toggle('visible', window.pageYOffset > 300);
    }, 150);

    window.addEventListener('scroll', handleScroll);

    // Back to top click handler
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Search functionality
    const handleSearch = debounce(function() {
        const searchTerm = this.value.toLowerCase();
        
        serviceItems.forEach(item => {
            const title = item.querySelector('h2').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            const isVisible = title.includes(searchTerm) || description.includes(searchTerm);
            
            item.classList.toggle('hidden', !isVisible);
            if (isVisible && typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        });
    }, 300);

    //searchInput.addEventListener('input', handleSearch);

    // Set smooth scroll behavior
    html.style.scrollBehavior = 'smooth';
    
    // Initialize AOS library
    if (typeof AOS !== 'undefined') {
        AOS.init({
            disable: window.innerWidth < 768,
            offset: 120,
            duration: 800,
            easing: 'ease-in-out',
            once: false,
            mirror: true,
            delay: 100
        });
    }

    // Add event delegation for service items
    const serviceContainer = document.querySelector('.service-container');
    if (serviceContainer) {
        serviceContainer.addEventListener('mouseover', (e) => {
            const item = e.target.closest('.service-item');
            if (item) {
                item.classList.add('hover');
            }
        });

        serviceContainer.addEventListener('mouseout', (e) => {
            const item = e.target.closest('.service-item');
            if (item) {
                item.classList.remove('hover');
            }
        });
    }

    // Service selection and redirect functionality
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            // Get the service name from the h2 element inside the service item
            const serviceName = item.querySelector('h2').textContent.trim();
            
            // Store the selected service in localStorage
            localStorage.setItem('selectedService', serviceName);
            
            // Redirect to the booking page
            window.location.href = 'Book.html';
        });
    });
});


