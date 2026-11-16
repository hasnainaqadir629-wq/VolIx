// --- 1. NAVBAR SCROLL & MOBILE MENU ANIMATION ---
const navbar = document.getElementById('navbar');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });
}

// --- 2. SCROLL REVEAL ANIMATION ---
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

revealElements.forEach((el) => revealObserver.observe(el));

// --- 3. PERSISTENT SHOPPING CART (ACROSS ALL PAGES) ---
let cart = JSON.parse(localStorage.getItem('voltixCart')) || [];

function saveAndRenderCart() {
  localStorage.setItem('voltixCart', JSON.stringify(cart));
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartCount) cartCount.textContent = totalQty;

  if (cartItems && cartTotal) {
    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = '<p style="color:#94a3b8; text-align:center; margin-top:40px;">Your garage cart is empty.</p>';
    } else {
      cart.forEach((item, index) => {
        total += item.price * item.qty;
        cartItems.innerHTML += `
          <div class="cart-item">
            <div>
              <strong>${item.name}</strong>
              <div style="font-size:0.85rem; color:#94a3b8;">$${item.price} × ${item.qty}</div>
            </div>
            <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-weight:700;">Remove</button>
          </div>
        `;
      });
    }
    cartTotal.textContent = `$${total.toLocaleString()}`;
  }
}

function addToCart(name, price) {
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveAndRenderCart();
  toggleCart(true);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveAndRenderCart();
}

function toggleCart(forceOpen = false) {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (forceOpen) {
    drawer.classList.add('open');
    overlay.classList.add('open');
  } else {
    drawer.classList.toggle('open');
    overlay.classList.toggle('open');
  }
}

function checkoutAlert() {
  if (cart.length === 0) return alert('Please add a scooty or accessory first!');
  alert('Thank you! Your VOLTIX order has been reserved.');
  cart = [];
  saveAndRenderCart();
  toggleCart();
}

// --- 4. STORE CATEGORY FILTER ---
function filterStore(category, btn) {
  document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.store-item').forEach((item) => {
    if (category === 'all' || item.dataset.category === category) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// --- 5. HOME PAGE RANGE CALCULATOR ---
function calculateRange() {
  const modeSelect = document.getElementById('rideMode');
  const weightInput = document.getElementById('riderWeight');
  if (!modeSelect || !weightInput) return;

  const baseRange = parseInt(modeSelect.value);
  const weight = parseInt(weightInput.value);
  const modeText = modeSelect.options[modeSelect.selectedIndex].text;

  document.getElementById('modeLabel').textContent = modeText;
  document.getElementById('weightVal').textContent = `${weight} kg`;

  const adjustedRange = Math.round(baseRange - (weight - 65) * 0.45);
  document.getElementById('rangeResult').textContent = `${adjustedRange} km`;
}

// --- 6. TECH PAGE INTERACTIVE HOTSPOTS ---
const techData = [
  {
    tag: 'COMPONENT 01',
    title: '7-Inch Gorilla Glass Smart Cockpit',
    desc: 'Features turn-by-turn offline navigation, anti-theft GPS geofencing, Bluetooth music control, and automatic day/night brightness sensors.'
  },
  {
    tag: 'COMPONENT 02',
    title: 'IP67 Waterproof Solid-State Battery Pack',
    desc: '4.2 kWh high-density lithium cells encased in aircraft-grade aluminum with active thermal cooling for 1,500+ charge cycles.'
  },
  {
    tag: 'COMPONENT 03',
    title: '8.5 kW Direct-Drive Hub Motor',
    desc: 'Zero chain maintenance, silent acceleration, and instant 140 Nm wheel torque with 3-level regenerative braking.'
  }
];

function showTechSpec(index) {
  const data = techData[index];
  document.getElementById('techTag').textContent = data.tag;
  document.getElementById('techTitle').textContent = data.title;
  document.getElementById('techDesc').textContent = data.desc;
}

// --- 7. TEST RIDE FORM SUBMISSION ---
function submitBooking(e) {
  e.preventDefault();
  const name = document.getElementById('riderName').value;
  const model = document.getElementById('scootyModel').value;
  const city = document.getElementById('rideCity').value;
  document.getElementById('bookingMsg').textContent =
    `✅ Confirmed! ${name}, your ${model} test ride at ${city} is booked.`;
  e.target.reset();
}

// Initialize cart on page load
saveAndRenderCart();