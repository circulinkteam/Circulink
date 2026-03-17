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

// function renderListings(filter='all') {
//   const grid = document.getElementById('listings-grid');
//   const filtered = filter === 'all' ? listings : listings.filter(l => l.type === filter);
//   grid.innerHTML = filtered.map(l => `
//     <div class="listing-card" onclick="openListing('${l.name}','${l.price}','${l.qty}','${l.location}','${l.quality}')">
//       <span class="listing-type-badge ${l.badge}">${l.type}</span>
//       <h4>${l.name}</h4>
//       <div class="listing-meta">${l.qty} · ${l.location} · Grade ${l.quality}</div>
//       <div class="listing-footer">
//         <div class="listing-price">${l.price}</div>
//         <button class="listing-btn">Negotiate →</button>
//       </div>
//     </div>
//   `).join('');
// }

function renderListings(filter='all') {
  const grid = document.getElementById('listings-grid');
  const filtered = filter === 'all' ? listings : listings.filter(l => l.type === filter);
  
  grid.innerHTML = filtered.map(l => `
    <div class="listing-card">
      <div onclick="openListing('${l.name}','${l.price}','${l.qty}','${l.location}','${l.quality}')">
        <span class="listing-type-badge ${l.badge}">${l.type}</span>
        <h4>${l.name}</h4>
        <div class="listing-meta">${l.qty} · ${l.location} · Grade ${l.quality}</div>
        <div class="listing-price" style="margin-bottom:15px;">${l.price}</div>
      </div>
      <div class="listing-footer" style="display:flex; gap:10px;">
        <button class="listing-btn" style="flex:1;" onclick="openListing('${l.name}','${l.price}','${l.qty}','${l.location}','${l.quality}')">Details</button>
        <button class="listing-btn" style="flex:1; background:var(--amber); color:#000; border:none; font-weight:700;" 
                onclick="initiatePayment('100', '${l.name}')">Buy Now</button>
      </div>
    </div>
  `).join('');
}

function initiatePayment(amount, itemName) {
    const paymentModal = document.getElementById('payment-modal');
    const container = document.getElementById('dropin-container');
    
    // 1. Show the modal
    paymentModal.classList.add('active'); 
    container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">Loading Secure Payment Portal...</p>';

    // 2. Fetch the token
    fetch("/client-token")
        .then(res => res.text())
        .then(clientToken => {
            // Initialize Braintree
            braintree.dropin.create({
                authorization: clientToken,
                container: '#dropin-container'
            }, function (err, instance) {
                if (err) {
                    console.error("Drop-in Error:", err);
                    container.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
                    return;
                }

                console.log("Braintree UI Ready!");

                const submitBtn = document.getElementById("submit-button");
                submitBtn.onclick = function () {
                    instance.requestPaymentMethod(function (err, payload) {
                        if (err) return console.error(err);
                        
                        // Send payload.nonce to your server
                        alert("Success! Token generated: " + payload.nonce);
                        // Here you would add: fetch('/checkout', { method: 'POST', body: ... })
                    });
                };
            });
        })
        .catch(err => {
            container.innerHTML = '<p style="color:red;">Failed to connect to server.</p>';
        });
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


function openPaymentModal(amount, itemName) {
    const modal = document.getElementById('payment-modal');
    modal.classList.add('active'); // This triggers the CSS display: flex
    
    // Optional: Log to console to check if it's firing
    console.log(`Opening payment for ${itemName}: ₹${amount}`);
    
    // Call your Braintree setup here...
    // initiateBraintree(amount); 
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.remove('active');
}

/**
 * CIRCULINK - Donation Panel Logic
 * Handles: Image Previews, AI Simulation, and Form Submission
 */

// Function to handle the donation image upload and AI simulation
const donationFileInput = document.getElementById('donation-file');
if (donationFileInput) {
    donationFileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const uploadZone = this.parentElement.querySelector('.upload-zone');
            const uploadText = uploadZone.querySelector('p');
            const uploadIcon = uploadZone.querySelector('.upload-zone-icon');

            // Visual feedback for AI Processing
            uploadText.innerHTML = "<em>AI analyzing item quality...</em>";
            uploadIcon.innerHTML = "⌛";

            const reader = new FileReader();
            reader.onload = (e) => {
                setTimeout(() => {
                    // Simulate high-quality detection
                    uploadIcon.innerHTML = "✨";
                    uploadText.innerHTML = "<span style='color:#2db86e; font-weight:bold;'>AI Verified: High Quality</span>";
                    
                    // Optional: Show a tiny thumbnail in the icon area
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.height = "40px";
                    img.style.borderRadius = "4px";
                    uploadIcon.appendChild(img);
                }, 1500);
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
}

// Function to handle the "Confirm Donation Post" button
async function confirmDonation() {
    // Select inputs based on your HTML structure
    const category = document.getElementById('donation-item-type').value;
    const conditionSelect = document.querySelectorAll('#social select')[1]; // Second select in social section
    const locationInput = document.querySelector('input[placeholder="Enter your area for NGO collection"]');
    const notesArea = document.querySelector('textarea[placeholder*="Please call before"]');
    const donateBtn = document.querySelector('#social .btn-primary');

    if (!category || !locationInput.value) {
        alert("Please select a category and enter a pickup location.");
        return;
    }

    // UI Loading State
    const originalText = donateBtn.innerHTML;
    donateBtn.innerText = "Posting to NGO Network...";
    donateBtn.disabled = true;

    // Data Preparation
    const donationPayload = {
        category: category,
        condition: conditionSelect ? conditionSelect.value : "Good",
        location: locationInput.value,
        notes: notesArea ? notesArea.value : ""
    };

    console.log("Submitting Donation:", donationPayload);

    try {
        /* HACKATHON NOTE: If your backend is ready, use the fetch block below.
           If not, the 'catch' block will handle the demo modal.
        */
        const response = await fetch('/api/donations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donationPayload)
        });

        if (response.ok) {
            openModal("Donation Successful", "Your items have been listed. Partner NGOs in your area will be notified for pickup.");
            resetDonationForm();
        } else {
            throw new Error("Backend not connected");
        }
    } catch (error) {
        // Demo Fallback: Shows success even if backend isn't live yet
        setTimeout(() => {
            openModal("Donation Posted (Demo)", "Success! In a live environment, this would notify Goonj or Soles4Souls based on your location.");
            resetDonationForm();
            donateBtn.innerHTML = originalText;
            donateBtn.disabled = false;
        }, 1000);
    }
}

// Utility to clear form after submission
function resetDonationForm() {
    document.getElementById('donation-item-type').value = "";
    document.querySelector('input[placeholder="Enter your area for NGO collection"]').value = "";
    document.querySelector('textarea[placeholder*="Please call before"]').value = "";
    const uploadZone = document.getElementById('donation-file').parentElement.querySelector('.upload-zone');
    uploadZone.querySelector('p').innerText = "Click to upload donation images";
    uploadZone.querySelector('.upload-zone-icon').innerText = "📤";
}

// Update your HTML button to trigger this:
// Find your button and add: onclick="confirmDonation()"
document.querySelector('#social .btn-primary').setAttribute('onclick', 'confirmDonation()');
