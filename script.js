// Function to parse km/l values and return them as floats for sorting
const parseKml = (data, type, row) => {
  if (type === "sort" || type === "type") {
    return parseFloat(data.split(" ")[0]);
  }
  return data;
};

// Initialize the DataTable for the HTML element with the ID 'drivin' with config options
let table = $("#drivin").DataTable({
  paging: true,
  pageLength: 20,
  lengthChange: false,
  ordering: true,
  searching: false,
  // responsive: true,
  columnDefs: [
    {
      targets: [6, 7, 8],
      render: parseKml,
      type: "num",
    }, // Specify numeric type for consumption columns
  ],
});

// Initialize a Leaflet map and set its initial view
var map = L.map("map").setView([51.505, -0.09], 13);

// Add a tile layer to the map using OpenStreetMap tiles
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map); // Add the tile layer to the map

// Create a marker at the initial position of latitude 0 and longitude 0
var marker = L.marker([51.5, -0.09]).addTo(map); // Add the marker to the map at the initial position

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

// Function to format transmission type
const formatTransmission = (transmission) => {
  switch (transmission) {
    case "a":
      return "Automática";
    case "m":
      return "Manual";
    default:
      return "N/A";
  }
};

// Function to format fuel type
const formatFuelType = (fuelType) => {
  switch (fuelType) {
    case "gas":
      return "Gasolina";
    case "diesel":
      return "Diésel";
    case "electric":
      return "Eléctrico";
    case "hybrid":
      return "Híbrido";
    default:
      return "N/A";
  }
};

// Function to format class type
const formatClass = (carClass) => {
  switch (carClass) {
    case "large car":
      return "Vehículo grande";
    case "midsize car":
      return "Vehículo mediano";
    case "midsize-large station wagon":
      return "Furgoneta mediana-grande";
    case "small pickup truck":
      return "Camioneta pequeña";
    case "small station wagon":
      return "Furgoneta pequeña";
    case "standard pickup truck":
      return "Camioneta estándar";
    case "compact car":
      return "Vehículo compacto";
    case "subcompact car":
      return "Vehículo subcompacto";
    case "special purpose vehicle":
      return "Vehículo de propósito especial";
    case "two seater":
      return "Biplaza";
    case "minicompact car":
      return "Vehículo mini compacto";
    case "sport utility vehicle":
      return "Vehículo utilitario deportivo (SUV)";
    case "van":
      return "Furgoneta";
    default:
      return "N/A";
  }
};

