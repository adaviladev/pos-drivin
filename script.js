// Initialize DataTable
let table = $("#drivin").DataTable({
  paging: true,
  pageLength: 20,
  lengthChange: false,
  ordering: true,
  searching: true,
  layout: {
    topEnd: {
      search: {
        placeholder: "Buscar modelo",
      },
    },
  },
});


// Initialize Leaflet map
var map = L.map("map").setView([0, 0], 2); // Centered globally
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var marker = L.marker([0, 0]).addTo(map); // Initial marker position

// Historical landmarks data
const historicalLandmarks = [
  { name: "Eiffel Tower", lat: 48.8584, lng: 2.2945 },
  { name: "Great Wall of China", lat: 40.4319, lng: 116.5704 },
  { name: "Machu Picchu", lat: -13.1611, lng: -72.545 },
  { name: "Colosseum", lat: 41.8902, lng: 12.4922 },
  { name: "Taj Mahal", lat: 27.1751, lng: 78.0421 },
  { name: "Statue of Liberty", lat: 40.6892, lng: -74.0445 },
  { name: "Christ the Redeemer", lat: -22.9068, lng: -43.1729 },
  { name: "Petra", lat: 30.3285, lng: 35.4444 },
  { name: "Angkor Wat", lat: 13.4125, lng: 103.8667 },
  { name: "Sydney Opera House", lat: -33.8568, lng: 151.2153 },
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
      // Store vehicle data with simulated historical locations
      window.vehicleData = data.map((car, index) => ({
        ...car,
        lat: historicalLandmarks[index % historicalLandmarks.length].lat,
        lng: historicalLandmarks[index % historicalLandmarks.length].lng,
        name: historicalLandmarks[index % historicalLandmarks.length].name,
      }));

      const tableData = window.vehicleData.map((car) => [
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
        // Add an identifier if available
        car.id || "N/A", // Assuming each vehicle has a unique ID
        // Include simulated latitude and longitude
        car.lat || "N/A",
        car.lng || "N/A",
        car.name || "N/A",
      ]);
      table.clear().rows.add(tableData).draw();
    })
    .catch((error) => console.error("Error:", error));
};

// Fetch data on page load
fetchData("");

// Add event listener to table rows for map updates
$("#drivin tbody").on("click", "tr", function () {
  // Get the index of the clicked row
  const dataIndex = table.row(this).index();
  const selectedVehicle = window.vehicleData[dataIndex];

  if (selectedVehicle && selectedVehicle.lat && selectedVehicle.lng) {
    // Update the map with the selected vehicle's simulated location
    map.setView([selectedVehicle.lat, selectedVehicle.lng], 10);
    marker
      .setLatLng([selectedVehicle.lat, selectedVehicle.lng])
      .bindPopup(`Ubicación del vehículo`)
      .openPopup();

    // Scroll to the map container to make it visible
    document.getElementById("map").scrollIntoView({ behavior: "smooth" });
  } else {
    console.error("No location data available for selected vehicle.");
  }
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
      // Update vehicle data with simulated historical locations
      window.vehicleData = data.map((car, index) => ({
        ...car,
        lat: historicalLandmarks[index % historicalLandmarks.length].lat,
        lng: historicalLandmarks[index % historicalLandmarks.length].lng,
        name: historicalLandmarks[index % historicalLandmarks.length].name,
      }));

      const tableData = window.vehicleData.map((car) => [
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
        // Add an identifier if available
        car.id || "N/A", // Assuming each vehicle has a unique ID
        // Include simulated latitude and longitude
        car.lat || "N/A",
        car.lng || "N/A",
        car.name || "N/A",
      ]);
      table.clear().rows.add(tableData).draw();
    })
    .catch((error) => console.error("Error:", error));
};

// JavaScript to scroll to the table when the button is clicked
document
  .getElementById("scrollToTableBtn")
  .addEventListener("click", function () {
    const tableElement = document.getElementById("drivin");
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: "smooth" });
    }
  });
