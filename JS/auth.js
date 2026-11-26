"use strict";

// OQY Authentication Interface

const OQYAuth = {

    mode: "login",

    init() {
        this.loginTab = document.getElementById("loginTab");
        this.registerTab = document.getElementById("registerTab");
        this.authForm = document.getElementById("authForm");
        this.nameGroup = document.getElementById("nameGroup");

        if (!this.authForm) return;

        this.loginTab.addEventListener("click", () => {
            this.setMode("login");
        });

        this.registerTab.addEventListener("click", () => {
            this.setMode("register");
        });

        this.authForm.addEventListener("submit", (event) => {
            event.preventDefault();

            alert(
                "Интерфейс готов. Серверная авторизация будет подключена позже."
            );
        });
    },

    setMode(mode) {
        this.mode = mode;

        const isRegister = mode === "register";

        this.loginTab.classList.toggle("active", !isRegister);
        this.registerTab.classList.toggle("active", isRegister);

        this.nameGroup.hidden = !isRegister;
        document.getElementById("name").required = isRegister;

        this.authForm.querySelector(
            'button[type="submit"]'
        ).textContent = isRegister
            ? "Создать аккаунт →"
            : "Войти →";
    }

};

document.addEventListener("DOMContentLoaded", () => {
    OQYAuth.init();
});
