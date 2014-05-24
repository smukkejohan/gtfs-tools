

$(document).ready(function(){


    var map = L.map('map').setView([55.609842, 13.002763], 13);
    var markerGroup;
    var searchLatLng;
    var searchRadius = 1.5;

    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('click', function(e){
        searchLatLng = e.latlng;
        updateMap();
    });



    $( "#slider" ).slider({
        min: 0.0,
        max: 20,
        value: 1.5,
        step: 0.1,
        slide: function(event, ui){
            searchRadius = ui.value;
            updateMap();
        }
    });




    var updateMap = function(){
        $.getJSON('api/StopsNearby/'+searchLatLng.lat+'/'+searchLatLng.lng+'/'+searchRadius, function(data) {
            if(markerGroup) {
                map.removeLayer(markerGroup);
            }
            var markers = [];
            data.forEach(function(el) {
                markers.push(L.marker([el.stop_lat, el.stop_lon]).bindPopup(el.stop_name));
            });

            markerGroup = L.layerGroup(markers);

            map.addLayer(markerGroup);
        });

    }
});