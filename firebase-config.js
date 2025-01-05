// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDhzcTF5iT1-67DLYoj53J4VgR6mIHuLlw",
    authDomain: "cardealer-bc79b.firebaseapp.com",
    projectId: "cardealer-bc79b",
    storageBucket: "cardealer-bc79b.firebasestorage.app",
    messagingSenderId: "411913564286",
    appId: "1:411913564286:web:82112360ce46ffcb04a82f",
    measurementId: "G-W324BZZJFC"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Export initialized services
const auth = firebase.auth();
const db = firebase.firestore();

window.firebaseServices = {
    auth,
    db
}; 