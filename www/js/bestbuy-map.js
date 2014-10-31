function initialize() {
    var mapOptions = {
        center: { lat: 39.8282, lng: -98.5795},
        zoom: 5,
        mapTypeControl: false
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);

function myFunction(){
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
    document.getElementById('book').contentWindow.search();
}

jQuery.support.cors = true;
$.support.cors = true;

function search(){
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
		  		$('#hello').children('div').remove();
		  		var data = response;
		  		console.log(data);
		  		for(var i = 0; i < 10; i++){
		  			$("#hello").append("<div class = 'item'><p class = 'itemname'> "+data.products[i].name+ "</p><p class = 'itemPrice'>"+data.products[i].salePrice+"<img src = '"+data.products[i].image+"'></div>");
		  			if(data.products[i].customerReviewAverage == null){
		  				$("#hello").append("<p class = 'rating'> Rating: No Review</p>");
		  			} else {
		  				$("#hello").append("<p class = 'rating'> Rating: "+data.products[i].customerReviewAverage+"</p>");
		  			}
		  		}
		  	}
		});
}

function insertAfter( referenceNode, newNode ){
    referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
}
