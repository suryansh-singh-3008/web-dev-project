// js/landowner.js

let ownerMap, ownerMarker;

document.addEventListener("DOMContentLoaded", () => {
  const mapDiv = document.getElementById("owner-map");
  const locationBtn = document.getElementById("use-location-btn");
  const form = document.querySelector(".landowner-form");

  if (!mapDiv) return;

  // Initialize map
  ownerMap = L.map("owner-map").setView([12.9716, 77.5946], 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(ownerMap);

  // Draggable marker
  ownerMarker = L.marker([12.9716, 77.5946], {
    draggable: true
  }).addTo(ownerMap);

  updateLatLng(ownerMarker.getLatLng());

  ownerMarker.on("dragend", () => {
    updateLatLng(ownerMarker.getLatLng());
  });

  // Button click (NO inline onclick)
  locationBtn.addEventListener("click", detectOwnerLocation);

  // Form submit
  form.addEventListener("submit", submitParking);
});

// Detect owner's current location
function detectOwnerLocation() {
  const status = document.getElementById("owner-loc-status");
  status.textContent = "📡 Detecting your location...";

  if (!navigator.geolocation) {
    status.textContent = "❌ Geolocation not supported in this browser.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      ownerMap.setView([lat, lng], 17);
      ownerMarker.setLatLng([lat, lng]);
      updateLatLng({ lat, lng });

      status.textContent =
        "✅ Location detected. You can drag the pin to adjust.";
    },
    (err) => {
      status.textContent = "❌ " + err.message;
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

// Update hidden inputs
function updateLatLng(pos) {
  document.getElementById("lat").value = pos.lat;
  document.getElementById("lng").value = pos.lng;
}

// Submit parking data (backend-ready)
async function submitParking(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    address: document.getElementById("address").value,
    lat: Number(document.getElementById("lat").value),
    lng: Number(document.getElementById("lng").value),
    space: Number(document.getElementById("space").value),
    type: document.getElementById("type").value,
    price: Number(document.getElementById("price").value),
    image: document.getElementById("photo").value
  };

  try {
    const res = await fetch("http://localhost:3000/api/parking/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    alert(result.message || "Parking added successfully");
  } catch (err) {
    console.error(err);
    alert("Error saving parking");
  }
}

