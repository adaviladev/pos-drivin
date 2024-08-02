// Initialize the DataTable for the HTML element with the ID 'drivin' with config options
let table = $("#drivin").DataTable({
  paging: true,
  pageLength: 20,
  lengthChange: false,
  ordering: true,
  searching: false,
});

// Initialize a Leaflet map and set its initial view
var map = L.map("map").setView([0, 0], 2); // Center the map globally

// Add a tile layer to the map using OpenStreetMap tiles
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map); // Add the tile layer to the map

// Create a marker at the initial position of latitude 0 and longitude 0
var marker = L.marker([0, 0]).addTo(map); // Add the marker to the map at the initial position

// Historical landmarks data used for random location of cars
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

// Function to process API data and update the DataTable
const processVehicleData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.error("No data found");
    // Clear the DataTable if no data is found
    table.clear().draw();
    return;
  }

  // Update vehicle data with simulated historical locations
  window.vehicleData = data.map((car, index) => ({
    ...car,
    lat: historicalLandmarks[index % historicalLandmarks.length].lat,
    lng: historicalLandmarks[index % historicalLandmarks.length].lng,
    name: historicalLandmarks[index % historicalLandmarks.length].name,
  }));

  // Format the vehicle data for display in the DataTable
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
  ]);

  // Clear the existing data in the DataTable and add the new data
  table.clear().rows.add(tableData).draw();
};

// Function to fetch data from API
const fetchData = (apiUrl) => {
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
    .then(processVehicleData)
    .catch((error) => console.error("Error:", error));
};

// Function to fetch data with filters
const filterData = (carType, make, model, year, transmission) => {
  // Build the API URL with filters
  let apiUrl = `https://api.api-ninjas.com/v1/cars?limit=50`;

  if (carType) apiUrl += `&class=${carType}`;
  if (make) apiUrl += `&make=${make}`;
  if (model) apiUrl += `&model=${model}`;
  if (year) apiUrl += `&year=${year}`;
  if (transmission) apiUrl += `&transmission=${transmission}`;

  // Uncomment this if you have mpgRange handling in the future
  // Assume mpgRange is a string in the format 'min-max'
  // if (mpgRange) {
  //   const [minMpg, maxMpg] = mpgRange.split("-");
  //   apiUrl += `&min_combined_mpg=${minMpg}&max_combined_mpg=${maxMpg}`;
  // }

  fetchData(apiUrl);
};

// Event listener for filter form submission
document.getElementById("filterForm").onsubmit = function (event) {
  event.preventDefault();
  // Get filter values
  let carType = document.getElementById("carType").value;
  let make = document.getElementById("make").value;
  let model = document.getElementById("model").value;
  let year = document.getElementById("year").value;
  let transmission = document.getElementById("transmission").value;
  // let mpgRange = document.getElementById("mpgRange").value;

  // Fetch filtered data
  filterData(carType, make, model, year, transmission); //deleted mpgRange until fixed

  // Close the modal after applying filters
  document.getElementById("filterModal").style.display = "none";
};

// Add event listener to table rows for map updates
$("#drivin tbody").on("click", "tr", function () {
  const dataIndex = table.row(this).index();
  const selectedVehicle = window.vehicleData[dataIndex];

  if (selectedVehicle && selectedVehicle.lat && selectedVehicle.lng) {
    map.setView([selectedVehicle.lat, selectedVehicle.lng], 10);
    marker
      .setLatLng([selectedVehicle.lat, selectedVehicle.lng])
      .bindPopup(`Ubicación del vehículo`)
      .openPopup();
    document.getElementById("map").scrollIntoView({ behavior: "smooth" });
  } else {
    console.error(
      "No existen datos de ubicación para el vehículo seleccionado."
    );
  }
});

// Modal
// Open the modal
document.getElementById("openModalBtn").onclick = function () {
  document.getElementById("filterModal").style.display = "block";
};

// Close the modal when the user clicks on the 'X'
document.getElementsByClassName("close-filter-modal")[0].onclick = function () {
  document.getElementById("filterModal").style.display = "none";
};

// Close the modal if the user clicks outside the modal
window.onclick = function (event) {
  if (event.target == document.getElementById("filterModal")) {
    document.getElementById("filterModal").style.display = "none";
  }
};

// Scroll to the table when the button is clicked
document
  .getElementById("scrollToTableBtn")
  .addEventListener("click", function () {
    const tableElement = document.getElementById("drivin");
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: "smooth" });
    }
  });

// Add event listener for the clear filters button
document
  .querySelector(".clear-filter-btn")
  .addEventListener("click", function () {
    // Select all input fields in the filter form
    const inputs = document.querySelectorAll("#filterForm .form-control");

    // Clear the value of each input field
    inputs.forEach((input) => (input.value = ""));
  });
