

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * for review cards
   */
  const sliderWrapper = document.querySelector('.review-slider-wrapper');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  let currentIndex = 0;
  let autoplayInterval;

  // Function to calculate the maximum number of slides
  function getMaxIndex() {
    const cardWidth = document.querySelector('.review-card').offsetWidth + 20; // Add gap
    const visibleCards = Math.floor(sliderWrapper.parentElement.offsetWidth / cardWidth); // Visible cards in the viewport
    return sliderWrapper.children.length - visibleCards;
  }

  // Function to update slider position
  function updateSlider() {
    const cardWidth = document.querySelector('.review-card').offsetWidth + 20; // Add gap
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) currentIndex = maxIndex; // Prevent sliding to blank space
    sliderWrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }

  // Function to go to the next slide
  function nextSlide() {
    const maxIndex = getMaxIndex();
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0; // Loop back to the first card
    }
    updateSlider();
  }

  // Function to go to the previous slide
  function prevSlide() {
    const maxIndex = getMaxIndex();
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = maxIndex; // Loop to the last visible slide
    }
    updateSlider();
  }

  // Start autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
  }

  // Stop autoplay when user interacts
  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Event listeners for buttons
  prevBtn.addEventListener('click', () => {
    stopAutoplay();
    prevSlide();
    startAutoplay(); // Restart autoplay after interaction
  });

  nextBtn.addEventListener('click', () => {
    stopAutoplay();
    nextSlide();
    startAutoplay(); // Restart autoplay after interaction
  });

  // Adjust slider position and recalculate max index on window resize
  window.addEventListener('resize', updateSlider);

  // Initialize autoplay and slider
  startAutoplay();
  updateSlider();

  const slider = document.querySelector('.review-slider');

  slider.addEventListener('mouseover', stopAutoplay);
  slider.addEventListener('mouseout', startAutoplay);


  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

//gallery modal
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const closeModal = document.getElementById('closeModal');

// Function to open modal
galleryItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default behavior if needed
    const tagName = item.tagName.toLowerCase();

    if (tagName === 'img') {
      // Image logic
      modalImage.src = item.src;
      modalImage.style.display = 'block';
      modalVideo.style.display = 'none'; // Ensure video is hidden
    } else if (tagName === 'video') {
      // Video logic
      const videoSrc = item.dataset.src || item.querySelector('source').src;

      modalVideo.src = videoSrc;
      modalVideo.style.display = 'block';
      modalImage.style.display = 'none'; // Ensure image is hidden
      modalVideo.play(); // Automatically play video
    }

    modal.style.display = 'flex'; // Show modal
  });
});

// Function to close modal
function closeModalAction() {
  modal.style.display = 'none'; // Hide modal

  if (modalVideo.style.display === 'block') {
    // Reset video
    modalVideo.pause();
    modalVideo.src = ''; // Reset video source
  }

  // Reset image
  modalImage.src = ''; // Reset image source
  modalImage.style.display = 'none'; // Hide image
  modalVideo.style.display = 'none'; // Hide video
}

// Event listener for close button
closeModal.addEventListener('click', () => {
  closeModalAction();
});

// Close modal on background click
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModalAction();
  }
});


// Modal elements


// for slide show
const slider = new Swiper('.swiper', {
  loop: true, // Infinite loop
  autoplay: {
    delay: 3000, // Change slide every 3 seconds
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  //effect: 'coverflow', // Choose effect: 'coverflow', 'fade', 'cube', 'flip'
  coverflowEffect: {
    //rotate: 50, // Rotation angle
    stretch: 0, // Space between slides
    depth: 100, // Perspective depth
    modifier: 1,
    slideShadows: true, // Enable shadow effects
  },
});




  const cards = document.querySelectorAll('.service-card');

  window.addEventListener('scroll', () => {
    cards.forEach((card) => {
      const cardPosition = card.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (cardPosition < windowHeight - 100) {
        card.style.transform = 'translateY(0)';
        card.style.opacity = '1';
      } else {
        card.style.transform = 'translateY(50px)';
        card.style.opacity = '0';
      }
    });
  });

