// ========================================
// MARIE CURIE TRIBUTE PAGE
// JavaScript
// ========================================


// Get the "Explore Her Story" button

const exploreButton =
    document.querySelector(".hero-button");


// Get the biography section

const biographySection =
    document.getElementById("biography");


// Get the hero section

const hero =
    document.querySelector(".hero");


// ========================================
// SMOOTH SCROLL
// ========================================

exploreButton.addEventListener("click", function (event) {

    // Prevent the default link behavior

    event.preventDefault();


    // Scroll to biography section

    biographySection.scrollIntoView({
        behavior: "smooth"
    });

});


// ========================================
// SCROLL EFFECT
// ========================================

window.addEventListener("scroll", function () {

    // Check how far the page has been scrolled

    if (window.scrollY > 100) {

        // Add the "scrolled" class

        hero.classList.add("scrolled");

    } else {

        // Remove the class

        hero.classList.remove("scrolled");

    }

});