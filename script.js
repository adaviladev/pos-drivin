let table = $('#drivin').DataTable({
    paging: true,
    pageLength: 20,
    lengthChange: false,
    ordering: true,
    searching: true,
});

const fetchData = (model = '') => {
    const apiUrl = `https://api.api-ninjas.com/v1/cars?limit=100&model=${model}`;

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'X-Api-Key': '+Q7oY2WzWPvMxAYRfCVsog==L5nkF9CS3pf6Vkqr'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${err.message}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Data received:', data);
        if (!Array.isArray(data) || data.length === 0) {
            console.error('No data found');
            return;
        }

        // Mapea los datos a la estructura esperada por DataTables
        const tableData = data.map(car => [
            car.class || 'N/A',
            car.fuel_type || 'N/A',
            car.make || 'N/A',
            car.model || 'N/A',
            car.year || 'N/A',
            car.transmission || 'N/A',
            car.city_mpg || 'N/A',
            car.highway_mpg || 'N/A',
            car.combination_mpg || 'N/A',
            car.cylinders || 'N/A',
            car.displacement || 'N/A',
            car.drive || 'N/A'
        ]);

        table.clear().rows.add(tableData).draw();
    })
    .catch(error => console.error('Error:', error));
};

// Fetch data on page load with default model
fetchData('');

// Update the model and fetch new data when the user types in the search box
$('#dt-search-0').on('input', function() {
    const model = $(this).val();
    fetchData(model);
});

// Modal

// Abre el modal
document.getElementById('openModalBtn').onclick = function() {
    document.getElementById('filterModal').style.display = 'block';
}

// Cierra el modal cuando el usuario hace clic en la 'X'
document.getElementsByClassName('close')[0].onclick = function() {
    document.getElementById('filterModal').style.display = 'none';
}

// Cierra el modal si el usuario hace clic fuera del modal
window.onclick = function(event) {
    if (event.target == document.getElementById('filterModal')) {
        document.getElementById('filterModal').style.display = 'none';
    }
}

// Manejo del formulario de filtros
document.getElementById('filterForm').onsubmit = function(event) {
    event.preventDefault();
    // Obtener valores de los filtros
    let carType = document.getElementById('carType').value;
    let make = document.getElementById('make').value;
    let model = document.getElementById('model').value;
    let year = document.getElementById('year').value;
    let transmission = document.getElementById('transmission').value;
    let mpgRange = document.getElementById('mpgRange').value;

    // Filtrar datos con los valores obtenidos
    filterData(carType, make, model, year, transmission, mpgRange);

    // Cerrar el modal después de aplicar los filtros
    document.getElementById('filterModal').style.display = 'none';
}

const filterData = (carType, make, model, year, transmission, mpgRange) => {
    // Construir la URL de la API con los filtros
    let apiUrl = `https://api.api-ninjas.com/v1/cars?limit=100`;

    if (carType) apiUrl += `&class=${carType}`;
    if (make) apiUrl += `&make=${make}`;
    if (model) apiUrl += `&model=${model}`;
    if (year) apiUrl += `&year=${year}`;
    if (transmission) apiUrl += `&transmission=${transmission}`;
    // Asumimos mpgRange es un string con el formato 'min-max'
    if (mpgRange) {
        const [minMpg, maxMpg] = mpgRange.split('-');
        apiUrl += `&min_combined_mpg=${minMpg}&max_combined_mpg=${maxMpg}`;
    }

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'X-Api-Key': '+Q7oY2WzWPvMxAYRfCVsog==L5nkF9CS3pf6Vkqr'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${err.message}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Filtered data received:', data);
        if (!Array.isArray(data) || data.length === 0) {
            console.error('No data found for filters');
            return;
        }

        // Mapea los datos a la estructura esperada por DataTables
        const tableData = data.map(car => [
            car.class || 'N/A',
            car.fuel_type || 'N/A',
            car.make || 'N/A',
            car.model || 'N/A',
            car.year || 'N/A',
            car.transmission || 'N/A',
            car.city_mpg || 'N/A',
            car.highway_mpg || 'N/A',
            car.combination_mpg || 'N/A',
            car.cylinders || 'N/A',
            car.displacement || 'N/A',
            car.drive || 'N/A'
        ]);

        table.clear().rows.add(tableData).draw();
    })
    .catch(error => console.error('Error:', error));
};
