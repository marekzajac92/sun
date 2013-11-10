var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

var L;
var RA;
var g;
var daylen;
var delta;
var x;
var y;
var z;

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

var sits_colors = new Array(
	'#000000',
	'#080000',
	'#100000',
	'#180000',
	'#200000',
	'#280000',
	'#300000',
	'#380000',
	'#400000',
	'#480000',
	'#500000',
	'#580000',
	'#600000',
	'#680000',
	'#700000',
	'#780000',
	'#800000',
	'#880000',
	'#900000',
	'#980000',
	'#A00000',
	'#A80000',
	'#B00000',
	'#B80000',
	'#C00000',
	'#C80000',
	'#D00000',
	'#D80000',
	'#E00000',
	'#E80000',
	'#F00000',
	'#F80000',
	'#FF0000'
);

var carParams = new Array(
	{
		length: 240,
		width: 175,
		scale: 1.0,
		min_height: 65,
		max_height: 135,
		eyes_height: 100,
		sit_width : 50,
		sit_height : 60,
		sits : [
			{
				x : 10,
				y : 40,
				count : 0,
				eyes_count: 0
			},
			{
				x : 62.5,
				y : 40,
				count : 0,
				eyes_count: 0
			},
			{
				x : 115,
				y : 40,
				count : 0,
				eyes_count: 0
			},
			{
				x : 15,
				y : 160,
				count : 0,
				eyes_count: 0
			},
			{
				x : 110,
				y : 160,
				count : 0,
				eyes_count: 0
			}
		]
	},
	{
		length: 500,
		width: 185,
		scale: 240 / 500,
		min_height: 110,
		max_height: 190,
		eyes_height: 140,
		sit_width : 40,
		sit_height : 40,
		sits : [
			{
				x : 5,
				y : 5,
				count : 0,
				eyes_count: 0
			},
			{
				x : 50,
				y : 5,
				count : 0,
				eyes_count: 0
			},
			{
				x : 95,
				y : 5,
				count : 0,
				eyes_count: 0
			},
			{
				x : 140,
				y : 5,
				count : 0,
				eyes_count: 0
			},
			{
				x : 5,
				y : 65,
				count : 0,
				eyes_count: 0
			},
			{
				x : 50,
				y : 65,
				count : 0,
				eyes_count: 0
			},
			{
				x : 140,
				y : 65,
				count : 0,
				eyes_count: 0
			},
			{
				x : 5,
				y : 125,
				count : 0,
				eyes_count: 0
			},
			{
				x : 50,
				y : 125,
				count : 0,
				eyes_count: 0
			},
			{
				x : 140,
				y : 125,
				count : 0,
				eyes_count: 0
			},
			{
				x : 5,
				y : 185,
				count : 0,
				eyes_count: 0
			},
			{
				x : 50,
				y : 185,
				count : 0,
				eyes_count: 0
			},
			{
				x : 140,
				y : 185,
				count : 0,
				eyes_count: 0
			},
			{
				x : 5,
				y : 245,
				count : 0,
				eyes_count: 0
			},
			{
				x : 50,
				y : 245,
				count : 0,
				eyes_count: 0
			},
			{
				x : 140,
				y : 245,
				count : 0,
				eyes_count: 0
			},
			{
				x : 5,
				y : 305,
				count : 0,
				eyes_count: 0
			},
			{
				x : 50,
				y : 305,
				count : 0,
				eyes_count: 0
			},
			{
				x : 140,
				y : 305,
				count : 0,
				eyes_count: 0
			},
			{
				x : 5,
				y : 365,
				count : 0,
				eyes_count: 0
			},
			{
				x : 50,
				y : 365,
				count : 0,
				eyes_count: 0
			},
			{
				x : 140,
				y : 365,
				count : 0,
				eyes_count: 0
			},
			{
				x : 20,
				y : 430,
				count : 0,
				eyes_count: 0
			},
		]
	}
);

var selectedCar = 0;

