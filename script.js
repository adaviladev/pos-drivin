// Inicializar DataTable
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

// Inicializar el mapa Leaflet
var map = L.map("map").setView([0, 0], 2); // Centrado globalmente
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var marker = L.marker([0, 0]).addTo(map); // Posición inicial del marcador

// Datos históricos de puntos de referencia
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

// Definir mapeos para transmisión, tipo de combustible y tipo de auto
const transmissionMapping = {
  a: "Automático",
  m: "Manual",
  cvt: "Transmisión Variable Continua",
};

const fuelTypeMapping = {
  gas: "Gasolina",
  diesel: "Diésel",
  electric: "Eléctrico",
};

const carTypeMapping = {
  sedan: "Sedán",
  suv: "SUV",
  truck: "Camioneta",
  coupe: "Coupé",
  convertible: "Convertible",
};

// Función para obtener datos
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
            `Error HTTP! Estado: ${response.status}, Mensaje: ${err.message}`
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        console.error("No se encontraron datos");
        return;
      }
      // Almacenar datos de vehículos con ubicaciones históricas simuladas
      window.vehicleData = data.map((car, index) => ({
        ...car,
        lat: historicalLandmarks[index % historicalLandmarks.length].lat,
        lng: historicalLandmarks[index % historicalLandmarks.length].lng,
        name: historicalLandmarks[index % historicalLandmarks.length].name,
      }));

      const tableData = window.vehicleData.map((car) => [
        car.class ? carTypeMapping[car.class] || car.class : "N/A", // Aplicar mapeo de tipo de auto
        fuelTypeMapping[car.fuel_type] || car.fuel_type || "N/A", // Aplicar mapeo de tipo de combustible
        car.make || "N/A",
        car.model || "N/A",
        car.year || "N/A",
        transmissionMapping[car.transmission] || car.transmission || "N/A", // Aplicar mapeo de transmisión
        car.city_mpg || "N/A",
        car.highway_mpg || "N/A",
        car.combination_mpg || "N/A",
        car.cylinders || "N/A",
        car.displacement || "N/A",
        car.drive || "N/A",
        // Agregar un identificador si está disponible
        car.id || "N/A", // Suponiendo que cada vehículo tiene un ID único
        // Incluir latitud y longitud simuladas
        car.lat || "N/A",
        car.lng || "N/A",
        car.name || "N/A",
      ]);
      table.clear().rows.add(tableData).draw();
    })
    .catch((error) => console.error("Error:", error));
};

// Obtener datos al cargar la página
fetchData("");

// Añadir evento a las filas de la tabla para actualizar el mapa
$("#drivin tbody").on("click", "tr", function () {
  // Obtener el índice de la fila clicada
  const dataIndex = table.row(this).index();
  const selectedVehicle = window.vehicleData[dataIndex];

  if (selectedVehicle && selectedVehicle.lat && selectedVehicle.lng) {
    // Actualizar el mapa con la ubicación simulada del vehículo seleccionado
    map.setView([selectedVehicle.lat, selectedVehicle.lng], 10);
    marker
      .setLatLng([selectedVehicle.lat, selectedVehicle.lng])
      .bindPopup(`Ubicación del vehículo`)
      .openPopup();

    // Desplazar el contenedor del mapa para hacerlo visible
    document.getElementById("map").scrollIntoView({ behavior: "smooth" });
  } else {
    console.error(
      "No hay datos de ubicación disponibles para el vehículo seleccionado."
    );
  }
});

// Actualizar el modelo y obtener nuevos datos cuando el usuario escribe en el cuadro de búsqueda
$("#dt-search-0").on("input", function () {
  const model = $(this).val();
  fetchData(model);
});

// Modal
// Abrir el modal
document.getElementById("openModalBtn").onclick = function () {
  document.getElementById("filterModal").style.display = "block";
};

// Cerrar el modal cuando el usuario haga clic en la 'X'
document.getElementsByClassName("close")[0].onclick = function () {
  document.getElementById("filterModal").style.display = "none";
};

// Cerrar el modal si el usuario hace clic fuera del modal
window.onclick = function (event) {
  if (event.target == document.getElementById("filterModal")) {
    document.getElementById("filterModal").style.display = "none";
  }
};

// Manejar el envío del formulario de filtro
document.getElementById("filterForm").onsubmit = function (event) {
  event.preventDefault();
  // Obtener valores de filtro
  let carType = document.getElementById("carType").value;
  let make = document.getElementById("make").value;
  let model = document.getElementById("model").value;
  let year = document.getElementById("year").value;
  let transmission = document.getElementById("transmission").value;
  let mpgRange = document.getElementById("mpgRange").value;

  // Filtrar datos con los valores obtenidos
  filterData(carType, make, model, year, transmission, mpgRange);

  // Cerrar el modal después de aplicar los filtros
  document.getElementById("filterModal").style.display = "none";
};

const filterData = (carType, make, model, year, transmission, mpgRange) => {
  // Construir la URL de la API con los filtros
  let apiUrl = `https://api.api-ninjas.com/v1/cars?limit=100`;

  if (carType) apiUrl += `&class=${carType}`;
  if (make) apiUrl += `&make=${make}`;
  if (model) apiUrl += `&model=${model}`;
  if (year) apiUrl += `&year=${year}`;
  if (transmission) apiUrl += `&transmission=${transmission}`;
  // Asumir que mpgRange es una cadena en el formato 'min-max'
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
            `Error HTTP! Estado: ${response.status}, Mensaje: ${err.message}`
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        console.error("No se encontraron datos");
        return;
      }
      // Almacenar datos de vehículos con ubicaciones históricas simuladas
      window.vehicleData = data.map((car, index) => ({
        ...car,
        lat: historicalLandmarks[index % historicalLandmarks.length].lat,
        lng: historicalLandmarks[index % historicalLandmarks.length].lng,
        name: historicalLandmarks[index % historicalLandmarks.length].name,
      }));

      const tableData = window.vehicleData.map((car) => [
        car.class ? carTypeMapping[car.class] || car.class : "N/A", // Aplicar mapeo de tipo de auto
        fuelTypeMapping[car.fuel_type] || car.fuel_type || "N/A", // Aplicar mapeo de tipo de combustible
        car.make || "N/A",
        car.model || "N/A",
        car.year || "N/A",
        transmissionMapping[car.transmission] || car.transmission || "N/A", // Aplicar mapeo de transmisión
        car.city_mpg || "N/A",
        car.highway_mpg || "N/A",
        car.combination_mpg || "N/A",
        car.cylinders || "N/A",
        car.displacement || "N/A",
        car.drive || "N/A",
        // Agregar un identificador si está disponible
        car.id || "N/A", // Suponiendo que cada vehículo tiene un ID único
        // Incluir latitud y longitud simuladas
        car.lat || "N/A",
        car.lng || "N/A",
        car.name || "N/A",
      ]);
      table.clear().rows.add(tableData).draw();
    })
    .catch((error) => console.error("Error:", error));
};
