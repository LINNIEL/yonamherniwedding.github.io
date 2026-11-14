
/* =================================
   WEDDING GALLERY LIGHTBOX
================================= */

document.addEventListener("DOMContentLoaded", function () {

    const galleryImages = document.querySelectorAll(
        "#weddingGallery .gallery-item img"
    );

    const lightbox = document.getElementById("galleryLightbox");
    const lightboxImage = document.getElementById("lightboxImage");

    const closeButton = document.getElementById("lightboxClose");
    const prevButton = document.getElementById("lightboxPrev");
    const nextButton = document.getElementById("lightboxNext");

    const currentCounter = document.getElementById("lightboxCurrent");
    const totalCounter = document.getElementById("lightboxTotal");

    if (!galleryImages.length || !lightbox) return;

    let currentIndex = 0;
    let previousOverflow = "";

    const totalImages = galleryImages.length;

    totalCounter.textContent = totalImages;


    // OPEN LIGHTBOX
    function openLightbox(index) {

        currentIndex = index;

        showImage(currentIndex);

        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");

        closeButton.focus();
    }


    // DISPLAY IMAGE
    function showImage(index) {

        const image = galleryImages[index];

        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;

        currentCounter.textContent = index + 1;

        // Restart animation
        lightboxImage.style.animation = "none";

        requestAnimationFrame(() => {
            lightboxImage.style.animation = "";
        });
    }


    // CLOSE LIGHTBOX
    function closeLightbox() {

        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");

        document.body.style.overflow = previousOverflow;

        // Remove preview source
        lightboxImage.src = "";

        // Return focus to selected thumbnail
        galleryImages[currentIndex].focus?.();
    }


    // NEXT IMAGE
    function nextImage() {

        currentIndex++;

        if (currentIndex >= totalImages) {
            currentIndex = 0;
        }

        showImage(currentIndex);
    }


    // PREVIOUS IMAGE
    function previousImage() {

        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = totalImages - 1;
        }

        showImage(currentIndex);
    }


    // CLICK THUMBNAIL
    galleryImages.forEach((image, index) => {

        image.parentElement.setAttribute("tabindex", "0");
        image.parentElement.setAttribute("role", "button");

        image.parentElement.addEventListener("click", () => {
            openLightbox(index);
        });

        image.parentElement.addEventListener("keydown", (event) => {

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(index);
            }

        });

    });


    // BUTTON EVENTS
    closeButton.addEventListener("click", closeLightbox);

    nextButton.addEventListener("click", nextImage);

    prevButton.addEventListener("click", previousImage);


    // CLICK OUTSIDE IMAGE TO CLOSE
    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });


    // KEYBOARD NAVIGATION
    document.addEventListener("keydown", function (event) {

        if (!lightbox.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            nextImage();
        }

        if (event.key === "ArrowLeft") {
            previousImage();
        }

    });


    // TOUCH SWIPE SUPPORT
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener("touchstart", function (event) {

        touchStartX = event.changedTouches[0].screenX;

    }, { passive: true });


    lightbox.addEventListener("touchend", function (event) {

        touchEndX = event.changedTouches[0].screenX;

        const distance = touchEndX - touchStartX;

        if (Math.abs(distance) < 50) return;

        if (distance < 0) {
            nextImage();
        } else {
            previousImage();
        }

    }, { passive: true });

});
