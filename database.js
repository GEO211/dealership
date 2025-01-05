// Database initialization and structure
const initializeDatabase = async () => {
    const db = firebase.firestore();

    try {
        // Collections structure
        const collections = {
            cars: {
                structure: {
                    make: 'string',
                    model: 'string',
                    year: 'number',
                    price: 'number',
                    mileage: 'number',
                    horsepower: 'number',
                    images: 'array',
                    description: 'string',
                    features: 'array',
                    status: 'string', // available, sold, reserved
                    createdAt: 'timestamp',
                    updatedAt: 'timestamp'
                }
            },
            users: {
                structure: {
                    displayName: 'string',
                    email: 'string',
                    photoURL: 'string',
                    role: 'string', // user, admin
                    savedCars: 'array',
                    createdAt: 'timestamp',
                    lastLogin: 'timestamp'
                }
            },
            contacts: {
                structure: {
                    name: 'string',
                    email: 'string',
                    message: 'string',
                    status: 'string', // new, read, responded
                    createdAt: 'timestamp'
                }
            },
            inquiries: {
                structure: {
                    userId: 'string',
                    carId: 'string',
                    message: 'string',
                    status: 'string', // pending, responded, closed
                    createdAt: 'timestamp'
                }
            }
        };

        // Sample data for cars collection
        const sampleCars = [
            {
                make: 'Porsche',
                model: '911 Carrera',
                year: 2023,
                price: 125000,
                mileage: 12000,
                horsepower: 379,
                images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e'],
                description: 'Pristine condition Porsche 911 Carrera',
                features: ['Sport Chrono Package', 'Premium Sound System', 'Navigation'],
                status: 'available',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            // Add more sample cars as needed
        ];

        // Check if collections exist and create them if they don't
        for (const [collectionName, collectionData] of Object.entries(collections)) {
            const collectionRef = db.collection(collectionName);
            const snapshot = await collectionRef.limit(1).get();

            if (snapshot.empty) {
                console.log(`Initializing ${collectionName} collection...`);
                
                // Add sample data for cars collection
                if (collectionName === 'cars') {
                    for (const car of sampleCars) {
                        await collectionRef.add(car);
                    }
                }

                // Create an empty document to establish collection
                if (collectionName !== 'cars') {
                    await collectionRef.add({
                        _initialized: true,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            }
        }

        console.log('Database structure initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing database:', error);
        return false;
    }
};

// Function to create or update user profile
const createUserProfile = async (user) => {
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(user.uid);

    try {
        const userData = {
            displayName: user.displayName || '',
            email: user.email,
            photoURL: user.photoURL || '',
            role: 'user',
            savedCars: [],
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Check if user exists
        const doc = await userRef.get();
        if (!doc.exists) {
            // New user
            userData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await userRef.set(userData);
        } else {
            // Existing user - update last login
            await userRef.update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        return true;
    } catch (error) {
        console.error('Error creating/updating user profile:', error);
        return false;
    }
};

// Database operations
const db = firebase.firestore();

// Contact Form Handler
async function handleContactSubmission(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    try {
        setButtonLoading(submitBtn, 'Sending...');
        
        const contactData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value,
            status: 'new',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('contacts').add(contactData);
        
        // Add notification
        await addNotification({
            message: 'Thank you for your message! We will get back to you soon.',
            icon: 'fas fa-envelope',
            type: 'success'
        });

        event.target.reset();
        showSuccessMessage('Message sent successfully!');
    } catch (error) {
        console.error('Contact form error:', error);
        showErrorMessage('Error sending message. Please try again.');
    } finally {
        resetButton(submitBtn, originalBtnText);
    }
}

// Financing Application Handler
async function handleFinancingApplication(event) {
    event.preventDefault();
    const submitBtn = document.querySelector('.apply-now-btn');
    const originalBtnText = submitBtn.innerHTML;

    try {
        setButtonLoading(submitBtn, 'Submitting...');
        
        const financingData = {
            carPrice: parseFloat(document.getElementById('carPrice').value),
            downPayment: parseFloat(document.getElementById('downPayment').value),
            loanTerm: parseFloat(document.getElementById('loanTerm').value),
            interestRate: parseFloat(document.getElementById('interestRate').value),
            monthlyPayment: parseFloat(document.getElementById('monthlyPayment').textContent.replace(/[^0-9.-]+/g,"")),
            totalLoan: parseFloat(document.getElementById('totalLoan').textContent.replace(/[^0-9.-]+/g,"")),
            totalInterest: parseFloat(document.getElementById('totalInterest').textContent.replace(/[^0-9.-]+/g,"")),
            totalCost: parseFloat(document.getElementById('totalCost').textContent.replace(/[^0-9.-]+/g,"")),
            applicant: {
                uid: firebase.auth().currentUser?.uid || 'guest',
                email: firebase.auth().currentUser?.email || 'guest',
            },
            status: 'pending',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('financing').add(financingData);
        
        // Add notification
        await addNotification({
            message: 'Financing application submitted successfully!',
            icon: 'fas fa-dollar-sign',
            type: 'success'
        });

        showSuccessMessage('Application submitted successfully!');
    } catch (error) {
        console.error('Financing application error:', error);
        showErrorMessage('Error submitting application. Please try again.');
    } finally {
        resetButton(submitBtn, originalBtnText);
    }
}

// Notification Handler
async function addNotification(notification) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newNotification = {
        ...notification,
        id: Date.now(),
        time: new Date().toISOString(),
        read: false
    };
    
    notifications.unshift(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    updateNotificationBadge();
}

// UI Helpers
function setButtonLoading(button, loadingText) {
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
}

function resetButton(button, originalText) {
    button.disabled = false;
    button.innerHTML = originalText;
}

function showSuccessMessage(message) {
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message,
        timer: 3000,
        showConfirmButton: false
    });
}

function showErrorMessage(message) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message
    });
}

// Quick Contact Form Handler
async function handleQuickContactSubmission(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    try {
        setButtonLoading(submitBtn, 'Sending...');
        
        const contactData = {
            name: document.getElementById('quickName').value,
            email: document.getElementById('quickEmail').value,
            message: document.getElementById('quickMessage').value,
            type: 'quick',
            status: 'new',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('contacts').add(contactData);
        
        // Add notification
        await addNotification({
            message: 'Thanks for your message! We\'ll respond shortly.',
            icon: 'fas fa-envelope',
            type: 'success'
        });

        event.target.reset();
        showQuickSuccessMessage();
    } catch (error) {
        console.error('Quick contact form error:', error);
        showQuickErrorMessage();
    } finally {
        resetButton(submitBtn, originalBtnText);
    }
}

// Quick Contact UI Helpers
function showQuickSuccessMessage() {
    const form = document.getElementById('quickContactForm');
    const successMessage = document.createElement('div');
    successMessage.className = 'quick-success-message';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>Message sent successfully!</p>
    `;
    form.innerHTML = '';
    form.appendChild(successMessage);
    
    setTimeout(() => {
        form.innerHTML = getQuickContactFormHTML();
        setupQuickContactForm();
    }, 3000);
}

function showQuickErrorMessage() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'quick-error-message';
    errorDiv.textContent = 'Error sending message. Please try again.';
    
    const form = document.getElementById('quickContactForm');
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function getQuickContactFormHTML() {
    return `
        <div class="form-group">
            <input type="text" id="quickName" placeholder="Your Name" required>
        </div>
        <div class="form-group">
            <input type="email" id="quickEmail" placeholder="Your Email" required>
        </div>
        <div class="form-group">
            <textarea id="quickMessage" placeholder="Your Message" rows="3" required></textarea>
        </div>
        <button type="submit" class="quick-submit-btn">
            <i class="fas fa-paper-plane"></i> Send
        </button>
    `;
}

function setupQuickContactForm() {
    const quickContactForm = document.getElementById('quickContactForm');
    if (quickContactForm) {
        quickContactForm.addEventListener('submit', handleQuickContactSubmission);
    }
}

// Add this to your initialization code
document.addEventListener('DOMContentLoaded', () => {
    setupQuickContactForm();
});

// Export functions
window.dbInit = {
    initializeDatabase,
    createUserProfile
}; 