
"use strict";

// OQY Student Dashboard

const OQYStudent = {

    init() {

        this.navLinks = document.querySelectorAll(
            ".student-nav a"
        );

        this.sections = document.querySelectorAll(
            ".student-section[id]"
        );

        if (!this.navLinks.length) return;

        this.initNavigation();
        this.initScrollTracking();

        const homeLink = Array.from(this.navLinks).find(
            link => link.getAttribute("href") === "#"
        );

        if (homeLink) {
            this.setActive(homeLink);
        }

        console.log("OQY Student Dashboard initialized");
    },

    initNavigation() {

        this.navLinks.forEach(link => {

            link.addEventListener("click", event => {

                const target = link.getAttribute("href");

                if (target === "#") {

                    event.preventDefault();

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                    this.setActive(link);
                    return;
                }

                let section = null;

                try {
                    section = document.querySelector(target);
                } catch (error) {
                    console.warn(
                        "Invalid navigation target:",
                        target
                    );
                    return;
                }

                if (!section) return;

                event.preventDefault();

                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                this.setActive(link);

            });

        });

    },

    initScrollTracking() {

        if (!("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const activeLink = Array.from(
                    this.navLinks
                ).find(link =>
                    link.getAttribute("href") ===
                    `#${entry.target.id}`
                );

                if (activeLink) {
                    this.setActive(activeLink);
                }

            });

        }, {
            rootMargin: "-15% 0px -70% 0px",
            threshold: 0
        });

        this.sections.forEach(section => {
            observer.observe(section);
        });

        window.addEventListener("scroll", () => {

            if (window.scrollY < 100) {

                const homeLink = Array.from(
                    this.navLinks
                ).find(link =>
                    link.getAttribute("href") === "#"
                );

                if (homeLink) {
                    this.setActive(homeLink);
                }

            }

        }, { passive: true });

    },

    setActive(activeLink) {

        this.navLinks.forEach(link => {

            link.classList.remove("active");
            link.removeAttribute("aria-current");

        });

        activeLink.classList.add("active");
        activeLink.setAttribute("aria-current", "page");
showNotification(message, type = "success") {

    const oldNotification = document.querySelector(
        ".oqy-notification"
    );

    if (oldNotification) {
        oldNotification.remove();
    }

    const notification = document.createElement("div");

    notification.className = `oqy-notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.classList.add("visible");
    });

    setTimeout(() => {

        notification.classList.remove("visible");

        setTimeout(() => {
            notification.remove();
        }, 300);

    }, 3500);

},
    },

    logout() {

        if (this.isLoggingOut) return;

        const confirmLogout = confirm(
            "Ты действительно хочешь выйти из личного кабинета?"
        );

        if (!confirmLogout) return;

        this.isLoggingOut = true;

        window.location.href = "index.html";

    },

    loadProfile() {
        console.log("Profile module ready");
    },

    loadCourses() {
        console.log("Courses module ready");
    },

    loadProgress() {
        console.log("Progress module ready");
    },

    loadRecommendations() {
        console.log("Recommendations module ready");
    }

};

document.addEventListener("DOMContentLoaded", () => {
    OQYStudent.init();
});
