// Initialize the DataTable for the HTML element with the ID 'drivin'
// This sets up various configuration options for how the table should behave and appear.
let table = $("#drivin").DataTable({
  paging: true,
  pageLength: 20,
  lengthChange: false,
  ordering: true,
  searching: false,
});

// Initialize a Leaflet map and set its initial view
// The map will be rendered in the HTML element with the ID 'map'
// It is centered at latitude 0 and longitude 0 with a zoom level of 2, showing the entire world
var map = L.map("map").setView([0, 0], 2); // Center the map globally

// Add a tile layer to the map using OpenStreetMap tiles
// Tile layers provide the visual representation of the map
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  // Set the maximum zoom level to 19, which determines how close the user can zoom in
  maxZoom: 19,

  // Provide attribution to OpenStreetMap for the map tiles
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map); // Add the tile layer to the map

// Create a marker at the initial position of latitude 0 and longitude 0
// This marker will be displayed on the map at the center point
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

// Function to fetch vehicle data from an API based on the given model
const fetchData = () => {
  const apiUrl = `https://api.api-ninjas.com/v1/cars?limit=50`;
  fetch(apiUrl, {
    method: "GET",
    headers: { "X-Api-Key": "+Q7oY2WzWPvMxAYRfCVsog==L5nkF9CS3pf6Vkqr" },
  })
    // Process the response from the API
    .then((response) => {
      // Check if the response is not OK (status code not in the 200-299 range)
      if (!response.ok) {
        // Parse the response as JSON and throw an error with status and message
        return response.json().then((err) => {
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${err.message}`
          );
        });
      }
      // Parse and return the response as JSON if the response is OK
      return response.json();
    })
    // Process the data received from the API
    .then((data) => {
      // Check if the data is an array and not empty
      if (!Array.isArray(data) || data.length === 0) {
        // Log an error if no data is found
        console.error("No data found");
        return;
      }
      // Map the received data to include simulated historical locations
      // Use data from the historicalLandmarks array to add latitude, longitude, and name
      window.vehicleData = data.map((car, index) => ({
        ...car,
        lat: historicalLandmarks[index % historicalLandmarks.length].lat,
        lng: historicalLandmarks[index % historicalLandmarks.length].lng,
        name: historicalLandmarks[index % historicalLandmarks.length].name,
      }));

      // Format the vehicle data for display in the DataTable
      const tableData = window.vehicleData.map((car) => [
        car.class || "N/A", // Vehicle class or "N/A" if not available
        car.fuel_type || "N/A", // Fuel type or "N/A" if not available
        car.make || "N/A", // Vehicle make or "N/A" if not available
        car.model || "N/A", // Vehicle model or "N/A" if not available
        car.year || "N/A", // Vehicle year or "N/A" if not available
        car.transmission || "N/A", // Transmission type or "N/A" if not available
        car.city_mpg || "N/A", // City MPG or "N/A" if not available
        car.highway_mpg || "N/A", // Highway MPG or "N/A" if not available
        car.combination_mpg || "N/A", // Combined MPG or "N/A" if not available
      ]);
      // Clear the existing data in the DataTable and add the new data
      table.clear().rows.add(tableData).draw();
    })
    // Catch and log any errors that occur during the fetch operation
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
// $("#dt-search-0").on("input", function () {
//   const model = $(this).val();
//   fetchData(model);
// });

// Modal
// Open the modal
document.getElementById("openModalBtn").onclick = function () {
  document.getElementById("filterModal").style.display = "block";

  // Clear the search input field
  // document.getElementById("dt-search-0").value = "";

  // Trigger the DataTables search function to reflect the cleared input
  // table.search("").draw();
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

// Handle the filter form submission
document.getElementById("filterForm").onsubmit = function (event) {
  event.preventDefault();
  // Get filter values
  let carType = document.getElementById("carType").value;
  let make = document.getElementById("make").value;
  let model = document.getElementById("model").value;
  let year = document.getElementById("year").value;
  let transmission = document.getElementById("transmission").value;
  // let mpgRange = document.getElementById("mpgRange").value;

  // Filter data with obtained values
  filterData(carType, make, model, year, transmission); //deleted mpgRange until fixed

  // Close the modal after applying filters
  document.getElementById("filterModal").style.display = "none";
};

const filterData = (carType, make, model, year, transmission) => {
  // Build the API URL with filters
  let apiUrl = `https://api.api-ninjas.com/v1/cars?limit=50`;

  if (carType) apiUrl += `&class=${carType}`;
  if (make) apiUrl += `&make=${make}`;
  if (model) apiUrl += `&model=${model}`;
  if (year) apiUrl += `&year=${year}`;
  if (transmission) apiUrl += `&transmission=${transmission}`;
  // Assume mpgRange is a string in the format 'min-max'
  // if (mpgRange) {
  //   const [minMpg, maxMpg] = mpgRange.split("-");
  //   apiUrl += `&min_combined_mpg=${minMpg}&max_combined_mpg=${maxMpg}`;
  // }

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

// Add event listener for the clear filters button
document
  .querySelector(".clear-filter-btn")
  .addEventListener("click", function () {
    // Select all input fields in the filter form
    const inputs = document.querySelectorAll("#filterForm .form-control");

    // Clear the value of each input field
    inputs.forEach((input) => (input.value = ""));
  });