/**
 * Apex Dental Care, Kumarapuram, Thiruvananthapuram
 * Interactive Medical Web Engine & Patient Conversion Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  initClinicStatusBadge();
  initBeforeAfterSlider();
  initSymptomTriageEngine();
  initTreatmentEstimator();
  initAppointmentBookingModal();
  initFaqAccordion();
  initReviewFilters();
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
    // Current Indian Standard Time (UTC + 5:30)
    const now = new Date();
    const utcOffset = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utcOffset + (3600000 * 5.5));

    const day = istTime.getDay(); // 0 is Sunday, 1-6 Mon-Sat
    const hour = istTime.getHours();
    const minute = istTime.getMinutes();
    const timeInMinutes = hour * 60 + minute;

    // Clinic hours: Mon - Sat 9:30 AM (570 min) to 7:30 PM (1170 min)
    const openTime = 9 * 60 + 30; // 09:30
    const closeTime = 19 * 60 + 30; // 19:30

    if (day !== 0 && timeInMinutes >= openTime && timeInMinutes < closeTime) {
      badge.className = 'clinic-status-badge';
      badge.innerHTML = '<i class="fa-solid fa-circle" style="font-size:0.5rem;"></i> OPEN NOW (Until 7:30 PM)';
    } else if (day === 0) {
      badge.className = 'clinic-status-badge closed';
      badge.innerHTML = '<i class="fa-solid fa-circle" style="font-size:0.5rem;"></i> SUNDAY (Emergency On-Call)';
    } else {
      badge.className = 'clinic-status-badge closed';
      badge.innerHTML = '<i class="fa-solid fa-circle" style="font-size:0.5rem;"></i> CLOSED NOW (Opens 9:30 AM)';
    }
  }

  updateStatus();
  setInterval(updateStatus, 60000);
}

/* ==========================================================================
   2. Interactive Draggable Before / After Smile Makeover Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('comparisonBox');
  const overlay = document.getElementById('comparisonOverlay');
  const handle = document.getElementById('comparisonHandle');
  if (!container || !overlay || !handle) return;

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let position = (x - rect.left) / rect.width;
    if (position < 0.05) position = 0.05;
    if (position > 0.95) position = 0.95;

    const percentage = position * 100;
    overlay.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  function onPointerDown(e) {
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setSliderPosition(clientX);
    document.body.style.userSelect = 'none';
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setSliderPosition(clientX);
  }

  function onPointerUp() {
    isDragging = false;
    document.body.style.userSelect = '';
  }

  container.addEventListener('mousedown', onPointerDown);
  container.addEventListener('touchstart', onPointerDown, { passive: true });

  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  window.addEventListener('mouseup', onPointerUp);
  window.addEventListener('touchend', onPointerUp);

  // Procedure Filter Tabs for the Slider
  const filterPills = document.querySelectorAll('.comparison-filter-pills .filter-pill');
  const beforeImg = document.getElementById('comparisonBeforeImg');
  const afterImg = document.getElementById('comparisonAfterImg');
  const caseTitle = document.getElementById('caseStudyTitle');
  const caseDesc = document.getElementById('caseStudyDesc');

  const cases = {
    aligners: {
      title: 'Orthodontic Teeth Alignment & Spacing Correction',
      desc: 'Treated with Invisible Clear Aligners over 6 months without visible metal brackets.',
      before: 'assets/images/smile_before.jpg',
      after: 'assets/images/smile_teeth_after.jpg'
    },
    whitening: {
      title: 'Advanced In-Office Laser Teeth Whitening',
      desc: 'Achieved 8 shades whiter enamel in a single 45-minute painless clinic session.',
      before: 'assets/images/smile_before.jpg',
      after: 'assets/images/smile_teeth_after.jpg'
    },
    veneers: {
      title: 'Aesthetic Porcelain Veneers & Smile Architecture',
      desc: 'Ultra-thin Zirconia porcelain veneers engineered for lifelike light translucency.',
      before: 'assets/images/smile_before.jpg',
      after: 'assets/images/smile_teeth_after.jpg'
    },
    rct: {
      title: 'Single-Sitting Microscopic Root Canal Restoration',
      desc: 'Preserved severely damaged molar followed by monolithic high-strength ceramic crown.',
      before: 'assets/images/smile_before.jpg',
      after: 'assets/images/smile_teeth_after.jpg'
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
        if (beforeImg) beforeImg.src = cases[caseKey].before;
        if (afterImg) afterImg.src = cases[caseKey].after;
      }
    });
  });
}

/* ==========================================================================
   3. Interactive Dental Symptom Triage Engine
   ========================================================================== */
