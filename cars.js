// Sample car data with real image links
const cars = [
    {
        id: 1,
        make: 'Mercedes-Benz',
        model: 'S-Class',
        year: 2024,
        price: 110000,
        image: 'https://images.unsplash.com/photo-1622194993374-56c0a8e6f9d9?q=80&w=1000&auto=format&fit=crop',
        description: 'Luxury sedan with advanced features',
        specs: {
            engine: '4.0L V8 Biturbo',
            power: '496 hp',
            acceleration: '4.4 sec 0-60 mph'
        }
    },
    {
        id: 2,
        make: 'BMW',
        model: '7 Series',
        year: 2024,
        price: 95000,
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000&auto=format&fit=crop',
        description: 'Executive luxury vehicle',
        specs: {
            engine: '3.0L I6 Turbo',
            power: '375 hp',
            acceleration: '5.0 sec 0-60 mph'
        }
    },
    {
        id: 3,
        make: 'Audi',
        model: 'A8',
        year: 2024,
        price: 89000,
        image: 'https://images.unsplash.com/photo-1614026480209-cd9934144671?q=80&w=1000&auto=format&fit=crop',
        description: 'Premium luxury sedan',
        specs: {
            engine: '3.0L V6 Turbo',
            power: '335 hp',
            acceleration: '5.6 sec 0-60 mph'
        }
    },
    {
        id: 4,
        make: 'Porsche',
        model: 'Panamera',
        year: 2024,
        price: 105000,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop',
        description: 'Sports luxury sedan',
        specs: {
            engine: '2.9L V6 Twin-Turbo',
            power: '325 hp',
            acceleration: '5.3 sec 0-60 mph'
        }
    },
    {
        id: 5,
        make: 'Lexus',
        model: 'LS 500',
        year: 2024,
        price: 78000,
        image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1000&auto=format&fit=crop',
        description: 'Japanese luxury flagship',
        specs: {
            engine: '3.5L V6 Twin-Turbo',
            power: '416 hp',
            acceleration: '4.6 sec 0-60 mph'
        }
    },
    {
        id: 6,
        make: 'Bentley',
        model: 'Flying Spur',
        year: 2024,
        price: 215000,
        image: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=1000&auto=format&fit=crop',
        description: 'Ultra-luxury performance',
        specs: {
            engine: '6.0L W12 Twin-Turbo',
            power: '626 hp',
            acceleration: '3.7 sec 0-60 mph'
        }
    }
];

// Enhanced car card creation with more details
function createCarCard(car) {
    return `
        <div class="car-card">
            <div class="car-image-container">
                <img src="${car.image}" alt="${car.make} ${car.model}" class="car-image">
                <div class="car-badge">${car.year}</div>
            </div>
            <div class="car-details">
                <h3>${car.make} ${car.model}</h3>
                <div class="car-specs">
                    <p class="engine"><i class="fas fa-engine"></i> ${car.specs.engine}</p>
                    <p class="power"><i class="fas fa-bolt"></i> ${car.specs.power}</p>
                </div>
                <p class="price">$${car.price.toLocaleString()}</p>
                <p class="description">${car.description}</p>
                <div class="car-actions">
                    <button onclick="viewDetails(${car.id})" class="view-details">
                        <i class="fas fa-info-circle"></i> View Details
                    </button>
                    <button onclick="saveCar(${car.id})" class="save-car">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Enhanced view details function with modal
function viewDetails(carId) {
    const car = cars.find(c => c.id === carId);
    if (car) {
        const modal = document.createElement('div');
        modal.className = 'car-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-header">
                    <h2>${car.make} ${car.model} ${car.year}</h2>
                </div>
                <div class="modal-body">
                    <img src="${car.image}" alt="${car.make} ${car.model}">
                    <div class="car-specs-detailed">
                        <h3>Specifications</h3>
                        <p><strong>Engine:</strong> ${car.specs.engine}</p>
                        <p><strong>Power:</strong> ${car.specs.power}</p>
                        <p><strong>Acceleration:</strong> ${car.specs.acceleration}</p>
                    </div>
                    <div class="car-price-section">
                        <h3>Price</h3>
                        <p class="modal-price">$${car.price.toLocaleString()}</p>
                        <button class="inquire-btn">Inquire Now</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => modal.remove();

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.remove();
            }
        };
    }
}

// Save car functionality
function saveCar(carId) {
    const button = event.currentTarget;
    button.classList.toggle('saved');
    if (button.classList.contains('saved')) {
        button.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
        button.innerHTML = '<i class="far fa-heart"></i>';
    }
}

// Function to load cars
function loadCars() {
    const carGrid = document.querySelector('.car-grid');
    carGrid.innerHTML = cars.map(car => createCarCard(car)).join('');
}

// Search functionality
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCars = cars.filter(car => 
            car.make.toLowerCase().includes(searchTerm) ||
            car.model.toLowerCase().includes(searchTerm) ||
            car.year.toString().includes(searchTerm)
        );
        const carGrid = document.querySelector('.car-grid');
        carGrid.innerHTML = filteredCars.map(car => createCarCard(car)).join('');
    });
}

// Load cars when the page loads
document.addEventListener('DOMContentLoaded', loadCars);

// Profile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const profileMenu = document.querySelector('.profile-menu');
    const dropdown = document.querySelector('.profile-dropdown');

    if (profileMenu && dropdown) {
        profileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', () => {
            dropdown.style.display = 'none';
        });
    }
}); 