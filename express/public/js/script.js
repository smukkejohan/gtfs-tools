

$(document).ready(function(){



  var map = L.map('map').setView([55.609842, 13.002763], 13);
  var markerGroup;

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



  map.on('click', function(e){


    //map.setLatLng(e.latlng);
    console.log(e);

      $.getJSON('api/StopsNearby/'+e.latlng.lat+'/'+e.latlng.lng+'/4', function(data) {
    console.log(data);

    if(markerGroup) {
      map.removeLayer(markerGroup);
    }
    var markers = [];
    data.forEach(function(el) {
      markers.push(L.marker([el.stop_lat, el.stop_lon]).bindPopup(el.stop_name));
    });

    markerGroup = L.layerGroup(markers);
    map.addLayer(markerGroup);
    //markerGroup.addToMap(map);

  });


  });


});