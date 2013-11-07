var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

var route = null;

var map;

var azimuths = new Array(
	0,0,0,0,0,0,0,0
);

var count = 0;

var percent_colors = new Array(
	'#000000',
	'#111111',
	'#222222',
	'#333333',
	'#444444',
	'#555555',
	'#666666',
	'#777777',
	'#888888',
	'#999999',
	'#AAAAAA',
	'#BBBBBB',
	'#CCCCCC',
	'#DDDDDD',
	'#EEEEEE',
	'#FFFFFF'
);

var carParams = new Array(
	{
		length: 300,
		width: 175,
		min_height: 80,
		max_height: 140	
	},
	{
		length: 500,
		width: 185,
		min_height: 110,
		max_height: 190	
	}
);

var selectedCar = 0;

function drawResult(){
	var c = document.getElementById('sun_azimuth');
	var ctx = c.getContext('2d');
	
	//console.log(azimuths);
	
	ctx.fillStyle = percent_colors[Math.round((azimuths[0] / count) * percent_colors.length)];
	ctx.beginPath();
	ctx.arc(125,125,100,1.5 * Math.PI ,Math.PI*1.75,false);
	ctx.lineTo(125,125);
	ctx.closePath();
	ctx.lineWidth = 5;
	ctx.fill();
	
	ctx.fillStyle = percent_colors[Math.round((azimuths[1] / count) * percent_colors.length)];
	ctx.beginPath();
	ctx.arc(125,125,100,1.75 * Math.PI ,Math.PI*2,false);
	ctx.lineTo(125,125);
	ctx.closePath();
	ctx.lineWidth = 5;
	ctx.fill();
	
	ctx.fillStyle = percent_colors[Math.round((azimuths[2] / count) * percent_colors.length)];
	ctx.beginPath();
	ctx.arc(125,125,100,0 ,Math.PI*0.25,false);
	ctx.lineTo(125,125);
	ctx.closePath();
	ctx.lineWidth = 5;
	ctx.fill();
	
	ctx.fillStyle = percent_colors[Math.round((azimuths[3] / count) * percent_colors.length)];
	ctx.beginPath();
	ctx.arc(125,125,100,0.25 * Math.PI ,Math.PI*0.5,false);
	ctx.lineTo(125,125);
	ctx.closePath();
	ctx.lineWidth = 5;
	ctx.fill();
	
	ctx.fillStyle = percent_colors[Math.round((azimuths[4] / count) * percent_colors.length)];
	ctx.beginPath();
	ctx.arc(125,125,100,0.5 * Math.PI ,Math.PI*0.75,false);
	ctx.lineTo(125,125);
	ctx.closePath();
	ctx.lineWidth = 5;
	ctx.fill();
	
	ctx.fillStyle = percent_colors[Math.round((azimuths[5] / count) * percent_colors.length)];
	ctx.beginPath();
	ctx.arc(125,125,100,0.75 * Math.PI ,Math.PI,false);
	ctx.lineTo(125,125);
	ctx.closePath();
	ctx.lineWidth = 5;
	ctx.fill();
	
	ctx.fillStyle = percent_colors[Math.round((azimuths[6] / count) * percent_colors.length)];
	ctx.beginPath();
	ctx.arc(125,125,100,Math.PI ,Math.PI*1.25,false);
	ctx.lineTo(125,125);
	ctx.closePath();
	ctx.lineWidth = 5;
	ctx.fill();
	
	ctx.fillStyle = percent_colors[Math.round((azimuths[7] / count) * percent_colors.length)];
	ctx.beginPath();
	ctx.arc(125,125,100,1.25 * Math.PI ,Math.PI*1.5,false);
	ctx.lineTo(125,125);
	ctx.closePath();
	ctx.lineWidth = 5;
	ctx.fill();
}

function process(){
	$('.waiting').removeClass('waiting_disable');
	
	var year = parseInt(document.getElementsByName('date')[0].value.split('/')[2]);
	var month = parseInt(document.getElementsByName('date')[0].value.split('/')[1])-1;
	var day = parseInt(document.getElementsByName('date')[0].value.split('/')[0]);
	
	var hour = parseInt(document.getElementsByName('time')[0].value.split(':')[0]);
	var minute = parseInt(document.getElementsByName('time')[0].value.split(':')[1]);
	
	var steps = route.routes[0].legs[0].steps;
	
	var time = 0;
	count = 0;
	for(var k = 0; k < 8; k++){
		azimuths[k] = 0;
	}
	for(var i = 0; i < steps.length; i++){
		var step = steps[i];
		//console.log(step);
		for(var j = 0; j < step.path.length - 1; j++){
			var pos = step.path[j];
			var next_pos = step.path[j+1];
			var angel = carAngel(pos.lat(), pos.lng(), next_pos.lat(), next_pos.lng());
			angel = angel * 180 / Math.PI;
			
			var min = minute + (step.duration.value / 60 * (j / step.path.length));
			var h = hour + min / 60;
			
			var sunPos = sunPosition(year, month, day, h, min, pos.lat(), pos.lng());
			//carParams[selectedCar].max_height / Math.tan(kat * Math.PI / 180);
			var az = ((sunPos.azimuth + angel) % 360) / 45;
			azimuths[Math.round(az)]++;
			count++;
		}
		minute += Math.round(step.duration.value / 60);
		hour += Math.floor(minute / 60);
		minute = minute % 60;
		
		//console.log(hour + ' ' + minute);
	}
	
	$('.result').removeClass('waiting_disable');
	
	drawResult();
	
	$('.waiting').addClass('waiting_disable');
}

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
	$('.waiting').removeClass('waiting_disable');
	var start = document.getElementsByName('start_point')[0].value;
	var end = document.getElementsByName('end_point')[0].value;
	
	var waypoints = [];
	$('.waypoint_text').each(function(index){
		waypoints.push({
			location: $(this).text(),
			stopover: false
		});
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
		if(status == google.maps.DirectionsStatus.OK){
			route = result;
			//console.log(route);
			directionsDisplay.setDirections(result);
		}
		$('.waiting').addClass('waiting_disable');
	});
}

