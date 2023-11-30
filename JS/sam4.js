document.addEventListener('DOMContentLoaded', function () {
    var map;
    var geoJsonLayer;
    var selectedDay = 26;
    var selectedMonth = 3;

    var voyagerBaseMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      });

    var terrainBaseMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
        });
       
    function createMap() {
        map = L.map("map", {
            center: [44, 20],
            zoom: 7,
            layers: [voyagerBaseMap]
            });
      
        var baseMaps = {
            "Voyager": voyagerBaseMap,
            "Terrain": terrainBaseMap
          };
          
        L.control.layers(baseMaps).addTo(map);  

      getData(map, selectedMonth, selectedDay);
    }

    function switchBaseMap() {
        // Check the current base map and switch to the other one
        if (map.hasLayer(voyagerBaseMap)) {
            map.removeLayer(voyagerBaseMap);
            map.addLayer(terrainBaseMap);
        } else {
            map.removeLayer(terrainBaseMap);
            map.addLayer(voyagerBaseMap);
        }
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
                fillOpacity: 0.8,
                radius: 8,
              });
            },
            onEachFeature: function (feature, layer) {
              var popupContent = "Location: " + feature.properties.loc + "<br>Date: " + feature.properties.date
              + "<br>Type:" + feature.properties.type + "<br>Detail:" + feature.properties.descr 
              + "<br>Death:" + feature.properties.deaths;
              layer.bindPopup(popupContent);
            },
          }).addTo(map);
        })
        .catch(function (error) {
          console.log("Error loading GeoJSON data:", error);
        });
    }
  
    function updateSliderValue(value) {
      document.getElementById('day-slider').value = value;
      document.getElementById('day-value').textContent = value;
    }
  
    document.getElementById('month-select').addEventListener('change', function () {
      selectedMonth = parseInt(this.value, 10);
      getData(map, selectedMonth, selectedDay);
    });
  
    document.getElementById('day-slider').addEventListener('input', function () {
      selectedDay = parseInt(this.value, 10);
      updateMap();
    });
  
    function updateMap() {
      getData(map, selectedMonth, selectedDay);
    }
  
    function handlePrevDay() {
      if (selectedDay > 1) {
        selectedDay--;
        updateSliderValue(selectedDay);
        updateMap();
      }
    }
  
    function handleNextDay() {
      if (selectedDay < 31) {
        selectedDay++;
        updateSliderValue(selectedDay);
        updateMap();
      }
    }
  
    document.getElementById('prev-day').addEventListener('click', handlePrevDay);
    document.getElementById('next-day').addEventListener('click', handleNextDay);
  
    createMap();

    document.getElementById('switch-base-map-button').addEventListener('click', switchBaseMap);
  });
  