function initSymptomTriageEngine() {
  const symptomCards = document.querySelectorAll('.symptom-card');
  const resultTitle = document.getElementById('triageResultTitle');
  const resultBadge = document.getElementById('triageResultBadge');
  const resultDesc = document.getElementById('triageResultDesc');
  const resultActionBtn = document.getElementById('triageActionBtn');
  const resultWhatsappBtn = document.getElementById('triageWhatsappBtn');

  if (!symptomCards.length || !resultTitle) return;

  const triageData = {
    toothache: {
      title: 'Severe Throbbing Toothache / Thermal Sensitivity',
      badge: 'URGENT ATTENTION',
      badgeClass: 'result-badge urgent',
      desc: 'Constant or sharp throbbing pain typically indicates deep tooth pulp inflammation or infection. Single-sitting Root Canal Therapy (RCT) with apex locator precision can provide immediate pain relief and preserve your natural tooth.',
      treatment: 'Single-Sitting Root Canal',
      waMsg: 'Hello Apex Dental Care, I am experiencing severe toothache pain and need an urgent consultation.'
    },
    broken: {
      title: 'Chipped, Fractured or Knocked-Out Tooth',
      badge: 'EMERGENCY TRAUMA',
      badgeClass: 'result-badge urgent',
      desc: 'If a tooth is knocked out, avoid touching the root, place it in cold fresh milk or inside your cheek, and reach our Kumarapuram clinic within 60 minutes for highest replantation success. Minor chips can be instantly bonded with cosmetic composite.',
      treatment: 'Dental Trauma / Cosmetic Bonding',
      waMsg: 'Hello Apex Dental Care, I have an emergency fractured/knocked-out tooth and need urgent help.'
    },
    bleeding: {
      title: 'Bleeding, Swollen Gums & Bad Breath',
      badge: 'PERIODONTAL CARE',
      badgeClass: 'result-badge medium',
      desc: 'Bleeding during brushing is the primary indicator of gingivitis or calculus buildup beneath the gum line. Our ultrasonic deep scaling and painless airflow polishing will restore healthy pink gum tissue within days.',
      treatment: 'Ultrasonic Gum Scaling & Deep Polishing',
      waMsg: 'Hello Apex Dental Care, I would like to book a consultation for bleeding gums and teeth cleaning.'
    },
    spacing: {
      title: 'Crooked, Crowded Teeth or Unwanted Gaps',
      badge: 'ORTHODONTIC CARE',
      badgeClass: 'result-badge medium',
      desc: 'Misaligned bite or smile gaps can be gently corrected without noticeable metal wires using computer-modeled Clear Invisible Aligners or Ceramic Braces. Experience a custom 3D digital simulation of your future smile.',
      treatment: 'Clear Invisible Aligners Consultation',
      waMsg: 'Hello Apex Dental Care, I am interested in Invisible Aligners/Braces and would like a consultation.'
    },
    wisdom: {
      title: 'Impacted Wisdom Tooth Pain & Jaw Stiffness',
      badge: 'SURGICAL EVALUATION',
      badgeClass: 'result-badge urgent',
      desc: 'Third molars frequently lack space, causing gum pericoronitis infection and pain radiating towards the ear and temple. Our oral surgeons perform atraumatic, suture-assisted wisdom tooth removal under gentle local anesthesia.',
      treatment: 'Painless Wisdom Tooth Extraction',
      waMsg: 'Hello Apex Dental Care, I have wisdom tooth pain and need an evaluation at Kumarapuram.'
    }
  };

  symptomCards.forEach(card => {
    card.addEventListener('click', () => {
      symptomCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const symptomKey = card.getAttribute('data-symptom');
      const data = triageData[symptomKey];
      if (data) {
        resultTitle.textContent = data.title;
        resultBadge.textContent = data.badge;
        resultBadge.className = data.badgeClass;
        resultDesc.textContent = data.desc;

        if (resultActionBtn) {
          resultActionBtn.textContent = `Book ${data.treatment}`;
          resultActionBtn.onclick = () => openBookingModal(data.treatment);
        }

        if (resultWhatsappBtn) {
          resultWhatsappBtn.href = `https://wa.me/918848586119?text=${encodeURIComponent(data.waMsg)}`;
        }
      }
    });
  });
}

/* ==========================================================================
   4. Treatment Cost Estimator & EMI Calculator
   ========================================================================== */
