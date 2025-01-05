class AuthProtection {
    constructor() {
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.setupAuthListener();
    }

    setupAuthListener() {
        this.auth.onAuthStateChanged(async (user) => {
            if (user) {
                // User is signed in
                if (window.location.pathname.includes('login.html')) {
                    window.location.href = 'walkers.html';
                }
            } else {
                // User is signed out
                const isGuestMode = sessionStorage.getItem('guestMode') === 'true';
                if (!isGuestMode && !window.location.pathname.includes('login.html')) {
                    window.location.href = 'login.html';
                }
            }
        });
    }

    async loginWithEmail(email, password) {
        try {
            await this.auth.signInWithEmailAndPassword(email, password);
            // Redirect will be handled by auth state listener
        } catch (error) {
            this.handleAuthError(error);
            throw error;
        }
    }

    async loginWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await this.auth.signInWithPopup(provider);
            // Redirect will be handled by auth state listener
        } catch (error) {
            this.handleAuthError(error);
            throw error;
        }
    }

    async loginWithFacebook() {
        try {
            const provider = new firebase.auth.FacebookAuthProvider();
            await this.auth.signInWithPopup(provider);
            // Redirect will be handled by auth state listener
        } catch (error) {
            this.handleAuthError(error);
            throw error;
        }
    }

    async logout() {
        try {
            document.body.classList.add('logging-out');
            // Clear any stored data
            sessionStorage.removeItem('guestMode');
            localStorage.removeItem('savedCars');
            
            await this.auth.signOut();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error during logout:', error);
            document.body.classList.remove('logging-out');
            this.handleAuthError(error);
        }
    }

    handleAuthError(error) {
        let errorMessage = 'An error occurred during authentication.';
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No user found with this email address.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password.';
                break;
            case 'auth/email-already-in-use':
                errorMessage = 'This email is already registered.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address.';
                break;
            case 'auth/popup-closed-by-user':
                errorMessage = 'Authentication popup was closed.';
                break;
            default:
                errorMessage = error.message;
        }

        const errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
        } else {
            console.error(errorMessage);
        }
    }
}

// Initialize Auth Protection
window.authProtection = new AuthProtection(); 