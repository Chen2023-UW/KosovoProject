
var map;
var dataStats = {};

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

  getData(map);
}

function getData(){
    fetch('Data/strike2.geojson')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        L.geoJSON(data, {
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
                var popupContent = "<p><b>Location:</b> " + feature.properties.loc + "</p>";
                popupContent += "<p><b>Date:</b> " + feature.properties.date + "</p>";
                
                layer.bindPopup(popupContent);
            }
        }).addTo(map);
    })
    .catch(function(error) {
        console.log("Error loading GeoJSON data:", error);
    });
}

createMap();