function initTreatmentEstimator() {
  const checkboxes = document.querySelectorAll('.treatment-checkbox');
  const priceDisplay = document.getElementById('estimatorTotalPrice');
  const emiDisplay = document.getElementById('estimatorEmiPrice');
  const claimBtn = document.getElementById('estimatorClaimBtn');

  if (!checkboxes.length || !priceDisplay) return;

  function recalculate() {
    let minTotal = 0;
    let maxTotal = 0;
    let selectedCount = 0;
    const selectedNames = [];

    checkboxes.forEach(cb => {
      const parentLabel = cb.closest('.treatment-option-label');
      if (cb.checked) {
        if (parentLabel) parentLabel.classList.add('checked');
        const minVal = parseInt(cb.getAttribute('data-min'), 10) || 0;
        const maxVal = parseInt(cb.getAttribute('data-max'), 10) || 0;
        minTotal += minVal;
        maxTotal += maxVal;
        selectedCount++;
        selectedNames.push(cb.getAttribute('data-name'));
      } else {
        if (parentLabel) parentLabel.classList.remove('checked');
      }
    });

    if (selectedCount === 0) {
      priceDisplay.textContent = '₹0';
      if (emiDisplay) emiDisplay.textContent = 'Select treatments to calculate';
    } else {
      priceDisplay.textContent = `₹${minTotal.toLocaleString('en-IN')} - ₹${maxTotal.toLocaleString('en-IN')}`;
      if (emiDisplay) {
        const estMonthlyEmi = Math.round(minTotal / 6);
        emiDisplay.textContent = `EMI starts from ~₹${estMonthlyEmi.toLocaleString('en-IN')}/mo (0% Interest Available)`;
      }
    }

    if (claimBtn) {
      claimBtn.onclick = () => {
        const prefillTreatment = selectedNames.length ? selectedNames.join(', ') : 'Comprehensive Consultation';
        openBookingModal(prefillTreatment);
      };
    }
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', recalculate);
  });

  recalculate();
}

/* ==========================================================================
   5. Appointment Booking Modal & Instant WhatsApp Booking Dispatch
   ========================================================================== */
window.openBookingModal = function(preferredService = '') {
  const modal = document.getElementById('bookingModal');
  const serviceSelect = document.getElementById('modalServiceSelect');
  const dateInput = document.getElementById('modalDateInput');

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Preselect service if matching option exists
    if (serviceSelect && preferredService) {
      let matched = false;
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].text.toLowerCase().includes(preferredService.toLowerCase()) ||
            preferredService.toLowerCase().includes(serviceSelect.options[i].text.toLowerCase())) {
          serviceSelect.selectedIndex = i;
          matched = true;
          break;
        }
      }
      if (!matched && preferredService) {
        serviceSelect.value = 'consultation';
      }
    }

    // Default min date to today
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

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeBookingModal();
    }
  });

  // Handle form submission
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
      alert('Please provide your name and phone number so the clinic team can confirm your slot.');
      return;
    }

    const bookingId = 'APEX-' + Math.floor(100000 + Math.random() * 900000);

    // Build WhatsApp message
    let waText = `*Apex Dental Care, Kumarapuram - Appointment Request*\n\n`;
    waText += `*Booking Ref:* ${bookingId}\n`;
    waText += `*Patient Name:* ${name}\n`;
    waText += `*Phone:* ${phone}\n`;
    waText += `*Service:* ${serviceName}\n`;
    waText += `*Preferred Date:* ${date}\n`;
    waText += `*Time Window:* ${slot}\n`;
    if (notes) waText += `*Notes:* ${notes}\n`;
    waText += `\n_Please confirm my consultation slot at Poonthi Road clinic._`;

    // Show Confirmation Banner inside Modal
    if (confirmBanner && confirmDetails) {
      confirmDetails.innerHTML = `
        <strong>Appointment Reference: ${bookingId}</strong><br>
        Patient: <b>${name}</b> | Service: <b>${serviceName}</b><br>
        Date: <b>${date}</b> (${slot})<br>
        <p style="margin-top:0.5rem;font-size:0.85rem;color:#047857;">Click below to dispatch your booking details directly to our reception WhatsApp for instant confirmation.</p>
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
   6. FAQ Accordion Engine
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
   7. Filterable Patient Reviews
   ========================================================================== */
function initReviewFilters() {
  const filterBtns = document.querySelectorAll('.review-filter-btn');
  const reviewCards = document.querySelectorAll('.review-card');

  if (!filterBtns.length || !reviewCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      reviewCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. Mobile Navigation Toggle
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('mainNav');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    }
  });

  // Close nav when clicking a link
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
   9. Smooth Scrolling & Active Link Spy
   ========================================================================== */
function initSmoothScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
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
