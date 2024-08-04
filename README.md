    # Gestor de vehículos Driv.in App

Gestor de vehículos con filtros avanzados y ubicación en el mapa diseñado para optimizar la administración y el seguimiento de los vehículos de una flota.

## Descripción

**Driv.in App** es una aplicación para gestionar vehículos que permite visualizar los vehículos registrados por los clientes a través de una interfaz intuitiva. Los usuarios pueden filtrar los vehículos según diferentes parámetros y ordenarlos según sus necesidades, además de ver su ubicación actual en un mapa interactivo.

## Características

- **Búsqueda de vehículos**: Filtros para tipo de auto, marca, modelo, año, tipo de transmisión, rendimiento mínimo (km/l), rendimiento máximo (km/l)
- **Tabla de datos**: Ordenación ascendente y descendente y paginación de los datos encontrados.
- **Visualización en el mapa**: Muestra la ubicación del vehículo en un mapa interactivo.

## Tecnologías utilizadas

- HTML, CSS, Bootstrap 5, JavaScript, DataTables, Leaflet, Markdown

## Versión publicada

- Visita [Driv.in App](https://drivinapp.netlify.app/)

### Cómo utilizar

Para buscar vehículos:

1. Haz clic en el botón **Buscar Vehículos**.
2. Completa los filtros según tus necesidades.
3. Haz clic en **Aplicar Filtros** para ver los resultados en la tabla.
4. Haz clic en una fila de la tabla para ver la ubicación del vehículo en el mapa.
5. Haz clic en el símbolo "X" o fuera del mapa para volver a la tabla.

### Nota sobre el término "Consumo"

La tabla de resultados incluye columnas denominadas "Rendimiento en Ciudad", "Rendimiento en Carretera" y "Rendimiento Mixto". Aunque en la prueba se solicitó usar el término "Consumo", consideré más apropiado utilizar el término "Rendimiento" para mejorar la experiencia del usuario. En la API utilizada, los datos de consumo se expresan como rendimiento en miles per gallon (mpg), que fueron convertidos al estándar latinoamericano (km/l) utilizando la fórmula *mpg * 0.425144*, redondeado a dos decimales. Para los fines de esta aplicación, "consumo" y "rendimiento" se consideran equivalentes.

## Contacto

Para preguntas, puedes contactarme en [alvarodaviladev@gmail.com](mailto:alvarodaviladev@gmail.com).