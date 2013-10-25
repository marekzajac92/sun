var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

var map;

function initializeMap () {
	directionsDisplay = new google.maps.DirectionsRenderer();
	
	var map_options = {
		center: new google.maps.LatLng(52, 21),
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		streetViewControl: false,
		mapTypeControl: false
	};
	
	map = new google.maps.Map(document.getElementById('map_container'), map_options);
	directionsDisplay.setMap(map);
}

function calcRoute() {
	var start = document.getElementsByName('start_point')[0].value;
	var end = document.getElementsByName('end_point')[0].value;
	
	var waypoints = [];
	waypoints.push({
		location: 'olkusz',
		stopover: false
	});
	
	if(start == '' || !start){
		start = end;
	}
	else if(end == '' || !end){
		end = start;
	}
	
	var request = {
		origin: start,
		destination: end,
		waypoints: waypoints,
		travelMode: google.maps.TravelMode.DRIVING
	};
	
	directionsService.route(request, function(result, status){
		console.log(result);
		if(status == google.maps.DirectionsStatus.OK){
			directionsDisplay.setDirections(result);
		}
	});
}

function init(){
	initializeMap();
}

$('document').ready(function(){
	document.getElementsByName('start_point')[0].onblur = calcRoute;
	document.getElementsByName('end_point')[0].onblur = calcRoute;
	$('#waypoints_list').tinyscrollbar();
	$('#content').tinyscrollbar();
	$('.add_waypoint_button').click(function() {
		var waypoint = $('<div class="waypoint"><div class="waypoint_text">' + document.getElementsByName('new_waypoint')[0].value + '</div><div class="remove_button" onclick="$(this).parent().remove(); $(\'#waypoints_list\').tinyscrollbar_update();" /></div>');
		$('#waypoints').append(waypoint);
		$('#waypoints_list').tinyscrollbar_update();
	});
});

google.maps.event.addDomListener(window, 'load', init);



$('#waypoints_show').click(function(){
	if($('#waypoints_show').hasClass('span_show')){
		$('#waypoints_show').removeClass('span_show');
		$('#waypoints_show').addClass('span_hide');
		$('#added_waypoints').slideDown(500);
		$('#waypoints_list').tinyscrollbar_update();
	}
	else{
		$('#waypoints_show').addClass('span_show');
		$('#waypoints_show').removeClass('span_hide');
		$('#added_waypoints').slideUp(500);
	}
	$('#content').tinyscrollbar_update();
});

$('#trans_type').click(function(){
	if($('#trans_type').hasClass('span_show')){
		$('#trans_type').removeClass('span_show');
		$('#trans_type').addClass('span_hide');
		$('#transport').slideDown(500);
	}
	else{
		$('#trans_type').addClass('span_show');
		$('#trans_type').removeClass('span_hide');
		$('#transport').slideUp(500);
	}
	$('#content').tinyscrollbar_update();
});