
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

                const section = document.querySelector(target);

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

    },

    setActive(activeLink) {

        this.navLinks.forEach(link => {
            link.classList.remove("active");
        });

        activeLink.classList.add("active");

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
