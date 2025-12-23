// js/car-owner.js

let map, userMarker, accuracyCircle;
let userLat, userLng;

// Initialize map
document.addEventListener("DOMContentLoaded", () => {
  const mapDiv = document.getElementById("user-map");
  if (!mapDiv) return;

  map = L.map("user-map").setView([12.9716, 77.5946], 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);
});

// Haversine distance (km)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Get user location
function getUserLocation() {
  const status = document.getElementById("loc-status");
  status.textContent = "Detecting location...";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;

      map.setView([userLat, userLng], 16);

      if (!userMarker) {
        userMarker = L.marker([userLat, userLng], {
          draggable: true
        }).addTo(map);

        userMarker.on("dragend", () => {
          const p = userMarker.getLatLng();
          userLat = p.lat;
          userLng = p.lng;
          loadNearbyParking();
        });
      } else {
        userMarker.setLatLng([userLat, userLng]);
      }

      if (accuracyCircle) map.removeLayer(accuracyCircle);
      accuracyCircle = L.circle([userLat, userLng], {
        radius: pos.coords.accuracy
      }).addTo(map);

      status.textContent = "Location set. Drag pin if needed.";
      loadNearbyParking();
    },
    (err) => {
      status.textContent = err.message;
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

// Load nearby parking (2km)
async function loadNearbyParking() {
  const res = await fetch(
    `/api/parking/nearby?lat=${userLat}&lng=${userLng}&radius=2`
  );
  const parkings = await res.json();

  const grid = document.querySelector(".parking-grid");
  grid.innerHTML = "";

  parkings.forEach(p => {
    const dist = getDistance(userLat, userLng, p.lat, p.lng).toFixed(2);

    const card = document.createElement("div");
    card.className = "parking-card visible";
    card.innerHTML = `
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>${dist} km away</p>
      <p class="price">₹${p.price}/hour</p>
      <button class="book-btn">View on Map</button>
    `;

    card.onclick = () => {
      map.setView([p.lat, p.lng], 18);
      L.marker([p.lat, p.lng]).addTo(map);
    };

    grid.appendChild(card);
  });
}
