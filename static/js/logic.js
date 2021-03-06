var base_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerSize(magnitude) {
    return magnitude * 4;
};

var earthquakes = new L.LayerGroup();

d3.json(base_url, function (geoJson) {
    console.log(geoJson)
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJson, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJson.properties.mag) });
        },

        style: function (Earthquake) {
            Earthquake_depth = Earthquake.geometry.coordinates[2]
            return {
                fillColor: Color(Earthquake_depth),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});



function Color(depth) {
    if (depth > 90) {
        return 'red'
    } else if (depth > 70) {
        return 'darkorange'
    } else if (depth > 50) {
        return 'orange'
    } else if (depth > 30) {
        return 'yellow'
    } else if (depth > 10) {
        return 'darkgreen'
    } else {
        return 'lightgreen'
    }
};

function createMap() {

    var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });


    // Define Variables for Tile Layers
    var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });


    var baseLayers = {
        "Street": streetMap,
        "Light": lightMap,
        "Satellite": satelliteMap
    };

    var overlays = {
        "Earthquakes": earthquakes,
    };

    var myMap = L.map('mapid', {
        center: [37.09, -95.71],
        zoom: 5,
    
        layers: [streetMap, earthquakes]
    });

    L.control.layers(baseLayers, overlays).addTo(myMap);
    
    // Set Up Legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"), 
        depthLevels = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3>Magnitude</h3>"

        for (var i = 0; i < depthLevels.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + Color(depthLevels[i] + 1) + '"></i> ' +
                depthLevels[i] + (depthLevels[i + 1] ? '&ndash;' + depthLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };
    // Add Legend to the Map
    legend.addTo(myMap);
}