function drawResult(){
	var c = document.getElementById('sun_azimuth');
	var ctx = c.getContext('2d');
	
	ctx.clearRect(0,0, 250, 250);
	
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
	
	var selected_car;
	
	for(var j = 0; j < document.getElementsByName("trans").length; j++){
		if(document.getElementsByName("trans")[j].checked){
			selected_car = carParams[parseInt(document.getElementsByName("trans")[j].value)];
			break;
		}
	}
	
	var left_offset = (200 - selected_car.width * selected_car.scale) /2;
	var bottom_offset = (250 - selected_car.length * selected_car.scale) / 2;
	
	c = document.getElementById('car_pic');
	ctx = c.getContext('2d');
	ctx.clearRect(0,0, 200, 250);
	ctx.beginPath();
	ctx.rect(left_offset, bottom_offset, selected_car.width * selected_car.scale, selected_car.length * selected_car.scale);
	ctx.lineWidth = 3;
	ctx.strokeStyle = "#555555";
	ctx.stroke();
	
	for(var i = 0; i < selected_car.sits.length; i++){
		ctx.beginPath();
		ctx.rect(left_offset + selected_car.sits[i].x * selected_car.scale, bottom_offset + (selected_car.length * selected_car.scale - selected_car.sits[i].y * selected_car.scale - selected_car.sit_height * selected_car.scale), selected_car.sit_width * selected_car.scale, selected_car.sit_height * selected_car.scale);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#555555";
		ctx.fillStyle = sits_colors[Math.round((selected_car.sits[i].count / count) * sits_colors.length)];
		ctx.fill();
		ctx.stroke();
	}
	
	c = document.getElementById('car_eyes_pic');
	ctx = c.getContext('2d');
	ctx.clearRect(0,0,200,250);
	ctx.beginPath();
	ctx.rect(left_offset, bottom_offset, selected_car.width * selected_car.scale, selected_car.length * selected_car.scale);
	ctx.lineWidth = 3;
	ctx.strokeStyle = "#555555";
	ctx.stroke();
	
	for(var i = 0; i < selected_car.sits.length; i++){
		ctx.beginPath();
		ctx.rect(left_offset + selected_car.sits[i].x * selected_car.scale, bottom_offset + (selected_car.length * selected_car.scale - selected_car.sits[i].y * selected_car.scale - selected_car.sit_height * selected_car.scale), selected_car.sit_width * selected_car.scale, selected_car.sit_height * selected_car.scale);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#555555";
		ctx.fillStyle = sits_colors[Math.round((selected_car.sits[i].eyes_count / count) * sits_colors.length)];
		ctx.fill();
		ctx.stroke();
	}
	
}

