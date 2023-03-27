
var earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// Create a map object.
var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 2.5
});

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);



fetch(earthquakeData)
  .then((response) => response.json())
  .then(function (jsonData) {

    var color;
    var size;
    var coordinates = []
    var colorList = ['#DE5004', '#EB8000', '#EBAB00', '#E7EB00', '#A7EB00', '#02F736'];


    function getColor(earthquakeDepth) {
      return earthquakeDepth > 90 ? colorList[0] :
        earthquakeDepth > 70 ? colorList[1] :
          earthquakeDepth > 50 ? colorList[2] :
            earthquakeDepth > 30 ? colorList[3] :
              earthquakeDepth > 10 ? colorList[4] :
                colorList[5];
    }



    //console.log('features[0]:',json.features[0].geometry.coordinates[2])
    for (var i = 0; i < jsonData.features.length; i++) {
      color = getColor(Math.floor(jsonData.features[i].geometry.coordinates[2]));
      size = jsonData.features[i].properties.mag;

      //*********************
      //update coordinates
      coordinates = [jsonData.features[i].geometry.coordinates[1],
      jsonData.features[i].geometry.coordinates[0]];

      L.circle(coordinates, {
        fillOpacity: 0.6,
        color: 'white',
        fillColor: color,
        weight: 1,
        // Adjust the radius.
        radius: size * 35000,
      }).bindPopup(`<h5>${jsonData.features[i].properties.place}</h5><hr>Magnitude:${jsonData.features[i].properties.mag}`).addTo(myMap);

      //***********************
    }//for

    //######################
    // Set up the legend.
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var limits = ['90+', '70-90', '50-70', '30-50', '10-30', '0-10'];
      var legendInfo = "<h4>Earthquake Depth</h4>";

      div.innerHTML = legendInfo;
      labels = [];
      limits.forEach(function (limit, index) {
        labels.push("<div style=\"background-color: " + colorList[index] + "\">" + limit + "</div>");
      });

      div.innerHTML = legendInfo;
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };

    // Adding the legend to the map
    legend.addTo(myMap);

    //######################

  });


