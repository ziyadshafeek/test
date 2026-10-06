/**
 * Apex Dental Care, Kumarapuram, Thiruvananthapuram
 * Clean, Mobile-First Website Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initClinicStatusBadge();
  initBeforeAfterSlider();
  initAppointmentBookingModal();
  initFaqAccordion();
  initMobileNavigation();
  initSmoothScroll();
});

/* ==========================================================================
   1. Real-Time Clinic Open / Closed Status Tracker (IST)
   ========================================================================== */
function initClinicStatusBadge() {
  const badge = document.getElementById('clinicStatusBadge');
  if (!badge) return;

  function updateStatus() {
    const now = new Date();
    const utcOffset = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utcOffset + (3600000 * 5.5));

    const day = istTime.getDay(); // 0: Sun, 1-6: Mon-Sat
    const hour = istTime.getHours();
    const minute = istTime.getMinutes();
    const timeInMinutes = hour * 60 + minute;

    // Clinic hours: Mon - Sat 9:30 AM (570 min) to 7:30 PM (1170 min)
    const openTime = 9 * 60 + 30;
    const closeTime = 19 * 60 + 30;

    if (day !== 0 && timeInMinutes >= openTime && timeInMinutes < closeTime) {
      badge.className = 'clinic-status-badge';
      badge.innerHTML = '<i class="fa-solid fa-circle" style="font-size:0.45rem;"></i> OPEN NOW (Until 7:30 PM)';
    } else if (day === 0) {
      badge.className = 'clinic-status-badge closed';
      badge.innerHTML = '<i class="fa-solid fa-circle" style="font-size:0.45rem;"></i> SUNDAY (Emergency On-Call)';
    } else {
      badge.className = 'clinic-status-badge closed';
      badge.innerHTML = '<i class="fa-solid fa-circle" style="font-size:0.45rem;"></i> CLOSED NOW (Opens 9:30 AM)';
    }
  }

  updateStatus();
  setInterval(updateStatus, 60000);
}

/* ==========================================================================
   2. Responsive Draggable Before / After Smile Slider (Touch & Mouse)
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('comparisonBox');
  const handle = document.getElementById('comparisonHandle');
  if (!container || !handle) return;

  let isDragging = false;

  function setSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let pos = (clientX - rect.left) / rect.width;
    if (pos < 0.05) pos = 0.05;
    if (pos > 0.95) pos = 0.95;

    const percentage = `${(pos * 100).toFixed(2)}%`;
    container.style.setProperty('--pos', percentage);
  }

  function onPointerDown(e) {
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setSliderPosition(clientX);
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setSliderPosition(clientX);
  }

  function onPointerUp() {
    isDragging = false;
  }

  container.addEventListener('mousedown', onPointerDown);
  container.addEventListener('touchstart', onPointerDown, { passive: true });

  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  window.addEventListener('mouseup', onPointerUp);
  window.addEventListener('touchend', onPointerUp);

  // Procedure Filter Tabs for the Slider
  const filterPills = document.querySelectorAll('.comparison-filter-pills .filter-pill');
  const caseTitle = document.getElementById('caseStudyTitle');
  const caseDesc = document.getElementById('caseStudyDesc');

  const cases = {
    aligners: {
      title: 'Invisible Clear Aligners (Teeth Straightening)',
      desc: 'Discreet orthodontic correction for crowding and gap closures.'
    },
    whitening: {
      title: 'In-Office Laser Teeth Whitening',
      desc: 'Safe, painless stain removal restoring bright natural tooth shade.'
    },
    veneers: {
      title: 'Cosmetic Porcelain Veneers',
      desc: 'Ultra-thin custom porcelain laminates for seamless aesthetic smiles.'
    },
    rct: {
      title: 'Single-Sitting Root Canal & Ceramic Crown',
      desc: 'Painless nerve infection relief followed by natural tooth restoration.'
    }
  };

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const caseKey = pill.getAttribute('data-case');
      if (cases[caseKey]) {
        if (caseTitle) caseTitle.textContent = cases[caseKey].title;
        if (caseDesc) caseDesc.textContent = cases[caseKey].desc;
      }
    });
  });
}

/* ==========================================================================
   3. Appointment Booking Modal & Instant WhatsApp Dispatch
   ========================================================================== */
window.openBookingModal = function(preferredService = '') {
  const modal = document.getElementById('bookingModal');
  const serviceSelect = document.getElementById('modalServiceSelect');
  const dateInput = document.getElementById('modalDateInput');

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (serviceSelect && preferredService) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].text.toLowerCase().includes(preferredService.toLowerCase()) ||
            preferredService.toLowerCase().includes(serviceSelect.options[i].text.toLowerCase())) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }

    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      if (!dateInput.value) dateInput.value = today;
    }
  }
};

window.closeBookingModal = function() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

function initAppointmentBookingModal() {
  const modal = document.getElementById('bookingModal');
  const form = document.getElementById('appointmentForm');
  const confirmBanner = document.getElementById('bookingConfirmBanner');
  const confirmDetails = document.getElementById('bookingConfirmDetails');
  const waConfirmBtn = document.getElementById('bookingWaConfirmBtn');

  if (!modal || !form) return;

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeBookingModal();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('modalNameInput').value.trim();
    const phone = document.getElementById('modalPhoneInput').value.trim();
    const serviceSelect = document.getElementById('modalServiceSelect');
    const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
    const date = document.getElementById('modalDateInput').value;
    const slot = document.getElementById('modalTimeSelect').value;
    const notes = document.getElementById('modalNotesInput').value.trim();

    if (!name || !phone) {
      alert('Please enter your name and phone number.');
      return;
    }

    const bookingId = 'APEX-' + Math.floor(100000 + Math.random() * 900000);

    let waText = `*Apex Dental Care, Kumarapuram - Appointment Request*\n\n`;
    waText += `*Ref:* ${bookingId}\n`;
    waText += `*Patient:* ${name}\n`;
    waText += `*Phone:* ${phone}\n`;
    waText += `*Service:* ${serviceName}\n`;
    waText += `*Date:* ${date} (${slot})\n`;
    if (notes) waText += `*Notes:* ${notes}\n`;
    waText += `\n_Please confirm my consultation slot at Poonthi Road clinic._`;

    if (confirmBanner && confirmDetails) {
      confirmDetails.innerHTML = `
        <strong>Ref: ${bookingId}</strong><br>
        Patient: <b>${name}</b><br>
        Treatment: <b>${serviceName}</b><br>
        Date: <b>${date}</b> (${slot})
      `;
      confirmBanner.classList.add('active');

      if (waConfirmBtn) {
        waConfirmBtn.href = `https://wa.me/918848586119?text=${encodeURIComponent(waText)}`;
      }

      form.style.display = 'none';
    }
  });
}

/* ==========================================================================
   4. FAQ Accordion Engine
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. Mobile Navigation Toggle
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('mainNav');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = navMenu.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  });

  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });
}

/* ==========================================================================
   6. Smooth Scrolling & Active Link Spy
   ========================================================================== */
function initSmoothScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
