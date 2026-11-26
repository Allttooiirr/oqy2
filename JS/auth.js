
"use strict";

// OQY Authentication Interface

const OQYAuth = {

    mode: "login",

    init() {
        this.loginTab = document.getElementById("loginTab");
        this.registerTab = document.getElementById("registerTab");
        this.authForm = document.getElementById("authForm");
        this.nameGroup = document.getElementById("nameGroup");

        if (
            !this.authForm ||
            !this.loginTab ||
            !this.registerTab ||
            !this.nameGroup
        ) {
            return;
        }

        this.loginTab.addEventListener("click", () => {
            this.setMode("login");
        });

        this.registerTab.addEventListener("click", () => {
            this.setMode("register");
        });

        this.authForm.addEventListener("submit", event => {
            event.preventDefault();

            if (!this.authForm.reportValidity()) return;

            console.log("Authentication form submitted:", this.mode);

            alert(
                "Интерфейс готов. Серверная авторизация будет подключена позже."
            );
        });

        this.setMode("login");

        console.log("OQY Authentication initialized");
    },

    setMode(mode) {
        if (mode !== "login" && mode !== "register") return;

        this.mode = mode;

        const isRegister = mode === "register";

        this.loginTab.classList.toggle("active", !isRegister);
        this.registerTab.classList.toggle("active", isRegister);

        this.loginTab.setAttribute(
            "aria-selected",
            String(!isRegister)
        );

        this.registerTab.setAttribute(
            "aria-selected",
            String(isRegister)
        );

        this.nameGroup.hidden = !isRegister;

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
    }

};

document.addEventListener("DOMContentLoaded", () => {
    OQYAuth.init();
});
