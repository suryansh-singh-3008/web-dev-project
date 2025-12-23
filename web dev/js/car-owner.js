// js/car-owner.js
let searchRadius = 10;

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

// Fetch parking from MongoDB
async function loadNearbyParking() {
  console.log("USER LOCATION:", window.userLat, window.userLng);

  if (window.userLat == null || window.userLng == null) {
    console.warn("User location not set yet");
    return;
  }

  try {
    const url = `http://localhost:3000/api/parking/nearby?lat=${window.userLat}&lng=${window.userLng}&radius=${searchRadius}`;
    console.log("Fetching:", url);

    const res = await fetch(url);
    const parkings = await res.json();

    console.log("Fetched parkings:", parkings);

    const grid = document.querySelector(".parking-grid");
    grid.innerHTML = "";

    if (parkings.length === 0) {
      grid.innerHTML =
        "<p style='color:#bbb'>No parking found within 10 km.</p>";
      return;
    }

    parkings.forEach(p => {
          
      const dist = getDistance(
        window.userLat,
        window.userLng,
        p.lat,
        p.lng
      ).toFixed(2);
      const card = document.createElement("div");
      card.className = "parking-card fade-in";

      card.innerHTML = `
  <img src="${p.image}">
  <h3>${p.name}</h3>
  <p><i class="fas fa-route"></i> ${dist} km away</p>
  <p class="price">₹${p.price} / hour</p>
  <button class="book-btn">View on Map</button>
`;


      card.querySelector(".book-btn").onclick = () => {
        if (window.map && window.marker) {
          window.map.setView([p.lat, p.lng], 18);
          window.marker.setLatLng([p.lat, p.lng]);
        }
      };

      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading parking:", err);
  }
}
window.loadNearbyParking = loadNearbyParking;

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("radius-slider");
  const label = document.getElementById("radius-value");

  if (slider) {
    slider.addEventListener("input", () => {
      searchRadius = slider.value;
      label.textContent = slider.value;

      if (window.userLat && window.userLng) {
        loadNearbyParking();
      }
    });
  }
});
