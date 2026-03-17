// ── LISTINGS DATA ──
const listings = [
  { id:1, type:'Plastic', name:'PET Bottle Scrap', qty:'120 kg', location:'Siwan, Bihar', price:'₹18/kg', quality:'A', badge:'badge-plastic' },
  { id:2, type:'Metal', name:'Iron Scrap Pieces', qty:'80 kg', location:'Siwan, Bihar', price:'₹32/kg', quality:'B', badge:'badge-metal' },
  { id:3, type:'Paper', name:'Corrugated Cardboard', qty:'200 kg', location:'Siwan, Bihar', price:'₹8/kg', quality:'A', badge:'badge-paper' },
  { id:4, type:'Organic', name:'Food Waste (Compostable)', qty:'50 kg', location:'Siwan, Bihar', price:'₹4/kg', quality:'B', badge:'badge-organic' },
  { id:5, type:'Plastic', name:'HDPE Container Scrap', qty:'60 kg', location:'Siwan', price:'₹22/kg', quality:'A', badge:'badge-plastic' },
  { id:6, type:'Metal', name:'Copper Wire Waste', qty:'15 kg', location:'Siwan, Bihar', price:'₹420/kg', quality:'A+', badge:'badge-metal' },
  { id:7, type:'Paper', name:'Office Paper Waste', qty:'90 kg', location:'Siwan, Bihar', price:'₹10/kg', quality:'A', badge:'badge-paper' },
  { id:8, type:'Organic', name:'Vegetable Market Waste', qty:'300 kg', location:'Siwan', price:'₹2/kg', quality:'C', badge:'badge-organic' },
];

function renderListings(filter='all') {
  const grid = document.getElementById('listings-grid');
  const filtered = filter === 'all' ? listings : listings.filter(l => l.type === filter);
  grid.innerHTML = filtered.map(l => `
    <div class="listing-card" onclick="openListing('${l.name}','${l.price}','${l.qty}','${l.location}','${l.quality}')">
      <span class="listing-type-badge ${l.badge}">${l.type}</span>
      <h4>${l.name}</h4>
      <div class="listing-meta">${l.qty} · ${l.location} · Grade ${l.quality}</div>
      <div class="listing-footer">
        <div class="listing-price">${l.price}</div>
        <button class="listing-btn">Negotiate →</button>
      </div>
    </div>
  `).join('');
}

function filterListings(type, btn) {
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderListings(type);
}

function openListing(name, price, qty, loc, quality) {
  showModal(`${name}`, `📦 Quantity: ${qty}\n📍 Location: ${loc}\n⭐ Quality Grade: ${quality}\n💰 AI Price: ${price}\n\nContact the seller to negotiate and arrange pickup. This listing was verified by CIRCULINK AI.`);
}

renderListings();

// ── AI SIMULATION ──
const aiData = {
  'Plastic': { type:'PET / HDPE Plastic', quality:'Grade A', price:'₹18-24/kg', recycle:'92% recyclable' },
  'Paper / Cardboard': { type:'Corrugated Cardboard', quality:'Grade A', price:'₹8-12/kg', recycle:'88% recyclable' },
  'Metal / Scrap': { type:'Ferrous Metal Scrap', quality:'Grade B+', price:'₹28-40/kg', recycle:'97% recyclable' },
  'Organic Waste': { type:'Organic / Compostable', quality:'Grade B', price:'₹3-6/kg', recycle:'Compostable' },
  'E-Waste': { type:'Electronic Waste', quality:'Grade B', price:'₹50-120/kg', recycle:'Hazardous — Special processing' },
  'Glass': { type:'Glass Cullet', quality:'Grade A', price:'₹6-10/kg', recycle:'100% recyclable' },
  'Textile / Clothing': { type:'Textile Waste', quality:'Grade B', price:'₹5-15/kg', recycle:'Donate or upcycle' },
  'Hair Waste': { type:'Human Hair', quality:'Grade A', price:'₹200-600/kg', recycle:'For wigs/extensions' },
  'Mixed Waste': { type:'Mixed Recyclables', quality:'Grade C', price:'₹4-8/kg', recycle:'45-60% recyclable' },
};

function simulateAI(input) {
  const file = input.files[0];
  if (!file) return;
  const icon = document.getElementById('upload-icon');
  const text = document.getElementById('upload-text');
  icon.textContent = '⏳';
  text.textContent = 'AI analysing your image...';

  const wType = document.getElementById('waste-type').value;
  const data = aiData[wType] || { type:'Auto-detected Waste', quality:'Grade B', price:'₹10–20/kg', recycle:'~70% recyclable' };

  setTimeout(() => {
    icon.textContent = '✅';
    text.textContent = file.name + ' — Analysis complete';
    const res = document.getElementById('ai-result');
    res.style.display = 'block';
    document.getElementById('res-type').textContent = data.type;
    document.getElementById('res-quality').textContent = data.quality;
    document.getElementById('res-price').textContent = data.price;
    document.getElementById('res-recycle').textContent = data.recycle;
  }, 2000);
}

function submitListing() {
  showModal('🎉 Listing Submitted!', 'Your waste listing has been submitted to the CIRCULINK marketplace. Our AI has verified the classification and price recommendation. Buyers and recyclers will be able to contact you shortly.');
}

function submitContact() {
  showModal('✉️ Message Sent!', 'Thank you for reaching out! The CIRCULINK team will get back to you within 24-48 hours regarding your partnership inquiry.');
}

function openDonate(cat) {
  showModal(`Donate: ${cat}`, `You've selected to donate ${cat}. CIRCULINK will connect your donation directly with a verified partner NGO in your region. Drop-off points and pickup scheduling will be shared after you complete the donation form.`);
}

// ── MODAL ──
function showModal(title, body) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').textContent = body;
  document.getElementById('modal').classList.add('open');
}
function closeModal() {
  document.getElementById('modal').classList.remove('open');
}
document.getElementById('modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
