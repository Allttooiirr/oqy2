
"use strict";

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const loginPage = "login.html";

const dashboard = document.querySelector(".student-dashboard");
const logoutButton = document.querySelector(".logout-button");

if (dashboard) {
    dashboard.style.visibility = "hidden";
}

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.replace(loginPage);
        return;
    }

    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await signOut(auth);
            window.location.replace(loginPage);
            return;
        }

        const profile = userSnap.data();

        if (profile.role !== "student") {
            window.location.replace("index.html");
            return;
        }

        // Имя пользователя
        const heading = document.querySelector(".student-header h1");

        if (heading) {
            heading.textContent = `Добро пожаловать, ${profile.name}!`;
        }

        // Аватар
        const avatar = document.querySelector(".student-avatar");

        if (avatar) {
            avatar.textContent = profile.name.charAt(0).toUpperCase();
        }

        // Тариф из Firestore
        const plan = document.querySelector(
            ".dashboard-card h2"
        );

        if (plan) {
            plan.textContent = profile.plan === "premium"
                ? "Premium"
                : "Free";
        }

        if (dashboard) {
            dashboard.style.visibility = "visible";
        }

    } catch (error) {
        console.error("OQY authentication error:", error);
        alert("Не удалось проверить аккаунт. Попробуй войти снова.");
        await signOut(auth);
        window.location.replace(loginPage);
    }
});

// Выход из аккаунта
if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.replace(loginPage);
        } catch (error) {
            console.error("Logout error:", error);
            alert("Не удалось выйти из аккаунта.");
        }
    });
}
