let startCoords;
let intermediateCoords = [];
let distanceTravelled = 0;

const distanceTravelledDisplay = document.getElementById('distanceTravelled');

// Function to handle login and registration form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission
  
  // Get form data
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  
  // Validate form data (You can add more validation if needed)
  if (username && password && name && phone && email) {
    // Simulate registration (You can replace this with actual registration logic)
    // Here, we're just logging the data to the console
    console.log("Registration Successful!");
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Name:", name);
    console.log("Phone:", phone);
    console.log("Email:", email);

    // Proceed with login (for demonstration purposes)
    // This would typically involve verifying credentials against a database
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('trackerPage').style.display = 'block';
  } else {
    // If any required fields are missing, display an error message
    alert('Please fill in all required fields.');
  }
});

// Function to start tracking distance
function startTracking() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      startCoords = position.coords;
      intermediateCoords.push(position.coords);
      document.getElementById('startCoordinates').textContent = `Lat: ${startCoords.latitude}, Lng: ${startCoords.longitude}`;
    }, error => {
      console.error("Error getting the starting location:", error);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// Function to stop tracking distance
function stopTracking() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const endCoords = position.coords;
      intermediateCoords.push(endCoords);
      document.getElementById('stopCoordinates').textContent = `Lat: ${endCoords.latitude}, Lng: ${endCoords.longitude}`;
      let distanceTravelled = calculateDistance();
      let selectedVehicleType;
      if (document.getElementById('carCheckbox').checked) {
        selectedVehicleType = 'car';
      } else if (document.getElementById('busCheckbox').checked) {
        selectedVehicleType = 'bus';
      } else if (document.getElementById('truckCheckbox').checked) {
        selectedVehicleType = 'truck';
      }
      let totalPrice = calculatePrice(distanceTravelled, selectedVehicleType);
      distanceTravelledDisplay.textContent = distanceTravelled.toFixed(2);
      document.getElementById('totalPrice').textContent = totalPrice;
      displayMap();
    }, error => {
      console.error("Error getting the ending location:", error);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// Function to calculate distance
function calculateDistance() {
  let totalDistance = 0;
  for (let i = 0; i < intermediateCoords.length - 1; i++) {
    const lat1 = intermediateCoords[i].latitude;
    const lon1 = intermediateCoords[i].longitude;
    const lat2 = intermediateCoords[i + 1].latitude;
    const lon2 = intermediateCoords[i + 1].longitude;
    totalDistance += distance(lat1, lon1, lat2, lon2);
  }
  return totalDistance;
}

// Function to calculate distance using Haversine formula
function distance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// Function to convert degrees to radians
function toRad(deg) {
  return deg * (Math.PI / 180);
}

// Function to calculate price
function calculatePrice(distance, vehicleType) {
  let pricePerKm = 0;
  switch (vehicleType) {
    case 'car':
      pricePerKm = 50;
      break;
    case 'bus':
      pricePerKm = 60;
      break;
    case 'truck':
      pricePerKm = 70;
      break;
    default:
      break;
  }
  return distance * pricePerKm;
}

// Function to display the tracked path on the map
function displayMap() {
  const pathCoordinates = intermediateCoords.map(coord => ([coord.latitude, coord.longitude]));
  const mapDiv = L.map('map').setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapDiv);
  const polyline = L.polyline(pathCoordinates, { color: 'red' }).addTo(mapDiv);
  mapDiv.fitBounds(polyline.getBounds());
}