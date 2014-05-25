

$(document).ready(function(){


    var map = L.map('map').setView([55.609842, 13.002763], 13);
    var markerGroup;
    var searchLatLng;
    var searchRadius = 1.5;

    // add an OpenStreetMap tile layer
//    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    //L.tileLayer('http://a.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
    L.tileLayer('http://a.tile.stamen.com/toner/{z}/{x}/{y}.png', {

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




    var updateMap = function() {
        $.getJSON('api/StopsNearby/' + searchLatLng.lat + '/' + searchLatLng.lng + '/' + searchRadius, function (data) {
            if (markerGroup) {
                map.removeLayer(markerGroup);
            }
            var markers = [];
            data.forEach(function (el) {
                markers.push(L.circleMarker([el.stop_lat, el.stop_lon], {color:'blue', radius:5}).bindPopup(el.stop_name));
            });

            markerGroup = L.layerGroup(markers);

            map.addLayer(markerGroup);
        });

        $.getJSON('api/routesNearby/' + searchLatLng.lat + '/' + searchLatLng.lng + '/' + searchRadius, function (data) {

            //console.log(data)

            for(var i=0;i<data.length;i++){
                $.getJSON('api/stops/'+data[i].agency_key+'/' + data[i].route_id, function (stops) {
                    //console.log(stops);
                    var latlngs = [];
                    for(var u=0;u<stops.length;u++){
                        latlngs.push([stops[u].stop_lat, stops[u].stop_lon]);
                        L.circleMarker([stops[u].stop_lat, stops[u].stop_lon], {color:'blue', radius:5}).addTo(map);
                    }
                    //console.log(latlngs)
                    var polyline = L.polyline(latlngs, {color: 'rgb(220, 0, 0)', weight: 2, opacity:0.8, 'stroke-linecap':'round', 'stroke-linejoin':'round'}).addTo(map);


                 //   map.fitBounds(polyline.getBounds());

                });
            }
        });
    };
});