function init(){
	initializeMap();
}

Date.prototype.getDOY = function() {
	var onejan = new Date(this.getFullYear(), 0, 1);
	return (Math.ceil(this - onejan) / 86400000) + 1;
};

function carAngel(lat1, long1, lat2, long2){
	dy = lat2 - lat1;
	dx = Math.cos(Math.PI / 180 * lat1)*(long2 - long1);
	var ang = Math.atan2(dy, dx);
	if(ang < 0){
		ang = ang + (2 * Math.PI);
	}
	return ang;
}

function sunPosition(year, month, day, hour, min, lat, lng){
	twopi = 2 * Math.PI;
	deg2rad = Math.PI / 180;
	
	day = new Date(year, month, day).getDOY();
	
	hour = hour + min / 60;
	
	delta = year - 1949;
	leap = Math.floor(delta / 4);
	
	jd = 32916.5 + delta * 365 + leap + day + hour / 24;
	
	time = jd - 51545;
	
	mnlong = 280.460 + 0.9856474 *  time;
	mnlong = mnlong % 360;
	
	if(mnlong < 0){
		mnlong = mnlong + 360;
	}
	
	mnanom = 357.528 + 0.9856003 * time;
	mnanom = mnanom % 360;
	
	if(mnanom < 0){
		mnanom = mnanom + 360;
	}
	
	mnanom = mnanom * deg2rad;
	
	eclong = mnlong + 1.915 * Math.sin(mnanom) + 0.020 * Math.sin(2 * mnanom);
	eclong = eclong % 360;
	
	if(eclong < 0){
		eclong = eclong + 360;
	}
	
	oblqec = 23.429 - 0.0000004 * time;
	eclong = eclong * deg2rad;
	oblqec = oblqec * deg2rad;
	
	num = Math.cos(oblqec) * Math.sin(eclong);
	den = Math.cos(eclong);
	ra = Math.atan(num / den);
	
	if(ra < 0){
		ra = ra + Math.PI;
	}
	if(ra >= 0 && num < 0){
		ra = ra + twopi;
	}
	
	dec = Math.asin(Math.sin(oblqec) * Math.sin(eclong));
	
	gmst = 6.697375 + 0.0657098242 * time + hour;
	gmst = gmst % 24;
	
	if(gmst < 0){
		gmst = gmst + 24;
	}
	
	lmst = gmst + lng / 15;
	lmst = lmst % 24;
	if(lmst < 0){
		lmst = lmst + 24;
	} 
	lmst = lmst * 15.0 * deg2rad;
	
	ha = lmst - ra;
	
	if(ha < -Math.PI){
		ha = ha + twopi;
	}
	if(ha > Math.PI){
		ha = ha - twopi;
	}
	
	lat = lat * deg2rad;
	
	el = Math.asin(Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(ha));
	az = Math.asin(-Math.cos(dec) * Math.sin(ha) / Math.cos(el));
	
	cosAzPos = (0 <= (Math.sin(dec) - Math.sin(el) * Math.sin(lat)));
	sinAzNeg = (Math.sin(az) < 0);
	
	if(cosAzPos && sinAzNeg){
		az = az + twopi;
	}
	
	if(!cosAzPos){
		az = Math.PI - az;
	}
	
	var position = new Object();
	position.elevation = el / deg2rad;
	position.azimuth = az / deg2rad;
	
	return position;
}

$('document').ready(function(){
	document.getElementById('route').onclick = calcRoute;
	$('.add_waypoint_button').click(function() {
		if(document.getElementsByName('new_waypoint')[0].value != ''){
			var waypoint = $('<div class="waypoint"><div class="waypoint_text">' + document.getElementsByName('new_waypoint')[0].value + '</div><div class="remove_button" onclick="$(this).parent().remove();" /></div>');
			$('#waypoints').append(waypoint);
			document.getElementsByName('new_waypoint')[0].value = '';
		}
	});
	
	document.getElementById('check_route').onclick = process;
});

google.maps.event.addDomListener(window, 'load', init);

$('#waypoints_show').click(function(){
	if($('#waypoints_show').hasClass('span_show')){
		$('#waypoints_show').removeClass('span_show');
		$('#waypoints_show').addClass('span_hide');
		$('#added_waypoints').slideDown(500);
	}
	else{
		$('#waypoints_show').addClass('span_show');
		$('#waypoints_show').removeClass('span_hide');
		$('#added_waypoints').slideUp(500);
	}
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
});

$('.result').click(function(){
	$('.result').addClass('waiting_disable');
});