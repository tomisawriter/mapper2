var userLocation;
var map;
var group;

$(document).ready(function (){
	var gl = navigator.geolocation;
	gl.getCurrentPosition(geoSuccess, geoError);

	map = L.map('map');
	group = new L.LayerGroup();
	map.addLayer(group);

	L.tileLayer('http://{s}.tiles.mapbox.com/v3/tom79.j72p9p54/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; [...]',
		maxZoom: 18
	}).addTo(map);

});

function AddMapMarker(id, lat, lng, path, icon) {
	var latLng = new L.LatLng(lat, lng);
	var marker = new L.Marker(latLng, { icon: icon });

	group.addLayer(marker);

	return marker;
}

function CreateIcon(iconPath, className) {
	var icon = L.icon({
		iconUrl: iconPath,
		shadowUrl: null,
		iconSize: new L.Point(44, 55),
		//iconAnchor: new L.Point(16, 41),
		popupAnchor: new L.Point(0, -31),
		className: className
	});

	return icon;
}

// var marker = L.marker([51.5, -0.09]).addTo(map);

// var marker = L.marker([51.5, -0.09]).addTo(map);

// var circle = L.circle([51.499294, -0.127345], 200, {
//     color: 'blue',
//     fillColor: '#f03',
//     fillOpacity: 0.5
// }).addTo(map);

// var polygon = L.polygon([
//     [51.509, -0.08],
//     [51.503, -0.06],
//     [51.51, -0.047]
// ]).addTo(map);

// var polygon = L.polygon([
//     [51.51195, -0.15947],
//     [51.50368, -0.153081],
//     [51.50673, -0.18851]
// ]).addTo(map);

// var popup = L.popup();

// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent("<b>I say, old thing.</b><br>You clicked the map at " + e.latlng.toString())
//         .openOn(map);
// }

// map.on('click', onMapClick);

// marker.bindPopup("<b>Welcome to Buckingham Palace.</b><br>Mind the corgi pies.").openPopup();
// circle.bindPopup("<b>My dear Abbey!</b><br>Westminster Abbey, that is.");
// polygon.bindPopup("<b>Yo yo yo,</b><br>Hyde Park up in da house!");

// var gl = navigator.geolocation;
// gl.getCurrentPosition(geoSuccess, geoError);



function geoSuccess(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	userLocation = [latitude, longitude];
	map.setView(userLocation, 18);

	SearchFoursquare();

	// var marker = L.marker(userLocation).addTo(group);

// 	marker.bindPopup("<b>You are here.</b></br>Smile for the drone.").openPopup();

}

function SearchFoursquare(){
	group.clearLayers();

	var url = "https://api.foursquare.com/v2/venues/search?";
	url += "ll=" + userLocation[0] + "," + userLocation[1];
	url += "&radius=10000";
	url += "&intent=browse";
	url += "&client_id=C2VFPKVCM5XTCBAQMZGPWVOP5220W1NIHYD2WFAG2R2GOGIR";
	url += "&client_secret=GEM1SV2E3GF4BD3R2D5JEBFEOUYQTDXGUQB3OJUTEE3AODOS&v=20130815";

	 // alert(url);

	$.getJSON(url, {},
	function (data) {

		// list = data["response"]["venues"];
		// var limit = list.length;
		// for (i = 0; i <limit; i++){
		// 	var venue = list[i];
		// 	var id = venue["id"];
		// 	var lat = venue["location"]["lat"];
		// 	var lng = venue["location"]["lng"];
		// 	alert(id + '|' + lat + '|' + lng)
		// 	break;

		list = data["response"]["venues"];
		for (i = 0; i < list.length; i++){
			var venue = list[i];
			// alert(JSON.stringify(venue));
			var id = venue["id"];
			var lat = venue["location"]["lat"];
			var lng = venue["location"]["lng"];
			// alert(id + '|' + lat + '|' + lng);

			if (venue["categories"].length == 0)
				continue;
			
			var category = venue["categories"][0];
			var name = venue["name"];
			var catname = category["name"];

			var address = "";
			if (typeof venue["location"]["address"] != "undefined")
				address = venue["location"]["address"];

			var phone = "";
			if (typeof venue["contact"]["phone"] != "undefined")
				phone = venue["contact"]["phone"];

			var webpage = "";
			if (typeof venue["url"] != "undefined")
				webpage = venue["url"];

			var path = category['icon'].prefix + "32" + category['icon'].suffix;
			var newIcon = CreateIcon(path, '');
			var marker = AddMapMarker(id, lat, lng, path, newIcon);

			// var marker = L.marker(userLocation).addTo(group);
			// var html = "<div id='html'>";
			// html += "<class='results'>";
			// html += "<br>" + name + "</br>";
			// html += "<br>" + catname + "</br>";
			// if (address != "")
			// 	html += "<br>" + address + "</br>";
			// if (phone != "")
			// 	html += "<br>" + phone + "</br>";
			// if (webpage != "")
			// 	html += "<br><a href = '" + webpage + "'>Website</a></br>";
			// html += "</div>";

			var html = "<div id='html'>";
			html += "<h2>" + name + "</h2>";
			html += "<div class='catname'>" + catname + "</div>";
			if (address != "")
				html += "<div class='address'>" + address + "</div>";
			if (phone != "")
				html += "<div class='phone'>" + phone + "</div>";
			if (webpage != "")
				html += "<div class='web'><a href = '" + webpage + "'>Website</a></web>";
			// if (webpage != "")
			// 	html += "<br><a href = '" + webpage + "'>Website</a></br>";
			html += "</div>";

			marker.bindPopup(html).openPopup();
		
			// marker.bindPopup(name + "|" + category + "|" + address + "|" + url + "|" + twitter).openPopup();
		}
	});
}


function geoError(err) {
	if (err.code === 0){
		alert("Oops!");
	}
	else if (err.code === 1){
		alert("D’oh!");
	}
	else if (err.code === 2){
		alert("Nerts!");
	}
	else if (err.code === 3) {
		alert("Drat!");
	}
}



// var marker = L.marker([navigator]).addTo(map);

// just commenting
// for github