// Function to convert mpg to km/l
const convertMpgToKml = (mpg) => {
  return `${(mpg * 0.425144).toFixed(2)} km/l`;
};

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

    transmission: formatTransmission(car.transmission),
    fuel_type: formatFuelType(car.fuel_type),
    class: formatClass(car.class),
    
    city_kml: convertMpgToKml(car.city_mpg),
    highway_kml: convertMpgToKml(car.highway_mpg),
    combination_kml: convertMpgToKml(car.combination_mpg),
  }));

  // Format the vehicle data for display in the DataTable
  const tableData = window.vehicleData.map((car) => [
    car.class || "N/A",
    car.fuel_type || "N/A",
    car.make.toUpperCase() || "N/A",
    car.model.toUpperCase() || "N/A",
    car.year || "N/A",
    car.transmission || "N/A",
    car.city_kml || "N/A",
    car.highway_kml || "N/A",
    car.combination_kml || "N/A",
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
    .then((data) => {
      console.log(data); // Añade esta línea para ver los datos de la API en la consola
      processVehicleData(data);
    })
    .catch((error) => console.error("Error:", error));
};

// Function to fetch data with filters
const filterData = (
  carType,
  make,
  model,
  year,
  transmission,
  minConsumption,
  maxConsumption
) => {
  // Build the API URL with filters
  let apiUrl = `https://api.api-ninjas.com/v1/cars?limit=50`;

  if (carType) apiUrl += `&class=${carType}`;
  if (make) apiUrl += `&make=${make}`;
  if (model) apiUrl += `&model=${model}`;
  if (year) apiUrl += `&year=${year}`;
  if (transmission) apiUrl += `&transmission=${transmission}`;
  if (minConsumption && !isNaN(minConsumption))
    apiUrl += `&min_comb_mpg=${(minConsumption / 0.425144).toFixed(2)}`; // Convert km/l to mpg
  if (maxConsumption && !isNaN(maxConsumption))
    apiUrl += `&max_comb_mpg=${(maxConsumption / 0.425144).toFixed(2)}`; // Convert km/l to mpg

  fetchData(apiUrl);
  console.log(apiUrl);
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
  let minConsumption = document.getElementById("minConsumption").value;
  let maxConsumption = document.getElementById("maxConsumption").value;

  // Fetch filtered data
  filterData(
    carType,
    make,
    model,
    year,
    transmission,
    minConsumption,
    maxConsumption
  );

  // Close the modal after applying filters
  document.getElementById("filterModal").style.display = "none";
};

// Function to update the content of the vehicle info div
const updateVehicleInfo = (vehicle) => {
  document.getElementById("vehicle-make").textContent =
    vehicle.make.toUpperCase() || "N/A";
  document.getElementById("vehicle-model").textContent =
    vehicle.model.toUpperCase() || "N/A";
  document.getElementById("vehicle-year").textContent = vehicle.year || "N/A";
};

// Add event listener to table rows for map updates
$("#drivin tbody").on("click", "tr", function () {
  const dataIndex = table.row(this).index();
  const selectedVehicle = window.vehicleData[dataIndex];

  if (selectedVehicle && selectedVehicle.lat && selectedVehicle.lng) {
    // Update the vehicle info in the div
    updateVehicleInfo(selectedVehicle);

    document.getElementById("mapModal").style.display = "block"; // Muestra el modal primero
    setTimeout(() => {
      map.invalidateSize(); // Asegúrate de que Leaflet recalcula el tamaño del mapa
      map.setView([selectedVehicle.lat, selectedVehicle.lng], 10);
      marker
        .setLatLng([selectedVehicle.lat, selectedVehicle.lng])
        .bindPopup(`Ubicación del vehículo`)
        .openPopup();
    }, 100); // Agrega un pequeño retraso para asegurar que el modal se ha mostrado completamente
  } else {
    console.error(
      "No existen datos de ubicación para el vehículo seleccionado."
    );
  }
});

// Modals
// Open the Filter Modal
document.getElementById("openModalBtn").onclick = function () {
  document.getElementById("filterModal").style.display = "block";
};

// Close the Modals when the user clicks on the 'X'
document.getElementsByClassName("close-filter-modal")[0].onclick = function () {
  document.getElementById("filterModal").style.display = "none";
};

document.getElementsByClassName("close-map-modal")[0].onclick = function () {
  document.getElementById("mapModal").style.display = "none";
};

// Close the Modals if the user clicks outside the modal
window.onclick = function (event) {
  if (event.target == document.getElementById("filterModal")) {
    document.getElementById("filterModal").style.display = "none";
  }
  if (event.target == document.getElementById("mapModal")) {
    document.getElementById("mapModal").style.display = "none";
  }
};

// Add event listener for the clear filters button
document
  .querySelector(".clear-filter-btn")
  .addEventListener("click", function () {
    // Select all input fields in the filter form
    const inputs = document.querySelectorAll("#filterForm .form-control");

    // Clear the value of each input field
    inputs.forEach((input) => (input.value = ""));
  });

// Event listener for filter form submission
document.getElementById("filterForm").onsubmit = function (event) {
  event.preventDefault();

  // Get filter values
  let carType = document.getElementById("carType").value;
  let make = document.getElementById("make").value;
  let model = document.getElementById("model").value;
  let year = document.getElementById("year").value;
  let transmission = document.getElementById("transmission").value;
  let minConsumption = document.getElementById("minConsumption").value;
  let maxConsumption = document.getElementById("maxConsumption").value;

  // Check if the year is a valid four-digit number within the specified range
  if (year && (year < 1984 || year > 2025)) {
    alert("Por favor ingrese un año válido entre 1984 y 2025.");
    return;
  }

  // Fetch filtered data
  filterData(
    carType,
    make,
    model,
    year,
    transmission,
    minConsumption,
    maxConsumption
  );

  // Close the modal after applying filters
  document.getElementById("filterModal").style.display = "none";
};

// Event listener to restrict input to 4 digits
document.getElementById("year").addEventListener("input", function (event) {
  // Ensure the value is numeric and has at most 4 characters
  if (this.value.length > 4) {
    this.value = this.value.slice(0, 4);
  }
  // Remove any non-numeric characters
  this.value = this.value.replace(/\D/g, "");
});

const maxConsumptionSlider = document.querySelector("#maxConsumption");
const maxConsumptionSliderOutput = document.querySelector(
  ".maxConsumptionOutput"
);

maxConsumptionSliderOutput.textContent = maxConsumptionSlider.value;

maxConsumptionSlider.addEventListener("input", function () {
  maxConsumptionSliderOutput.textContent = maxConsumptionSlider.value;
});

const minConsumptionSlider = document.querySelector("#minConsumption");
const minConsumptionSliderOutput = document.querySelector(
  ".minConsumptionOutput"
);

minConsumptionSliderOutput.textContent = minConsumptionSlider.value;

minConsumptionSlider.addEventListener("input", function () {
  minConsumptionSliderOutput.textContent = minConsumptionSlider.value;
});
