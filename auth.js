// Auth protection
function checkAuth() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // Check if user is guest
                if (user.isAnonymous) {
                    sessionStorage.setItem('isGuest', 'true');
                }
                resolve(user);
            } else {
                reject('Not authenticated');
            }
        });
    });
}

async function protectPage() {
    try {
        const user = await checkAuth();
        // Update UI based on user type
        if (user.isAnonymous) {
            document.body.classList.add('guest-mode');
            // Disable certain features for guests
            disableGuestFeatures();
        }
        document.body.classList.remove('content-loading');
    } catch (error) {
        window.location.href = 'login.html';
    }
}

// Handle logout
function logout() {
    firebase.auth().signOut().then(() => {
        sessionStorage.removeItem('isAuthenticated');
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Logout Error:', error);
    });
}

// Add function to handle guest limitations
function disableGuestFeatures() {
    // Disable saving cars
    const saveButtons = document.querySelectorAll('.save-car');
    saveButtons.forEach(btn => {
        btn.disabled = true;
        btn.title = 'Create an account to save cars';
    });

    // Disable financing application
    const financeButtons = document.querySelectorAll('.apply-now-btn');
    financeButtons.forEach(btn => {
        btn.disabled = true;
        btn.title = 'Create an account to apply for financing';
    });

    // Add guest badge to profile
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        userInfo.innerHTML = `
            <div class="guest-badge">
                <i class="fas fa-user-secret"></i>
                Guest User
                <a href="signup.html" class="create-account-btn">Create Account</a>
            </div>
        `;
    }
}

// Export functions
window.authProtection = {
    checkAuth,
    protectPage,
    logout
}; 