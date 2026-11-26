
"use strict";
// OQY — Firebase Configuration

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import { getAuth } from
    "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import { getFirestore } from
    "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

// Firebase Configuration

const firebaseConfig = {
    apiKey: "AIzaSyBLgZ_w5Nfz1O2znbhz9fDfebXee-Ap4hE",
    authDomain: "oqy-platform.firebaseapp.com",
    projectId: "oqy-platform",
    storageBucket: "oqy-platform.firebasestorage.app",
    messagingSenderId: "1099148658558",
    appId: "1:1099148658558:web:ea4fed2bc5c123052bd52f",
    measurementId: "G-E1P55TPMTL"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Initialize Services

const auth = getAuth(app);
const db = getFirestore(app);

// Export Services

export { app, auth, db };

console.log("OQY Firebase initialized successfully");
