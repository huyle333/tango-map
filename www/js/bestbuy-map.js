jQuery.support.cors = true;
$.support.cors = true;
var mapOptions = {
        center: { lat: 39.8282, lng: -98.5795},
        zoom: 5,
        mapTypeControl: false
    };
var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

function initialize() {
    
    /*var airPollutionControl = new google.maps.LatLng(42.360200, -71.057951);
    var airPollutionControlMarker = new google.maps.Marker({
		icon: ('http://maps.google.com/mapfiles/kml/pal2/icon2.png'),
		position: airPollutionControl,
		map: map,
		title: 'Boston Air Pollution Control'
	});*/
}

google.maps.event.addDomListener(window, 'load', initialize);

/*function myFunction(){
    ifrm = document.createElement("iframe"); 
    ifrm.setAttribute("z-index", "200");
    ifrm.setAttribute("id", "book"); 
    ifrm.style.width = 320 + "px";
    ifrm.style.height = 300 + "px";
    // document.body.appendChild(lookup); 
    insertAfter(document.getElementById("bestbuyInfo"), ifrm);
    var ifrm2 = document.getElementById('book');
    ifrm2 = (ifrm2.contentWindow) ? ifrm2.contentWindow : (ifrm2.contentDocument.document) ?  ifrm2.contentDocument.document : ifrm2.contentDocument;
    ifrm2.document.open();
    ifrm2.document.write('<div id\="hello"></div>');
    ifrm2.document.close();
    // document.getElementById('book').contentWindow.helloWorld();
    searchItem();
}*/

	$("#submitSearch").click(function(){
		var item = document.getElementById("itemSearch").value;
		$.ajax({
		  	url: "http://api.remix.bestbuy.com/v1/products(search="+item+")",
		  	dataType:"jsonp",
		  	cache: true,
		  	data: {
		  		format: 'json',
		  		apiKey: '4npra7dguufgq5575kkbdj9p'
		  	},
		  	success: function(response){
		  		$('#bestbuyInfo').children().remove();
		  		var data = response;
		  		console.log(data);
                $('#bestbuyInfo').append("<iframe id = \'iframe1\' width = '400px' height ='300px'>");
		  		for(var i = 0; i < 10; i++){
		  			//$("#bestbuyInfo").append("<div class = 'item'><p class = 'itemname'> "+data.products[i].name+ "</p><p class = 'itemPrice'>"+data.products[i].salePrice+"<img src = '"+data.products[i].image+"'></div>");
		  			document.getElementById('iframe1').contentWindow.document.write("<div class = 'item' style ='color:white;word-break: break-all; text-align: center; font-family: sans-serif;font-size: 15px;'><p class = 'itemname' style ='color:white;word-break: break-all; text-align: center; font-family: sans-serif;font-size: 15px;'> "+data.products[i].name+ "</p><p class = 'itemPrice'> Price: "+data.products[i].salePrice+" <img style= 'display: block;margin: 0 auto;' src = '"+data.products[i].image+"'></div>");
                    if(data.products[i].customerReviewAverage == null){
		  				//$("#bestbuyInfo").append("<p class = 'rating'> Rating: No Review</p>");
                        document.getElementById('iframe1').contentWindow.document.write("<p class = 'rating' style ='color:white;word-break: break-all; text-align: center; font-family: sans-serif;font-size: 15px;'> Rating: No Review</p>");
		  			} else {
		  				//$("#bestbuyInfo").append("<p class = 'rating'> Rating: "+data.products[i].customerReviewAverage+"</p>");
                        document.getElementById('iframe1').contentWindow.document.write("<p class = 'rating' style ='color:white;word-break: break-all; text-align: center; font-family: sans-serif;font-size: 15px;'> Rating: "+data.products[i].customerReviewAverage+"</p>");
		  			}
		  		}
		  	}
		});
	});

$("#submitSearch").click(function(){
	var zip = document.getElementById("searchZip").value;
	$.ajax({
	  	url:"http://api.remix.bestbuy.com/v1/stores(area("+zip+",20))",

	  	dataType:"jsonp",
	  	cache: true,
	  	data: {
	  		format: 'json',
	  		apiKey: '4npra7dguufgq5575kkbdj9p'
	  	},
	  	success: function(response){
	  		$('#bestbuyInfo').children('div').remove();
	  		var data = response;
	  		console.log(data);
	  		for(var i = 0; i < 20; i++){
	  			//$("#displayLocations").append("<div class = 'location'><p class = 'latitude'> "+data.stores[i].lat+ "</p><p class = 'longitude'>"+data.stores[i].lng+"<p class = 'storeName'>"+data.stores[i].longName +"</p></div>");
                var bestBuyLocation = new google.maps.LatLng(data.stores[i].lat, data.stores[i].lng);
                var bestBuyLocationMarker = new google.maps.Marker({
                    icon: ('http://maps.google.com/mapfiles/kml/pal2/icon2.png'),
                    position: bestBuyLocation,
                    map: map,
                    title: data.stores[i].longName
                });
	  		}
            //map.setZoom(17);
            //map.panTo(data.stores[0]);
	  	}
	});
});

function insertAfter( referenceNode, newNode ){
    referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
}
