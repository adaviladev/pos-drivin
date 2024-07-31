// $(document).ready( function () {
//     $('#drivin').DataTable();
// } );

// $(document).ready(function() {
//     const model = 'camry';
//     const apiUrl = `https://api.api-ninjas.com/v1/cars?model=${model}`;

//     fetch(apiUrl, {
//         method: 'GET',
//         headers: {
//             'X-Api-Key': '+Q7oY2WzWPvMxAYRfCVsog==L5nkF9CS3pf6Vkqr'
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         // Asume que 'data' es un array de objetos
//         const tableData = data.map(car => [
//             car.car_type,          // Tipo de Auto
//             car.fuel_type,         // Tipo de Combustible
//             car.make,              // Marca
//             car.model,             // Modelo
//             car.year,              // Año
//             car.transmission,      // Tipo de Transmisión
//             car.city_mpg,          // Consumo en Ciudad
//             car.highway_mpg,       // Consumo en Carretera
//             car.combined_mpg       // Consumo Mixto
//         ]);

//         $('#drivin').DataTable({
//             data: tableData,
//             columns: [
//                 { title: "Tipo de Auto" },
//                 { title: "Tipo de Combustible" },
//                 { title: "Marca" },
//                 { title: "Modelo" },
//                 { title: "Año" },
//                 { title: "Tipo de Transmisión" },
//                 { title: "Consumo en Ciudad" },
//                 { title: "Consumo en Carretera" },
//                 { title: "Consumo Mixto" }
//             ]
//         });
//     })
//     .catch(error => console.error('Error:', error));
// });


let table = $('#drivin').DataTable({
    paging: true,
    pageLength: 20,
    lengthChange: false,
    ordering: true,
    searching: true,
});

const fetchData = (model) => {
    const apiUrl = `https://api.api-ninjas.com/v1/cars?limit=100&model=${model}`;

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'X-Api-Key': '+Q7oY2WzWPvMxAYRfCVsog==L5nkF9CS3pf6Vkqr' // Reemplaza con tu clave de API
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
fetchData('camry');

// Update the model and fetch new data when the user types in the search box
$('#dt-search-0').on('input', function() {
    const model = $(this).val();
    fetchData(model);
});
