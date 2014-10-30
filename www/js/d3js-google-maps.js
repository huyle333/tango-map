$("#towhom").hide();

var polyline;
var mapOptions = {
	center: new google.maps.LatLng(42.3581, -71.0636),
	zoom: 10
};

var map = new google.maps.Map(document.getElementById("map-canvas"),
mapOptions);


/*
var Score = Parse.Object.extend("SensorData");
var query = new Parse.Query(Score);
query.get("OQmWwMYWec", {
  success: function(level) {
  	console.log(level.get("Humidity"));
    // The object was retrieved successfully.
  },
  error: function(object, error) {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and description.
  }
});
*/

var temperatureMap = {};
var humidityMap = {};
var noiseMap = {};
var carbonmonoxideMap = {};
var methaneMap = {};

var Score = Parse.Object.extend("SensorData");
var query = new Parse.Query(Score);
query.equalTo(true);
query.find({
  success: function(levels) {
  	for (var i = 0; i < levels.length; i++) {
      temperatureMap[i] = {
      	center: new google.maps.LatLng(levels[i].get("Latitude"), levels[i].get("Longitude")),
      	population: levels[i].get("Temperature")
      };
    }
    for (var i = 0; i < levels.length; i++) {
      humidityMap[i] = {
      	center: new google.maps.LatLng(levels[i].get("Latitude"), levels[i].get("Longitude")),
      	population: levels[i].get("Humidity")
      };
    }
    for (var i = 0; i < levels.length; i++) {
      noiseMap[i] = {
      	center: new google.maps.LatLng(levels[i].get("Latitude"), levels[i].get("Longitude")),
      	// population: levels[i].get("NoiseLevel")
      	population: 100
      };
    }
    for (var i = 0; i < levels.length; i++) {
      methaneMap[i] = {
      	center: new google.maps.LatLng(levels[i].get("Latitude"), levels[i].get("Longitude")),
      	population: levels[i].get("Methane")
      };
    }
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
});

/*
temperatureMap[0] = {
	center: new google.maps.LatLng(42.3581, -71.0636),
	population: 100000
};
*/

var temperatureCircle = {};
var humidityCircle = {};
var noiseCircle = {};
var carbonmonoxideCircle = {};
var methaneCircle = {};

function initialize() {
	infowindow = new google.maps.InfoWindow;

	var airPollutionControl = new google.maps.LatLng(42.360200, -71.057951);
	var unitedWasteManagement = new google.maps.LatLng(42.329124, -71.073886);
	var environmentProtection = new google.maps.LatLng(42.355801, -71.061182);

  	var airPollutionControlMarkerContentString = '<div id="content" style="width:400px; height:300px;">'+
	'<a id="embedly-link" class=\"embedly-card\" href=\"http://www.cityofboston.gov/environment/airpollution\">Boston Air Pollution Control</a>'+
	'</div>'+'<button class = "btn btn-success" onclick = "donate()">'+'Donate to the Boston Air Pollution Control</button>';

	var unitedWasteManagementMarkerContentString = '<div id="content" style="width:400px; height:300px;">'+
	'<a id="embedly-link" class=\"embedly-card\" href=\"http://www.unitedwastemanagement.com/boston-ma\">Boston United Waste Management</a>'+
	'</div>'+'<button class = "btn btn-success" onclick = "donate()">'+'Donate to the Boston United Waste Management</button>';

	var environmentProtectionMarkerContentString = '<div id="content" style="width:400px; height:300px;">'+
	'<a id="embedly-link" class=\"embedly-card\" href=\"http://www.mass.gov/eea/waste-mgnt-recycling\">MA Department of Environmental Protection</a>'+
	'</div>'+'<br><button class = "btn btn-success" onclick = "donate()">'+'Donate to the MA Department of Environmental Protection</button>';

  	var airPollutionControlMarker = new google.maps.Marker({
		icon: ('http://maps.google.com/mapfiles/kml/pal2/icon4.png'),
		position: airPollutionControl,
		map: map,
		title: 'Boston Air Pollution Control'
	});

	var unitedWasteManagementMarker = new google.maps.Marker({
		icon: ('http://maps.google.com/mapfiles/kml/pal2/icon4.png'),
		position: unitedWasteManagement,
		map: map,
		title: 'Boston United Waste Management'
	});

	var environmentProtectionMarker = new google.maps.Marker({
		icon: ('http://maps.google.com/mapfiles/kml/pal2/icon4.png'),
		position: environmentProtection,
		map: map,
		title: 'Department of Environmental Protection'
	});

	// Add the event listeners to inforwindow
	google.maps.event.addListener(infowindow, 'domready', function () {
		var embedlyLink = document.getElementById('embedly-link');
		embedly.card(embedlyLink);
	});

	google.maps.event.addListener(airPollutionControlMarker, 'click', function() {
		infowindow.setContent(airPollutionControlMarkerContentString);
		infowindow.open(map, airPollutionControlMarker);
	});

	google.maps.event.addListener(unitedWasteManagementMarker, 'click', function() {
		infowindow.setContent(unitedWasteManagementMarkerContentString);
		infowindow.open(map, unitedWasteManagementMarker);
	});

	google.maps.event.addListener(environmentProtectionMarker, 'click', function() {
		infowindow.setContent(environmentProtectionMarkerContentString);
		infowindow.open(map, environmentProtectionMarker);
	});

	/*
	polyline = new google.maps.Polyline( {
		map: map
	});
	*/

	d3init();
}

function donate(){
	$("#towhom").hide();
	$("#towhom").show("slow");
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function showTemperatureOverlays(){
	if(temperatureMap){
	    for (var i = 0; i < Object.size(temperatureMap); i++) {
		    var populationOptions = {
		    strokeColor: getColor(1/20),
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    //fillColor: '#FF0000',
		    fillColor: getColor(1/20),
		    fillOpacity: 0.35,
		    map: map,
		    center: temperatureMap[i].center,
		    radius: Math.sqrt(temperatureMap[i].population) * 5
			};
		// Add the circle for this city to the map.
		temperatureCircle[i] = new google.maps.Circle(populationOptions);
		}
    }
}

function clearTemperatureOverlays(){
	for (var i = 0; i < Object.size(temperatureCircle); i++){
		temperatureCircle[i].setMap(null);
	}
}

function showHumidityOverlays(){
	if(humidityMap){
	     for (var i = 0; i < Object.size(humidityMap); i++) {
		    var populationOptions = {
		    strokeColor: getColor(1/20),
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    //fillColor: '#FF0000',
		    fillColor: getColor(1/20),
		    fillOpacity: 0.35,
		    map: map,
		    center: humidityMap[i].center,
		    radius: Math.sqrt(humidityMap[i].population) * 5
		};
		// Add the circle for this city to the map.
		humidityCircle[i] = new google.maps.Circle(populationOptions);
		}
    }
}

function clearHumidityOverlays(){
	for (var i = 0; i < Object.size(humidityCircle); i++){
		humidityCircle[i].setMap(null);
	}
}

function showNoiseOverlays(){
	if(noiseMap){
	    query.equalTo(true);
		query.find({
  		success: function(levels) {
  			for (var i = 0; i < levels.length; i++) {
  			console.log((1-((-(levels[i].get("NoiseLevel")))/10)));
		    var populationOptions = {
		    strokeColor: getColor(1-((-(levels[i].get("NoiseLevel")))/10)),
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    //fillColor: '#FF0000',
		    fillColor: getColor(1-((-(levels[i].get("NoiseLevel")))/10)),
		    fillOpacity: 0.35,
		    map: map,
		    center: noiseMap[i].center,
		    //radius: Math.sqrt(noiseMap[i].population) * 5
		    radius: Math.sqrt(100)
		    };
			// Add the circle for this city to the map.
			noiseCircle[i] = new google.maps.Circle(populationOptions);
			}
		},
 		 error: function(error) {
    		alert("Error: " + error.code + " " + error.message);
  		}
	});
	}
}

function clearNoiseOverlays(){
	for (var i = 0; i < Object.size(noiseCircle); i++){
		noiseCircle[i].setMap(null);
	}
}

function showCarbonmonoxideOverlays(){
	if(carbonmonoxideMap){
	     for (var i = 0; i < Object.size(carbonmonoxideMap); i++) {
		    var populationOptions = {
		    strokeColor: getColor(1/20),
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    //fillColor: '#FF0000',
		    fillColor: getColor(1/20),
		    fillOpacity: 0.35,
		    map: map,
		    center: carbonmonoxideMap[i].center,
		    radius: Math.sqrt(carbonmonoxideMap[i].population) * 5
		};
		// Add the circle for this city to the map.
		carbonmonoxideCircle[i] = new google.maps.Circle(populationOptions);
		}
    }
}

function clearCarbonMonoxideOverlays(){
	for (var i = 0; i < Object.size(carbonmonoxideCircle); i++){
		carbonmonoxideCircle[i].setMap(null);
	}
}

function showMethaneOverlays(){
	if(methaneMap){
	     for (var i = 0; i < Object.size(methaneMap); i++) {
		    var populationOptions = {
		    strokeColor: getColor(1/20),
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    //fillColor: '#FF0000',
		    fillColor: getColor(1/20),
		    fillOpacity: 0.35,
		    map: map,
		    center: methaneMap[i].center,
		    radius: Math.sqrt(methaneMap[i].population) * 5
		};
		// Add the circle for this city to the map.
		methaneCircle[i] = new google.maps.Circle(populationOptions);
		}
    }
}

function clearMethaneOverlays(){
	for (var i = 0; i < Object.size(methaneCircle); i++){
		methaneCircle[i].setMap(null);
	}
}

$('#temperature').change(function() {
	if( $('#temperature').prop("checked")) {
    	showTemperatureOverlays();
    }
    else{
    	clearTemperatureOverlays();
	}
});

$('#humidity').change(function() {
	if( $('#humidity').prop("checked")) {
    	showHumidityOverlays();
    }
    else{
    	clearHumidityOverlays();
	}
});

$('#noise').change(function() {
	if( $('#noise').prop("checked")) {
    	showNoiseOverlays();
    }
    else{
    	clearNoiseOverlays();
	}
});

$('#carbonmonoxide').change(function() {
	if( $('#carbonmonoxide').prop("checked")) {
    	showCarbonMonoxideOverlays();
    }
    else{
    	showCarbonMonoxideOverlays();
	}
});

$('#methane').change(function() {
	if( $('#methane').prop("checked")) {
    	showMethaneOverlays();
    }
    else{
    	clearMethaneOverlays();
	}
});

function getColor(value){
    //value from 0 to 1
    var hue=((1 - value) * 120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}

var width;
var height;

function d3init(){
	width = map.getDiv().offsetWidth;
	height = map.getDiv().offsetHeight;
}

google.maps.event.addDomListener(window, 'load', initialize);
$(':checkbox:checked').removeAttr('checked');