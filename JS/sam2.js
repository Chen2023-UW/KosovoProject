// JavaScript (sam2.js)
document.addEventListener('DOMContentLoaded', function () {
  var map;
  var geoJsonLayer;

  function createMap() {
    map = L.map("map", {
      center: [44, 20],
      zoom: 7,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Call the getData function with a default filter of March 1
    getData(map, 3, 1);
  }

  function getData(map, selectedMonth, selectedDay) {
    fetch('Data/strike2.geojson')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Filter the GeoJSON data based on the selected month and day
        var filteredData = data.features.filter(function (feature) {
          var dateParts = feature.properties.date.split('/');
          var featureMonth = parseInt(dateParts[0], 10);
          var featureDay = parseInt(dateParts[1], 10);
          return featureMonth === selectedMonth && featureDay === selectedDay;
        });

        // Clear existing markers
        if (geoJsonLayer) {
          geoJsonLayer.clearLayers();
        }

        // Add markers for the filtered data
        geoJsonLayer = L.geoJSON(filteredData, {
          pointToLayer: function (feature, latlng) {
            // Create a default circle marker
            return L.circleMarker(latlng, {
              fillColor: "#ecebe6",
              color: "#000",
              weight: 1,
              opacity: 0.8,
              fillOpacity: 0.6,
              radius: 5, // Set the desired fixed radius here
            });
          },
          onEachFeature: function (feature, layer) {
            var popupContent = "Location: " + feature.properties.loc + "<br>Date: " + feature.properties.date;
            layer.bindPopup(popupContent);
          },
        }).addTo(map);
      })
      .catch(function (error) {
        console.log("Error loading GeoJSON data:", error);
      });
  }

  // Event listener for month selection
  document.getElementById('month-select').addEventListener('change', function () {
    var selectedMonth = parseInt(this.value, 10);
    var selectedDay = parseInt(document.getElementById('day-slider').value, 10);
    getData(map, selectedMonth, selectedDay);
  });

  // Event listener for day slider
  document.getElementById('day-slider').addEventListener('input', function () {
    var selectedMonth = parseInt(document.getElementById('month-select').value, 10);
    var selectedDay = parseInt(this.value, 10);
    getData(map, selectedMonth, selectedDay);
  });

  createMap();
});
