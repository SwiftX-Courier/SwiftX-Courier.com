let currentUser = null;
const pages = document.querySelectorAll('.page');
const loader = document.getElementById('loader');

function showPage(id) {
  pages.forEach(p => p.classList.add('hidden'));
  showLoader();

  setTimeout(() => {
    if (['dashboard'].includes(id) && !currentUser) {
      alert('Please log in to access this page.');
      id = 'login-page';
    }

    document.getElementById(id)?.classList.remove('hidden');
    updateSidebar();
    hideLoader();
  }, 500);
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
}

function showLoader() {
  loader.classList.remove('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}

// Sidebar generation
function updateSidebar() {
  const sidebar = document.getElementById('sidebar-links');
  sidebar.innerHTML = '';

  if (currentUser) {
    const links = [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'faqs', label: 'FAQs' },
      { id: 'delivery-policies', label: 'Delivery Policies' },
      { id: 'contact-support', label: 'Contact Support' },
      { id: 'logout', label: 'Logout', action: logout }
    ];
    links.forEach(link => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = link.label;
      a.onclick = link.action || (() => showPage(link.id));
      li.appendChild(a);
      sidebar.appendChild(li);
    });
  } else {
    const guestLinks = [
      { id: 'home-page', label: 'Home' },
      { id: 'login-page', label: 'Login' },
      { id: 'register-page', label: 'Register' },
      { id: 'service-page', label: 'Our services' }
    ];
    guestLinks.forEach(link => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = link.label;
      a.onclick = () => showPage(link.id);
      li.appendChild(a);
      sidebar.appendChild(li);
    });
  }
}

// Register
document.getElementById('register-form').onsubmit = e => {
  e.preventDefault();
  const user = {
    name: document.getElementById('full-name').value,
    email: document.getElementById('register-email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    password: document.getElementById('register-password').value
  };
  localStorage.setItem(user.email, JSON.stringify(user));
  alert("Registered! Please log in.");
  showPage('login-page');
};

// Login
document.getElementById('login-form').onsubmit = e => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const user = JSON.parse(localStorage.getItem(email));
  if (!user || user.password !== password) {
    alert("Invalid credentials");
    return;
  }
  currentUser = user;
  localStorage.setItem("currentSession", email);
  loadDashboard();
  showPage('dashboard');
};

// Logout
function logout() {
  currentUser = null;
  localStorage.removeItem("currentSession");
  showPage('home-page');
}

// Dashboard setup
function loadDashboard() {
  document.getElementById('user-name').textContent = currentUser.name;
  document.getElementById('user-email').textContent = currentUser.email;
  document.getElementById('user-phone').textContent = currentUser.phone;
  document.getElementById('user-address').textContent = currentUser.address;

  const select = document.getElementById('admin-tracking-select');
  select.innerHTML = '';
  Object.keys(trackingDB).forEach(id => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = id;
    select.appendChild(opt);
  });

  if (currentUser.email === "admin@swiftx.com") {
    document.getElementById("admin-panel").classList.remove("hidden");
  } else {
    document.getElementById("admin-panel").classList.add("hidden");
  }
}

// Tracking DB
let trackingDB = JSON.parse(localStorage.getItem('trackingDB')) || {
  'SWF123456789': [
    { time: '2024-07-01 08:00', msg: '📦 Package accepted in (SwiftX Courier) WAREHOUSE.' },
    { time: '2024-07-02 10:30', msg: '🚛 Package Loaded in the (SwiftX Courier) Flight' }
  ],
  'SWF987654321': [
    { time: '2024-07-05 09:15', msg: '📦 Package accepted in (SwiftX Courier) WAREHOUSE.' },
    { time: '2024-07-06 14:00', msg: '🚛 Package Loaded in the (SwiftX Courier) Flight' }
  ],
   'SWF987654324': [
    { time: '2024-07-05 09:15', msg: '📦 Package accepted in (SwiftX Courier) WAREHOUSE.' },
    { time: '2024-07-06 14:00', msg: '🚛 Package Loaded in the (SwiftX Courier) Flight' }
  ]
};

localStorage.setItem('trackingDB', JSON.stringify(trackingDB));


function trackParcel() {
  const number = document.getElementById('tracking-number').value.trim();
  showTrackingInfo(number, 'tracking-result');
}

function trackPublicParcel() {
  const number = document.getElementById('public-tracking-number').value.trim();
  showTrackingInfo(number, 'public-tracking-result');
}

function showTrackingInfo(number, resultId) {
  const container = document.getElementById(resultId);
  container.innerHTML = '';
  if (trackingDB[number]) {
    const steps = trackingDB[number];
    const ul = document.createElement('ul');
    steps.forEach(s => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${s.time}</strong>: ${s.msg}`;
      ul.appendChild(li);
    });
    container.appendChild(ul);
    const progress = Math.round((steps.length / 6) * 100);
    container.innerHTML += `<div style="margin-top:10px;">Progress: ${progress}%</div>`;
  } else {
    container.textContent = "Tracking number not found.";
    container.style.color = 'red'
  }
}

// Admin increase progress
function adminIncreaseProgress() {
  const selected = document.getElementById('admin-tracking-select').value;
  const updates = [
     'IN Transit 🚀  (A Compulsory Payment of R1000 will be cleared by you on arrival of the parcel in your country)',
    'Arrived at International Cape Town Airport🏬 (Pending Clearance)',
    'In transit to final destination 🚚',
    'Delivered and signed by: Swiftx courier service ✍️'
  ];
  

  const data = trackingDB[selected];
  if (data.length < 6) {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const nextStep = updates[data.length - 2] || 'Delivered ✅';
    data.push({ time: now, msg: nextStep });

    // ✅ Save update to localStorage
    localStorage.setItem('trackingDB', JSON.stringify(trackingDB));

    alert("Tracking updated!");
    showTrackingInfo(selected, 'tracking-result');
  } else {
    alert("Tracking already complete.");
  }

  
}


 

// Session restore
const savedEmail = localStorage.getItem("currentSession");
if (savedEmail) {
  const user = JSON.parse(localStorage.getItem(savedEmail));
  if (user) {
    currentUser = user;
    loadDashboard();
    showPage("dashboard");
  } else {
    showPage("home-page");
  }
} else {
  showPage("home-page");
}
