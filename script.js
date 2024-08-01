// Initialize DataTable
let table = $("#drivin").DataTable({
  paging: true,
  pageLength: 20,
  lengthChange: false,
  ordering: true,
  searching: true,
});

// Initialize Leaflet map
var map = L.map("map").setView([-33.4489, -70.6693], 5); // Centered on Santiago
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var marker = L.marker([-33.4489, -70.6693]).addTo(map); // Initial marker position

// Landmark data
const landmarks = [
  { name: "Easter Island", lat: -27.1127, lng: -109.3497 },
  { name: "Atacama Desert", lat: -24.5, lng: -68.0 },
  { name: "Torres del Paine", lat: -51.3, lng: -72.4 },
  { name: "Valparaíso", lat: -33.0464, lng: -71.3003 },
  { name: "Santiago", lat: -33.4489, lng: -70.6693 },
  { name: "Chiloé Island", lat: -41.5, lng: -73.8 },
];

// Fetch data function
const fetchData = (model = "") => {
  const apiUrl = `https://api.api-ninjas.com/v1/cars?limit=100&model=${model}`;
  fetch(apiUrl, {
    method: "GET",
    headers: { "X-Api-Key": "+Q7oY2WzWPvMxAYRfCVsog==L5nkF9CS3pf6Vkqr" },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${err.message}`
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        console.error("No data found");
        return;
      }
      const tableData = data.map((car) => [
        car.class || "N/A",
        car.fuel_type || "N/A",
        car.make || "N/A",
        car.model || "N/A",
        car.year || "N/A",
        car.transmission || "N/A",
        car.city_mpg || "N/A",
        car.highway_mpg || "N/A",
        car.combination_mpg || "N/A",
        car.cylinders || "N/A",
        car.displacement || "N/A",
        car.drive || "N/A",
      ]);
      table.clear().rows.add(tableData).draw();
    })
    .catch((error) => console.error("Error:", error));
};

// Fetch data on page load
fetchData("");

// Add event listener to table rows for map updates
$("#drivin tbody").on("click", "tr", function () {
  // Select a random landmark from the list
  const randomLandmark =
    landmarks[Math.floor(Math.random() * landmarks.length)];

  // Update the map view and marker position
  map.setView([randomLandmark.lat, randomLandmark.lng], 5);
  marker
    .setLatLng([randomLandmark.lat, randomLandmark.lng])
    .bindPopup(`<b>${randomLandmark.name}</b>`)
    .openPopup();
});

// Update the model and fetch new data when the user types in the search box
$("#dt-search-0").on("input", function () {
  const model = $(this).val();
  fetchData(model);
});

// Modal

// Open the modal
document.getElementById("openModalBtn").onclick = function () {
  document.getElementById("filterModal").style.display = "block";
};

// Close the modal when the user clicks on the 'X'
document.getElementsByClassName("close")[0].onclick = function () {
  document.getElementById("filterModal").style.display = "none";
};

// Close the modal if the user clicks outside the modal
window.onclick = function (event) {
  if (event.target == document.getElementById("filterModal")) {
    document.getElementById("filterModal").style.display = "none";
  }
};

// Handle the filter form submission
document.getElementById("filterForm").onsubmit = function (event) {
  event.preventDefault();
  // Get filter values
  let carType = document.getElementById("carType").value;
  let make = document.getElementById("make").value;
  let model = document.getElementById("model").value;
  let year = document.getElementById("year").value;
  let transmission = document.getElementById("transmission").value;
  let mpgRange = document.getElementById("mpgRange").value;

  // Filter data with obtained values
  filterData(carType, make, model, year, transmission, mpgRange);

  // Close the modal after applying filters
  document.getElementById("filterModal").style.display = "none";
};

const filterData = (carType, make, model, year, transmission, mpgRange) => {
  // Build the API URL with filters
  let apiUrl = `https://api.api-ninjas.com/v1/cars?limit=100`;

  if (carType) apiUrl += `&class=${carType}`;
  if (make) apiUrl += `&make=${make}`;
  if (model) apiUrl += `&model=${model}`;
  if (year) apiUrl += `&year=${year}`;
  if (transmission) apiUrl += `&transmission=${transmission}`;
  // Assume mpgRange is a string in the format 'min-max'
  if (mpgRange) {
    const [minMpg, maxMpg] = mpgRange.split("-");
    apiUrl += `&min_combined_mpg=${minMpg}&max_combined_mpg=${maxMpg}`;
  }

  fetch(apiUrl, {
    method: "GET",
    headers: { "X-Api-Key": "+Q7oY2WzWPvMxAYRfCVsog==L5nkF9CS3pf6Vkqr" },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${err.message}`
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        console.error("No data found for filters");
        return;
      }
      const tableData = data.map((car) => [
        car.class || "N/A",
        car.fuel_type || "N/A",
        car.make || "N/A",
        car.model || "N/A",
        car.year || "N/A",
        car.transmission || "N/A",
        car.city_mpg || "N/A",
        car.highway_mpg || "N/A",
        car.combination_mpg || "N/A",
        car.cylinders || "N/A",
        car.displacement || "N/A",
        car.drive || "N/A",
      ]);
      table.clear().rows.add(tableData).draw();
    })
    .catch((error) => console.error("Error:", error));
};
