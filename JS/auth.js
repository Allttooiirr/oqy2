
"use strict";

// OQY — Firebase Authentication

import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    deleteUser,
    signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const OQYAuth = {

    mode: "login",

    init() {
        this.loginTab = document.getElementById("loginTab");
        this.registerTab = document.getElementById("registerTab");
        this.authForm = document.getElementById("authForm");
        this.nameGroup = document.getElementById("nameGroup");

        if (!this.authForm) return;

        this.loginTab?.addEventListener("click", () => {
            this.setMode("login");
        });

        this.registerTab?.addEventListener("click", () => {
            this.setMode("register");
        });

        this.authForm.addEventListener("submit", event => {
            event.preventDefault();
            this.handleSubmit();
        });

        this.setMode("login");

        console.log("OQY Firebase Authentication initialized");
    },

    setMode(mode) {
        if (!["login", "register"].includes(mode)) return;

        this.mode = mode;

        const isRegister = mode === "register";

        this.loginTab?.classList.toggle("active", !isRegister);
        this.registerTab?.classList.toggle("active", isRegister);

        this.loginTab?.setAttribute("aria-selected", String(!isRegister));
        this.registerTab?.setAttribute("aria-selected", String(isRegister));

        if (this.nameGroup) {
            this.nameGroup.hidden = !isRegister;
        }

        const nameInput = document.getElementById("name");

        if (nameInput) {
            nameInput.required = isRegister;
        }

        const submitButton = this.authForm.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.textContent = isRegister
                ? "Создать аккаунт →"
                : "Войти →";
        }
    },

    async handleSubmit() {
        if (!this.authForm.reportValidity()) return;

        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value;
        const name = document.getElementById("name")?.value.trim();

        if (!email || !password) {
            this.showError("Заполните email и пароль.");
            return;
        }

        const submitButton = this.authForm.querySelector(
            'button[type="submit"]'
        );

        const originalText = submitButton?.textContent;

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Подождите...";
        }

        try {
            if (this.mode === "register") {
                await this.register(email, password, name);
            } else {
                await this.login(email, password);
            }
        } catch (error) {
            console.error("OQY Authentication error:", error);
            this.showError(this.getErrorMessage(error.code));
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        }
    },

    async register(email, password, name) {
        if (!name || name.length > 80) {
            this.showError("Имя должно содержать от 1 до 80 символов.");
            return;
        }

        if (password.length < 6) {
            this.showError("Пароль должен содержать минимум 6 символов.");
            return;
        }

        let result;

        try {
            result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await updateProfile(result.user, {
                displayName: name
            });

            await setDoc(doc(db, "users", result.user.uid), {
                uid: result.user.uid,
                name: name,
                email: result.user.email,
                role: "student",
                plan: "free",
                createdAt: serverTimestamp()
            });

            window.location.href = "student.html";

        } catch (error) {

            if (result?.user) {
                try {
                    await deleteUser(result.user);
                } catch (cleanupError) {
                    console.error("Account cleanup error:", cleanupError);

                    try {
                        await signOut(auth);
                    } catch (signOutError) {
                        console.error("Sign out error:", signOutError);
                    }
                }
            }

            throw error;
        }
    },

    async login(email, password) {
        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        try {
            const profileRef = doc(db, "users", result.user.uid);
            const profileSnapshot = await getDoc(profileRef);

            if (!profileSnapshot.exists()) {
                await signOut(auth);

                this.showError(
                    "Профиль не найден. Обратитесь в поддержку OQY."
                );

                return;
            }

            const profile = profileSnapshot.data();

            if (profile.role === "student") {
                window.location.href = "student.html";
                return;
            }

            await signOut(auth);

            if (profile.role === "business") {
                this.showError(
                    "Business Dashboard пока находится в разработке."
                );
                return;
            }

            if (profile.role === "admin") {
                this.showError(
                    "Admin Dashboard пока находится в разработке."
                );
                return;
            }

            this.showError("Роль аккаунта не распознана.");

        } catch (error) {

            if (auth.currentUser) {
                try {
                    await signOut(auth);
                } catch (signOutError) {
                    console.error("Sign out error:", signOutError);
                }
            }

            throw error;
        }
    },

    showError(message) {
        let errorElement = document.getElementById("authError");

        if (!errorElement) {
            errorElement = document.createElement("p");
            errorElement.id = "authError";
            errorElement.setAttribute("role", "alert");
            errorElement.style.color = "#dc2626";
            errorElement.style.marginTop = "12px";

            this.authForm.appendChild(errorElement);
        }

        errorElement.textContent = message;
    },

    getErrorMessage(code) {
        const errors = {
            "auth/email-already-in-use": "Этот email уже зарегистрирован.",
            "auth/invalid-email": "Некорректный email.",
            "auth/weak-password": "Слишком простой пароль.",
            "auth/invalid-credential": "Неверный email или пароль.",
            "auth/user-not-found": "Аккаунт не найден.",
            "auth/wrong-password": "Неверный пароль.",
            "auth/network-request-failed": "Проверьте подключение к интернету.",
            "permission-denied": "Нет доступа к базе данных.",
            "unavailable": "Сервер временно недоступен."
        };

        return errors[code] || "Произошла ошибка. Попробуйте ещё раз.";
    }

};

document.addEventListener("DOMContentLoaded", () => {
    OQYAuth.init();
});