function process(){
	var year = parseInt(document.getElementsByName('date')[0].value.split('/')[2]);
	var month = parseInt(document.getElementsByName('date')[0].value.split('/')[1]);
	var day = parseInt(document.getElementsByName('date')[0].value.split('/')[0]);
	
	var hour = parseInt(document.getElementsByName('time')[0].value.split(':')[0]);
	var minute = parseInt(document.getElementsByName('time')[0].value.split(':')[1]);
	
	var selected_car;
	
	for(var j = 0; j < document.getElementsByName("trans").length; j++){
		if(document.getElementsByName("trans")[j].checked){
			selected_car = carParams[parseInt(document.getElementsByName("trans")[j].value)];
			break;
		}
	}
	
	if (!isNaN(year) && !isNaN(month) && !isNaN(day) && !isNaN(hour) && !isNaN(minute)) {
		$('.waiting').removeClass('waiting_disable');
		
		for(var i = 0; i < selected_car.sits.length; i++){
			selected_car.sits[i].count = 0;
			selected_car.sits[i].eyes_count = 0;
		}
		
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
				var angelrad = angel;
				angel = angel * 180 / Math.PI;
				
				var min = minute + (step.duration.value / 60.0 * (j / step.path.length));
				var h = hour + min / 60.0;
				
				var sunPos = sunPosition(year, month, day, Math.round(h), Math.round(min), pos.lat(), pos.lng());
				
				if(sunPos.elevation > 0){
					//carParams[selectedCar].max_height / Math.tan(kat * Math.PI / 180);
					var az = ((sunPos.azimuth + angel) % 360) / 45;
					azimuths[Math.round(az)]++;
					
					var x1 = selected_car.max_height / Math.tan(sunPos.elevation * Math.PI / 180);
					var y1 = 0.0;
					
					//console.log(x1 + " " + sunPos.elevation * Math.PI / 180);
					
					var x2 = selected_car.min_height / Math.tan(sunPos.elevation * Math.PI / 180);
					var y2 = 0.0;
					
					var newX1 = x1 * Math.cos(sunPos.azimuth + angelrad) - y1 * Math.sin(sunPos.azimuth + angelrad);
					var newY1 = x1 * Math.sin(sunPos.azimuth + angelrad) + y1 * Math.cos(sunPos.azimuth + angelrad);
					
					//console.log(newX1 + ' ' + newY1 + ' ; ' + sunPos.elevation);
					
					var newX2 = x2 * Math.cos(sunPos.azimuth + angelrad) - y2 * Math.sin(sunPos.azimuth + angelrad);
					var newY2 = x2 * Math.sin(sunPos.azimuth + angelrad) + y2 * Math.cos(sunPos.azimuth + angelrad);
					
					for(var k = 0; k < selected_car.sits.length; k++){
						var isSun = false;
						var sit = selected_car.sits[k];
						
						//lewa strona
						var X11 = newX1;
						var X12 = newX2;
						var Y11 = newY1 + selected_car.length;
						var Y12 = newY2 + selected_car.length;
						
						var X21 = newX1;
						var X22 = newX2;
						var Y21 = newY1;
						var Y22 = newY2;
						
						
						if(X11 >= sit.x && X12 <= sit.x + selected_car.sit_width){
							var d1 = sit.x - X12;
							var d2 = X11 - (sit.x + selected_car.sit_width);
							var width = selected_car.sit_width;
							
							var sx1 = sit.x;
							var sx2 = sit.x + selected_car.sit_width;
							if(d1 < 0){
								width += d1;
								sx1 = X21;
							}
							if(d2 < 0){
								width += d2;
								sx2 = X11;
							}
							
							if(width / selected_car.sit_width >= 0.3){
								if(Y11 >= Y12){
									if(Y11 - sit.y >= selected_car.sit_height / 2 && sit.y + selected_car.sit_height - Y22 >= selected_car.sit_height / 2){
										isSun = true;
									}
								}
								else{
									if(Y12 - sit.y >= selected_car.sit_height / 2 && sit.y + selected_car.sit_height - Y21 >= selected_car.sit_height / 2){
										isSun = true;
									}
								}
							}
						}
						
						//Prawa strona
						var X11 = newX1 + selected_car.width;
						var X12 = newX2 + selected_car.width;
						var Y11 = newY1 + selected_car.length;
						var Y12 = newY2 + selected_car.length;
						
						var X21 = newX1 + selected_car.width;
						var X22 = newX2 + selected_car.width;
						var Y21 = newY1;
						var Y22 = newY2;
						
						if(X11 <= sit.x + selected_car.sit_width && X12 >= sit.x){
							var d1 = sit.x - X11;
							var d2 = X12 - (sit.x + selected_car.sit_width);
							var width = selected_car.sit_width;
							
							var sx1 = sit.x;
							var sx2 = sit.x + selected_car.sit_width;
							if(d1 < 0){
								width += d1;
								sx1 = X11;
							}
							if(d2 < 0){
								width += d2;
								sx2 = X12;
							}
							
							if(width / selected_car.sit_width >= 0.3){
								if(Y11 >= Y12){
									if(Y11 - sit.y >= selected_car.sit_height / 2 && sit.y + selected_car.sit_height - Y22 >= selected_car.sit_height / 2){
										isSun = true;
									}
								}
								else{
									if(Y12 - sit.y >= selected_car.sit_height / 2 && sit.y + selected_car.sit_height - Y21 >= selected_car.sit_height / 2){
										isSun = true;
									}
								}
							}
						}
						
						//Góra
						var X11 = newX1 + selected_car.width;
						var X12 = newX2 + selected_car.width;
						var Y11 = newY1 + selected_car.length;
						var Y12 = newY2 + selected_car.length;
						
						var X21 = newX1;
						var X22 = newX2;
						var Y21 = newY1 + selected_car.length;
						var Y22 = newY2 + selected_car.length;
						
						
						if(Y11 <= sit.y + selected_car.sit_height && Y12 >= sit.y){
							var d1 = sit.y - Y11;
							var d2 = Y12 - (sit.x + selected_car.sit_height);
							var width = selected_car.sit_height;
							
							var sx1 = sit.y;
							var sx2 = sit.y + selected_car.sit_height;
							if(d1 < 0){
								width += d1;
								sx1 = Y11;
							}
							if(d2 < 0){
								width += d2;
								sx2 = Y12;
							}
							
							if(width / selected_car.sit_height >= 0.3){
								if(X11 >= X12){
									if(X11 - sit.x >= selected_car.sit_width / 2 && sit.x + selected_car.sit_width - X22 >= selected_car.sit_width / 2){
										isSun = true;
									}
								}
								else{
									if(X12 - sit.x >= selected_car.sit_width / 2 && sit.x + selected_car.sit_width - X21 >= selected_car.sit_width / 2){
										isSun = true;
									}
								}
							}
						}
						
						if(isSun){
							selected_car.sits[k].count++;
						}
					}
					
					x1 = (selected_car.max_height - selected_car.eyes_height) / Math.tan(sunPos.elevation * Math.PI / 180);
					y1 = 0.0;
					
					//console.log(x1 + " " + sunPos.elevation * Math.PI / 180);
					
					x2 = 0.0 / Math.tan(sunPos.elevation * Math.PI / 180);
					y2 = 0.0;
					
					newX1 = x1 * Math.cos(sunPos.azimuth + angelrad) - y1 * Math.sin(sunPos.azimuth + angelrad);
					newY1 = x1 * Math.sin(sunPos.azimuth + angelrad) + y1 * Math.cos(sunPos.azimuth + angelrad);
					
					//console.log(newX1 + ' ' + newY1 + ' ; ' + sunPos.elevation);
					
					newX2 = x2 * Math.cos(sunPos.azimuth + angelrad) - y2 * Math.sin(sunPos.azimuth + angelrad);
					newY2 = x2 * Math.sin(sunPos.azimuth + angelrad) + y2 * Math.cos(sunPos.azimuth + angelrad);
	
					for(var k = 0; k < selected_car.sits.length; k++){
						var isSun = false;
						var sit = selected_car.sits[k];
						
						//lewa strona
						var X11 = newX1;
						var X12 = newX2;
						var Y11 = newY1 + selected_car.length;
						var Y12 = newY2 + selected_car.length;
						
						var X21 = newX1;
						var X22 = newX2;
						var Y21 = newY1;
						var Y22 = newY2;
						
						
						if(X11 >= sit.x && X12 <= sit.x + selected_car.sit_width){
							var d1 = sit.x - X12;
							var d2 = X11 - (sit.x + selected_car.sit_width);
							var width = selected_car.sit_width;
							
							var sx1 = sit.x;
							var sx2 = sit.x + selected_car.sit_width;
							if(d1 < 0){
								width += d1;
								sx1 = X21;
							}
							if(d2 < 0){
								width += d2;
								sx2 = X11;
							}
							
							if(width / selected_car.sit_width >= 0.3){
								if(Y11 >= Y12){
									if(Y11 - sit.y >= selected_car.sit_height / 2 && sit.y + selected_car.sit_height - Y22 >= selected_car.sit_height / 2){
										isSun = true;
									}
								}
								else{
									if(Y12 - sit.y >= selected_car.sit_height / 2 && sit.y + selected_car.sit_height - Y21 >= selected_car.sit_height / 2){
										isSun = true;
									}
								}
							}
						}
						
						//Prawa strona
						var X11 = newX1 + selected_car.width;
						var X12 = newX2 + selected_car.width;
						var Y11 = newY1 + selected_car.length;
						var Y12 = newY2 + selected_car.length;
						
						var X21 = newX1 + selected_car.width;
						var X22 = newX2 + selected_car.width;
						var Y21 = newY1;
						var Y22 = newY2;
						
						if(X11 <= sit.x + selected_car.sit_width && X12 >= sit.x){
							var d1 = sit.x - X11;
							var d2 = X12 - (sit.x + selected_car.sit_width);
							var width = selected_car.sit_width;
							
							var sx1 = sit.x;
							var sx2 = sit.x + selected_car.sit_width;
							if(d1 < 0){
								width += d1;
								sx1 = X11;
							}
							if(d2 < 0){
								width += d2;
								sx2 = X12;
							}
							
							if(width / selected_car.sit_width >= 0.3){
								if(Y11 >= Y12){
									if(Y11 - sit.y >= selected_car.sit_height / 2 && sit.y + selected_car.sit_height - Y22 >= selected_car.sit_height / 2){
										isSun = true;
									}
								}
								else{
									if(Y12 - sit.y >= selected_car.sit_height / 2 && sit.y + selected_car.sit_height - Y21 >= selected_car.sit_height / 2){
										isSun = true;
									}
								}
							}
						}
						
						//Góra
						var X11 = newX1 + selected_car.width;
						var X12 = newX2 + selected_car.width;
						var Y11 = newY1 + selected_car.length;
						var Y12 = newY2 + selected_car.length;
						
						var X21 = newX1;
						var X22 = newX2;
						var Y21 = newY1 + selected_car.length;
						var Y22 = newY2 + selected_car.length;
						
						
						if(Y11 <= sit.y + selected_car.sit_height && Y12 >= sit.y){
							var d1 = sit.y - Y11;
							var d2 = Y12 - (sit.x + selected_car.sit_height);
							var width = selected_car.sit_height;
							
							var sx1 = sit.y;
							var sx2 = sit.y + selected_car.sit_height;
							if(d1 < 0){
								width += d1;
								sx1 = Y11;
							}
							if(d2 < 0){
								width += d2;
								sx2 = Y12;
							}
							
							if(width / selected_car.sit_height >= 0.3){
								if(X11 >= X12){
									if(X11 - sit.x >= selected_car.sit_width / 2 && sit.x + selected_car.sit_width - X22 >= selected_car.sit_width / 2){
										isSun = true;
									}
								}
								else{
									if(X12 - sit.x >= selected_car.sit_width / 2 && sit.x + selected_car.sit_width - X21 >= selected_car.sit_width / 2){
										isSun = true;
									}
								}
							}
						}
						
						if(isSun){
							selected_car.sits[k].eyes_count++;
						}
					}
				}
				
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

function FNday(year, month, day, hour){
	luku = parseInt(- 7 * (year + (month + 9)/12)/4 + 275*month/9 + day);
	luku += year * 367;
	
	return parseFloat(luku) - 730530.0 + hour/24.0;
}

function FNrange(xx){
	var b = xx / (2 * Math.PI);
	var a = 2 * Math.PI * (b - parseInt(b));
	if(a < 0){
		a = 2 * Math.PI + a;
	}
	
	//console.log(xx+ " " + a + " " + b);
	
	return a;
}

function f0(lat, declin){
	var fo;
	var dfo;
	
	dfo = Math.PI / 180.0 * (0.5 * 0.53 + 34.0 / 60.0);
	if(lat < 0){
		dfo = -dfo;
	}
	
	fo = Math.tan(declin + dfo) * Math.tan(lat * Math.PI / 180.0);
	if(fo > 0.99999){
		fo = 1.0;
	}
	fo = Math.asin(fo) + Math.PI / 2.0;
	
	//console.log("FNf0 : " + fo);
	
	return fo;
}

function FNsun(d){
	var w;
	var M;
	var v;
	var r;
	
	w = 282.9404 + 4.70935E-5 * d;
	M = 356.047 + 0.9856002585 * d;
	
	L = FNrange(w * (Math.PI / 180.0) + M * (Math.PI / 180.0));
	
	g = FNrange(M * (Math.PI / 180.0));
	
	var ecc = 0.016709 - 1.151E-9 * d;
	var obliq = 23.4393 * Math.PI / 180.0 - 3.563E-7 * Math.PI / 180.0 * d;
	
	var E = M + 180.0 / Math.PI * ecc * Math.sin(g) * (1.0 + ecc * Math.cos(g));
	E = 180.0 / Math.PI *FNrange(E*Math.PI / 180.0);
	x = Math.cos(E*Math.PI / 180.0) - ecc;
	y = Math.sin(E*Math.PI / 180.0) * Math.sqrt(1.0 - ecc*ecc);

	r = Math.sqrt(x*x + y*y);
	
	v = Math.atan2(y,x)*(180.0 / Math.PI);
	
	var lonsun = v + w;
	
	lonsun-= 360.0*(lonsun>360.0);
	
	x = r * Math.cos(lonsun*Math.PI / 180.0);
	y = r * Math.sin(lonsun*Math.PI / 180.0);
	var yequat = y * Math.cos(obliq);
	var zequat = y * Math.sin(obliq);
	
	RA = Math.atan2(yequat, x);
	
	delta = Math.atan2(zequat, Math.sqrt(x*x + yequat*yequat));
	RA*= 180.0 / Math.PI;
	
	//console.log("FNsun : " + FNrange(L + 1.915 * Math.PI / 180.0 * Math.sin(g) + .02 * Math.PI / 180.0 * Math.sin(2 * g)));
	
	return FNrange(L + 1.915 * Math.PI / 180.0 * Math.sin(g) + 0.02 * Math.PI / 180.0 * Math.sin(2 * g));
}

function sunPosition(year, month, day, hour, minute, lat, lng){
	//console.log(year + " " + month + " " + day + " " + hour + " " + minute + " " + lat + " " + lng);
	var h = hour + minute / 60.0;
	//console.log(4.70935E-5);
	//console.log(h);
	var tzone = parseFloat(1);
	var UT = h - tzone;
	var jd = FNday(year, month, day, UT);
	
	var lambda = FNsun(jd);
	
	var obliq = 23.4393 * Math.PI / 180.0 - 3.563E-7 * Math.PI / 180.0 * jd;
	
	var GMST0 = L*(180.0 / Math.PI)/15.0 + 12.0;
	var SIDTIME = GMST0 + UT + lng/15.0;
	
	var ha = 15.0*SIDTIME - RA;
	
	//console.log(lambda + " " + obliq + " " + GMST0 + " " + SIDTIME + " " + ha);
	ha = FNrange(Math.PI / 180.0 *ha);
	x = Math.cos(ha) * Math.cos(delta);
	y = Math.sin(ha) * Math.cos(delta);
	z = Math.sin(delta);
	var xhor = x * Math.sin(lat*Math.PI / 180.0) - z * Math.cos(lat*Math.PI / 180.0);
	var yhor = y;
	var zhor = x * Math.cos(lat*Math.PI / 180.0) + z * Math.sin(lat*Math.PI / 180.0);
	var azim = Math.atan2(yhor, xhor) + Math.PI;
	azim = FNrange(azim);
	var altit = Math.asin(zhor) * 180.0 / Math.PI;
	
	var alpha = Math.atan2(Math.cos(obliq) * Math.sin(lambda), Math.cos(lambda));
	//console.log(alpha);
	
	var equation = 1440 - (L - alpha) * 180.0 / Math.PI * 4;
	
	ha = f0(lat,delta);
	
	var position = new Object();
	position.azimuth = azim;
	position.elevation = altit;
	
	//console.log(position);
	
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

$('.info').click(function(){
	$('.info').addClass('waiting_disable');
});

$('#show_info').click(function(){
	$('.info').removeClass('waiting_disable');
});
