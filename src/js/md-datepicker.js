var id=0
	locale = {
		en: {
			month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			Button: {
				Clean:'delete',
				Cancel:'cancel'
			}
		},
		de: {
			month: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
			weekday: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
			Button: {
				Clean:'Löschen',
				Cancel:'Abrrechen'
			}
		}
	},prefixes=["moz", "ms", "webkit", "o"];
(function ( $, window, document, undefined ) {
	function flexbox_support(){
		var test = document.createElement('div').style;
		if (test.flex!=undefined) return true;
		for (var i = prefixes.length - 1; i >= 0; i--) {
			if (test[prefixes[i]+'Flex']!=undefined) return true;
		};
		return false;
	}
	$.fn.md_datepicker = function(options) {
		"use strict";
		var start1 = moment();
		if (!flexbox_support()) {
			return $(this).each(function(index, el) {
				try {
					el.type = 'date';
				} catch (err){
					el.type = 'text';
				}
			});
		}
		function createSvgElement(name) {
			return document.createElementNS(svgNS, name);
		}
		function createTick(dialRadius, radian, tickRadius, num, scale){
			return '<div class="lolliclock-tick" style="left:'+(dialRadius + Math.sin(radian) * (radius * scale) - tickRadius).toFixed(2)+'px;top:'+(dialRadius - Math.cos(radian) * (radius*scale) - tickRadius).toFixed(2)+'px">'+num+'</div>';
		}
		id++;
		var initilized = false;
		this.each(function() {
			if (this.initilized) initilized = true;
		});
		if (initilized) return;

		var defaults = {
			language: null,
			theme: 'light',
			timepicker: false,
			startday: 1,
			autoclose: false,
			mindate: null,
			maxdate: null,
			range: 'past',
			_24h:false,
			format: 'YYYY-MM-DD',
			animated: true,
			submit:'string',
			custom_class:''
		},
		localesupport = toLocaleStringSupports(),
		touchSupported = 'ontouchstart' in window,
		mousedownEvent = 'mousedown' + ( touchSupported ? ' touchstart' : ''),
		mousemoveEvent = 'mousemove.lolliclock' + ( touchSupported ? ' touchmove.lolliclock' : ''),
		mouseupEvent = 'mouseup.lolliclock' + ( touchSupported ? ' touchend.lolliclock' : ''),
		transitionend = 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
		today = new Date(),
		settings = $.extend( {}, defaults, options ),
		weekdaynumber = [0,1,2,3,4,5,6],
		parts = weekdaynumber.splice(-settings.startday),
		weekdaynumber = parts.concat(weekdaynumber);
		settings.language = (settings.language) ? settings.language : navigator.language || navigator.userLanguage || 'en';
		settings.format = (settings.timepicker&&!options.format) ? 'YYYY-MM-DD HH:mm' : settings.format;
		today.setSeconds(0);
		if (settings.format) {
			var delimiter 	= settings.format.match(/\W/),
				format 		= (settings.timepicker) ? settings.format.split(' ')[0].split(delimiter).reverse() : settings.format.split(delimiter).reverse();
			console.log(format);
			if (settings.timepicker) {
				$.each(settings.format.split(' ')[1].split(':'), function(index, val) {
					 format.push(val);
				});
			};
			console.log(format);
		}
		if (localesupport) {
			for (var i = 0,temp_day, day_array = []; i < 7; i++) {
				temp_day = new Date(2015, 1, i);
				day_array[temp_day.getDateParts().weekday] = temp_day.toLocaleString(settings.language, {weekday: 'short'}).replace(".","")
			};
			for (var i = 0,temp_day, month_array = []; i < 12; i++) {
				temp_day = new Date(2015, i, 1);
				month_array[i] = temp_day.toLocaleString(settings.language, {month: 'long'});
			};
		} else {
			var day_array 	= locale[settings.language.split('-')[0]].weekday.slice(0),
				month_array = locale[settings.language.split('-')[0]].month.slice(0);
		};
		parts 	 = day_array.splice(0, settings.startday);
		var weekdays = day_array.concat(parts),
			day_template = "",
			weektemplate = "",
			month_template = "";

		$.each(weekdays, function(i, val) {
			weektemplate+= '<span>'+val+'</span>';
		});
		$.each(month_array, function(i, val) {
			month_template+='<span data-month="'+i+'">'+month_array[i]+'</span>';
		});

		var max 	= 100,
			start 	= (settings.mindate && settings.mindate.search(/^[-+]/)) ? moment(settings.mindate) : moment().add(settings.mindate, 'y'),
			end 	= (settings.maxdate && settings.maxdate.search(/^[-+]/)) ? moment(settings.maxdate) : moment().add(settings.maxdate, 'y');
		if (settings.mindate&&settings.maxdate) {
			max 	= moment.duration(end-start).years();
			settings.range = "calculated";
		} else if (settings.mindate&&settings.range=="past") {
			max 	= moment.duration(today-start).years()+1;
		} else if (settings.maxdate&&settings.range=="future") {
			max 	= moment.duration(end-today).years();
		};
		// console.log(max,start,(!!settings.maxdate.search(/^[-+]/)))
		for (var i = 0,temp_day, year_template="", range = settings.range, today_year = today.getDateParts().year; i <= max; i++) {
			year_template+='<span>'+((range=='future') ? today_year+max-i : (range=='past') ? today_year-i : (range=='calculated') ? end.year()-i : today_year-(i-(max-max%2)/2))+'</span>'
		};

		var submit_values = $(this);
		submit_values.each(function() {
			var Timestamp = this.cloneNode(true);
			Timestamp.type = 'hidden';
			Timestamp.className = '';
			Timestamp.output = this;
			Timestamp.id = this.id+'-timestamp';
			this.readOnly = true;
			if (settings.submit=='timestamp') {
				this.name ="";
			} else {
				Timestamp.name ="";
			}
			this.Timestamp = Timestamp;
			this.parentNode.appendChild(Timestamp);
			this.onchange = function(e){
				if (this.value!='') {
					this.Timestamp.value = moment(this.value, settings.format).unix();
					this.date = new Date(moment(this.value, settings.format).unix());
				}
				else {
					this.Timestamp.value = 0;
					this.Timestamp.date = undefined;
				}
			}
			this.Timestamp.onchange = function(e){
				var Timestamp_value = Number(this.value*1000),
				old_function = Timestamp.output.onchange;
				Timestamp.output.onchange = null;

				if (this.value=='') {
					Timestamp.output.value = '';
					Timestamp.output.date = undefined;
				} else {
					Timestamp.output.value = moment(Timestamp_value).format(settings.format);
					Timestamp.output.date = new Date(Timestamp_value);
				}
				$(Timestamp.output).change();
				Timestamp.output.onchange = old_function;
			}
		});

		for (var i = 1 ; i <= 31; i++) {
			day_template+= '<span>'+i+'</span>';
		};

		if (settings.timepicker) {
			// Clock size
			// Lädt die Stylesheets
			for (var i = document.styleSheets.length - 1; i >= 0; i--) {
				// sucht nach lolliclock.css
				if (document.styleSheets[i].href&&document.styleSheets[i].href.indexOf('md-datepicker')>0) {
					// lade alle Regeln in ein Array
					var lollicss = document.styleSheets[i].cssRules;
					for (var i = lollicss.length - 1; i >= 0; i--) {
						// Loopt solange bis der Selector stimmt.
						if (lollicss[i].selectorText==".md-clock") {
							var height = parseInt(lollicss[i].style.height);
						}
					};
				};
			};

			var dialRadius = height/2,
				radius = dialRadius - 32,
				tickRadius = 20,
				diameter = dialRadius * 2,
				duration = 350;

			// Build ticks
			// Hours view
			var hours = (settings._24h) ? 25 : 13;
			for (var i = 1, hour_tmpl="",radian; i < hours; i++) {
				radian = i / 6 * Math.PI;
				if (settings._24h&&i<13) {
					hour_tmpl+=createTick(dialRadius, radian, tickRadius, i, 0.6);
				} else {
					hour_tmpl+=createTick(dialRadius, radian, tickRadius, i, 1);
				}
			}
			// Minutes view
			for (var i = 0, min_tmpl="",radian; i < 60; i += 5) {
				radian = i / 30 * Math.PI;
				min_tmpl+=createTick(dialRadius, radian, tickRadius, i.pad(2), 1);
			}
			var timepicker = ''+
			'<div class="md-datepicker-timeview">'+
			'<div class="md-datepick-header">'+
			'<div class="md-datepicker-headline">'+
			'<span class="md-hour"></span>'+
			':'+
			'<span class="md-minute"></span>'+
			'<div class="md-ampm-toggle">'+
			'<span class="md-am">AM</span>'+
			'<span class="md-pm">PM</span>'+
			'</div>'+
			'</div>'+
			'<i class="md-toggle-state no-hover">&#xE878</i>'+
			'</div>'+
			'<div class="md-clock">'+
				'<div class="md-hours">'+hour_tmpl+'</div>'+
				'<div class="md-minutes">'+min_tmpl+'</div>'+
			'</div>'+
			'</div>';

			var svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="lolliclock-svg" width="'+height+'" height="'+height+'" style="transform: rotateZ(0deg);">'+
			'<g transform="translate('+dialRadius+','+dialRadius+')">'+
			'<circle class="lolliclock-canvas-bg" r="'+tickRadius+'" cx="0" cy="-'+radius+'"></circle>'+
			'<circle class="lolliclock-canvas-fg" r="3.5" cx="0" cy="-'+radius+'" ></circle>'+
			'<line x1="0" y1="0" x2="0" y2="-'+(radius-tickRadius)+'"></line><circle class="lolliclock-bearing" cx="0" cy="0" r="3.5"></circle>'+
			'</g>'+
			'</svg>';

			var mousedown = function (e) {
				var offset = canvas.offset(),
				isTouch = /^touch/.test(e.type),
				x0 = offset.left + dialRadius,
				y0 = offset.top + dialRadius,
				dx = (isTouch ? e.originalEvent.touches[0] : e).pageX - x0,
				dy = (isTouch ? e.originalEvent.touches[0] : e).pageY - y0,
				z = Math.sqrt(dx * dx + dy * dy),
				moved = false,
				setTime = false;

				// Ignore plate clicks that aren't even close
				if (z < radius - tickRadius || z > radius + tickRadius) {
					return;
				}
				e.preventDefault();
				$(document.body).addClass('lolliclock-moving');

				// Place the canvas to top
				canvas.append(self.canvas);

				// Clock
				setHand(dx, dy);
				proxy.el.svg.oldRot = proxy.el.svg.lastRot;
				// Mousemove on document
				$(document).off(mousemoveEvent).on(mousemoveEvent, function (e) {
					e.preventDefault();
					proxy.el.svg.classList.remove('animate');
					var isTouch = /^touch/.test(e.type),
					x = (isTouch ? e.originalEvent.touches[0] : e).pageX - x0,
					y = (isTouch ? e.originalEvent.touches[0] : e).pageY - y0;
					if (!moved && x === dx && y === dy) {
						// Clicking in chrome on windows will trigger a mousemove event
						return;
					}
					moved = true;
					setTime = setHand(x, y);
				});

				// Mouseup on document
				$(document).off(mouseupEvent).on(mouseupEvent, function (e) {
					e.preventDefault();
					var isTouch = /^touch/.test(e.type),
					x = (isTouch ? e.originalEvent.changedTouches[0] : e).pageX - x0,
					y = (isTouch ? e.originalEvent.changedTouches[0] : e).pageY - y0;
					if (x === dx && y === dy) {
						setTime = setHand(x, y);
					}
					console.log(setTime)
					if (setTime&&proxy.currentView === 'hours') {
						// this.toggleView('minutes', duration / 2);
						setTimeout(function() {
							timepicker_change(true);
						}, ((moved) ? 0 : 250) );
					} else if (settings.autoclose) {
						// this.done();
					}
					// proxy.prepend(canvas);

					// Reset mouse cursor
					$(document.body).removeClass('lolliclock-moving');

					// Unbind mousemove event
					$(document).off(mousemoveEvent);
					$(document).off(mouseupEvent);
				});
			}
			// raiseCallback(this.options.init);
		};
		var template = '<div class="md-datepicker md-'+settings.theme.split(' ').join(' md-')+((settings.animated=='all'||settings.animated=='inout'||settings.animated) ? ' md-datepicker-animated': '')+((settings.custom_class!='')?' '+settings.custom_class:'')+'" id="md-datepicker-'+id.pad(3)+'">'+
		'<div class="md-datepicker-views">'+
		'<div class="md-datepicker-dateview">'+
		'<div class="md-datepick-header">'+
		'<div>'+
		'<span class="year"></span>'+
		'</div>'+
		'<div class="md-datepicker-headline">'+
		'<span class="weekday"></span><span class="day"></span> <span class="month"></span>'+
		'</div>'+
		((settings.timepicker) ? '<i class="md-toggle-state no-hover">&#xE192;</i>':'')+
		'</div>'+
		'<div class="md-datepick-month">'+
		'<i class="md-previous md-touchtarget no-hover">&#xE408;</i><i class="md-next md-touchtarget no-hover">&#xE409;</i>'+
		'</div>'+
		'<div class="md-months">'+
		'<div class="md-previous-month md-month">'+
		'<div class="md-date-wrap"><span class="md-month-display"></span> <span class="md-year-display"></span></div>'+
		'<div class="md-weekday">'+weektemplate+'</div>'+
		'<div class="md-week">'+day_template+'</div>'+
		'</div>'+
		'<div class="md-current-month md-month">'+
		'<div class="md-date-wrap"><span class="md-month-display"></span> <span class="md-year-display"></span></div>'+
		'<div class="md-weekday">'+weektemplate+'</div>'+
		'<div class="md-week">'+day_template+'</div>'+
		'</div>'+
		'<div class="md-next-month md-month">'+
		'<div class="md-date-wrap"><span class="md-month-display"></span> <span class="md-year-display"></span></div>'+
		'<div class="md-weekday">'+weektemplate+'</div>'+
		'<div class="md-week">'+day_template+'</div>'+
		'</div>'+
		'</div>'+
		'<div class="month-select md-select-wrap">'+
		month_template+
		'</div>'+
		'<div class="year-select md-select-wrap">'+
		year_template+
		'</div>'+
		'</div>'+
		((settings.timepicker) ? timepicker:'')+
		'</div>'+
		'<div class="md-buttons">'+
		'<div class="md-button-flat button-delete">'+locale[settings.language.split('-')[0]].Button.Clean+'</div>'+
		'<div class="md-button-flat button-cancel">'+locale[settings.language.split('-')[0]].Button.Cancel+'</div>'+
		'<div class="md-button-flat button-ok">OK</div>'+
		'</div>'+
		'</div>';
		var setHand = function (x, y) {
			// Keep radians postive from 1 to 2pi
			var radian 		= Math.atan2(-x, y) + Math.PI,
				isHours 	= proxy.currentView === 'hours',
				unit 		= Math.PI / (isHours ? 6 : 30),
				// The view we will switch to
				nextview 	= (isHours) ? 'minutes' : 'hours',
				thisview	= (isHours) ? 'hours' : 'minutes',
				// Get the rotation for the next view
				nextRot 	= ((proxy.date.getDateParts()[nextview]) * (Math.PI / ((!isHours) ? 6 : 30))) * (180/Math.PI)%360,
				// Get the round value
				value 		= Math.round(radian / unit),value24,timerange,
				rotation 	= parseFloat((radian * (180/Math.PI)%360).toFixed(1));
			// console.log(Math.floor((radian * (180/Math.PI))%360)===0, Math.floor(radian * (180/Math.PI)))
				// console.log(rotation)

			value 			= (isHours&&value === 0) ? 12 : value;
			value24 		= proxy.hasClass('pm')&&isHours ? (value+12==24) ? 12 : (value+12).pad(2) : (value==12) ? '00' : (value).pad(2);
			// Check if is bigger than end time or smaller than start time
			timerange 		= (!proxy.range||proxy.set=='start'&&proxy.range&&value24<=proxy.end.date.getDateParts()[thisview]||proxy.range&&value24>=proxy.start.date.getDateParts()[thisview]);

			if (rotation < proxy.currentRot && !(rotation < 0 && proxy.currentRot > 0)) {
				console.log("clockwise")
			} else {
				console.log("anti clockwise")
			}
			// console.log(rotation, proxy.currentRot);
			proxy.clockwise = (rotation < proxy.currentRot && !(rotation < 0 && proxy.currentRot > 0)) ? true : false;
			proxy.currentRot = rotation;

			// Get the round radian
			radian = value * unit;

			// Setting lastRot according to distance between currenRot and nextRot
			proxy.el.svg.lastRot = (proxy.el.svg.currentRot-nextRot>180) ? 360+nextRot : nextRot;
			// Correct the hours or minutes
			if (isHours) {
				value = (isHours&&value === 0) ? 12 : value;
				proxy.fg.style.visibility = 'hidden';
				if (timerange) {
					proxy.el.hour.text(proxy.hasClass('pm') ? (value+12==24) ? 12 : (value+12).pad(2) : (value==12) ? '00' : (value).pad(2));
					proxy.date.setHours(proxy.el.hour.text());
				}
			} else {
				var isOnNum = (value % 5 === 0);
				if (isOnNum) {
					proxy.fg.style.visibility = 'hidden';
				} else {
					proxy.fg.style.visibility = 'visible';
				}
				if (value === 60) {
					value = 0;
				}
				if (timerange) {
					proxy.el.minute.text(value.pad(2));
					proxy.date.setMinutes(proxy.el.minute.text());
				}
			}
			if (timerange) {
				// Once hours or minutes changed, vibrate the device
				var ticks = (proxy.currentView=="hours") ? proxy.ticks.hours : proxy.ticks.minutes;
				ticks.each(function(index, el) {
					$(el).toggleClass('active', $(el).text()==value);
				});

				// Set clock hand and others' position
				var currentRot 	= radian * (180/Math.PI)%360,
					calcRot 	= (proxy.el.svg.lastRot-currentRot>180) ? 360+currentRot : currentRot;

				$(proxy.el.svg).css('transform', 'rotateZ('+calcRot+'deg)');
				// Save the currentRot for next calculation
				proxy.el.svg.currentRot = calcRot;

				return true;
			} else return false;
		};
		var locate = function(input){
			// console.log(window.innerWidth, $(window).width(), document)
			var pos = $(input).offset(), width = proxy.width(), height = proxy.height();
			pos.top = (pos.top+height+8>=$(window).height()) ? $(window).height()-height-8 : pos.top;
			pos.left = (pos.left+width+8>=$(window).width()) ? $(window).width()-width-8 : pos.left;
			return pos;
		}
		this.show = function(input){
			proxy.set = (proxy.start==input) ? 'start' : 'end';
			// console.log(input.value,proxy,validRange());
			var date_str = (input.value!='') ? (settings.format) ?  moment(input.value, settings.format) : moment(input.value) : moment((validRange()) ? (proxy.set=='start') ?  proxy.end.date : proxy.start.date : ''),
				pos 	 = locate(input);

			proxy.date = new Date(date_str);
			// proxy.date = new Date(2015,7,10,5,15);
			proxy.date = (isNaN(proxy.date.getTime())) ? new Date() : proxy.date;
			proxy.range = validRange();
			proxy.removeClass('hidden');
			proxy.el.prev_next_btns.removeClass('disabled');

			createMonthview('current');
			createMonthview('previous');
			createMonthview('next');
			update_view();

			if (settings.animated) {
				proxy.on(transitionend, function(){
					proxy.addClass('animate');
					proxy.off(transitionend)
				});
				if (proxy.hasClass('clockpicker')) {
					proxy.removeClass('clockpicker');
					proxy.on(transitionend, '.md-datepicker-views', function(event) {
						event.preventDefault();
							$(proxy).css({
								top: pos.top,
								left: pos.left
							}).off(transitionend)
					});
				} else {
					$(proxy).css({
						top: pos.top,
						left: pos.left
					}).addClass('md-datepicker-visible');
				}
			} else {
				$(proxy).css({
					top: pos.top,
					left: pos.left
				}).addClass('md-datepicker-visible');
			}
			proxy.el.buttons.off();
			proxy.el.buttons.on('click', '.button-ok', function(event) {
				event.preventDefault();
				if ($(input).is('[type=date]')) {
					$(input).val(proxy.date.getDateParts().year+'-'+(proxy.date.getDateParts().month+1).pad(2)+'-'+proxy.date.getDateParts().day.pad(2)).change();
				} else if (settings.format) {
					$(input).val(moment(proxy.date).format(settings.format)).change();
				} else if (settings.timepicker) {
					$(input).val(proxy.date.toLocaleString()).change();
				} else {
					$(input).val(proxy.date.toLocaleDateString()).change();
				}
				proxy[proxy.set].date=proxy.date;
				input.date = proxy.date;
				hide(input);
			});
			proxy.el.buttons.on('click', '.button-delete', function(event) {
				event.preventDefault();
				input.date = undefined;
				$(input).val('').change();
				hide(input);
			});
			proxy.el.buttons.children('.button-delete').toggleClass('disabled', input.value=='');
			proxy.el.buttons.on('click', '.button-cancel', function(event) {
				event.preventDefault();
				hide(input);
			});
			var doit;
			$(window).on('resize.id'+proxy.id_number, function(event) {
				clearTimeout(doit);
				pos = locate(input);
				proxy.css({
					top: pos.top,
					left: pos.left
				}).removeClass('animate');
  				doit = setTimeout(function(){
  					proxy.addClass('animate')
  				}, 100);
			});
		}
		var hide = function(input){
			$(input).removeClass('focused');
			proxy.removeClass('clockpicker md-datepicker-visible animate');
			proxy.el.buttons.off();
			$(window).off('resize.id'+proxy.id_number);
			proxy.on(transitionend, function(event) {
				event.preventDefault();
				proxy.addClass('hidden');
				proxy.off(transitionend);
			});
		}
		var update_view = function(){
			if (validRange()) {
				var select = (proxy.set=='start') ? 'end':'start';
				var elem =  proxy.el.select_year.find('span:matches('+proxy[select].date.getDateParts().year+')')

				if (proxy.start.date&&proxy.start.date.getDateParts().year<=proxy.date.getDateParts().year&&select=='start'||proxy.end.date&&proxy.end.date.getDateParts().year>=proxy.date.getDateParts().year&&select=='end'){
					$(proxy.el.prev_next_btns[proxy.set=='start'|0]).toggleClass('disabled', proxy.date.getDateParts().year==proxy[select].date.getDateParts().year&&proxy[select].date.getDateParts().month==proxy.date.getDateParts().month);
					if (proxy.date.getDateParts().year==proxy[select].date.getDateParts().year) {
						elem.push((proxy.el.select_month.find('span[data-month='+proxy[select].date.getDateParts().month+']'))[0]);
					}
					proxy.find('.md-select-wrap>span').removeClass('disabled');
					if (proxy.set=='end') {
						$(elem[1]).prevAll().addClass('disabled');
						$(elem[0]).nextAll().addClass('disabled');
					} else {
						$(elem[0]).prevAll().addClass('disabled');
						$(elem[1]).nextAll().addClass('disabled');
					}
				}
			} else {
				proxy.find('.md-select-wrap>span').removeClass('disabled');
			}

			proxy.el.months.text(proxy.date.loc(settings.language, {month: 'long'}));
			proxy.el.years.text(proxy.date.getDateParts().year);
			proxy.el.days.text(proxy.date.getDateParts().day);
			proxy.el.weekday.text(proxy.date.loc(settings.language, {weekday: 'short'}).replace(".",""));

			if (settings.timepicker) {
				proxy.removeClass('minute');
				proxy.currentView = "hours";

				proxy.toggleClass('pm', proxy.date.getDateParts().hours>=12);
				proxy.el.hour.text(proxy.date.getDateParts().hours.pad(2));
				proxy.el.minute.text(proxy.date.getDateParts().minutes.pad(2));

	      		var radian = (proxy.date.getDateParts().hours) * (Math.PI / 6),
	      			radian2 = (proxy.date.getDateParts().minutes) * (Math.PI / 30),
				x = Math.sin(radian) * radius,
				y = -Math.cos(radian) * radius;
				proxy.el.svg.lastRot = radian2 * (180/Math.PI);
				// proxy.el.svg.oldRot = proxy.el.svg.lastRot;
				proxy.el.svg.currentRot = radian * (180/Math.PI);
				setHand(x, y);
				// console.log(proxy.el)
			};
		};
		var timepicker_change = function(event){
			var isHour = !$(event.target).is(".md-hour");
			proxy.el.svg.lastRot = proxy.el.svg.currentRot;
			proxy.currentView = (isHour) ? "minutes" : "hours";
      		var radian = (isHour ? proxy.el.minute.text() : proxy.el.hour.text()) * (Math.PI / (proxy.currentView === 'hours' ? 6 : 30)),
			x = Math.sin(radian) * radius,
			y = -Math.cos(radian) * radius;

			proxy.el.svg.classList.add('animate');
			proxy.toggleClass('minute', isHour);
			$(proxy.el.svg).on(transitionend, function(event) {
				$(proxy.el.svg).off();
				proxy.el.svg.classList.remove('animate');
			});
			setHand(x, y);
		}
		var show_select = function(view){
			var elem = (view=='year') ? proxy.el.select_year.find('span:matches('+proxy.date.getDateParts().year+')') : proxy.el.select_month.find('span[data-month='+proxy.date.getDateParts().month+']');
			if (!elem.length) {
				var run = proxy.date.getDateParts().year-Number(proxy.el.select_year.children(':first-child').text());
				for (var i = 1, lastyear=Number(proxy.el.select_year.children(':first-child').text()); i <= run; i++) {
					proxy.el.select_year.prepend('<span>'+(lastyear+i)+'</span>');
				};
				elem = proxy.el.select_year.find('span:matches('+proxy.date.getDateParts().year+')');
			};
			var offset = elem.position().top;

			proxy.el['select_'+view].children('span').removeClass('md-currentdate')
			if (view=='year') proxy.el.select_year.find('span:matches('+proxy.date.getDateParts().year+')').addClass('md-currentdate');
			else proxy.el.select_month.find('span[data-month='+proxy.date.getDateParts().month+']').addClass('md-currentdate');

			if (!proxy.el['select_'+view].hasClass('inview')) proxy.el['select_'+view].addClass('inview animate');
	        proxy.el['select_'+view].stop().animate({
        		scrollTop: offset+proxy.el['select_'+view][0].scrollTop-(proxy.el['select_'+view][0].clientHeight-48)/2
        	}, parseInt(Math.abs(offset.remap(0,2000,500,3000))), 'easeInOutExpo');
			proxy.el['select_'+view].on(transitionend, function(){
				proxy.el['select_'+view].removeClass('animate');
			});
			proxy.el['select_'+view].on('mousewheel', function(event) {
				proxy.el['select_'+view].stop();
			});
		};
		var changeMonth = function(direction){
			var animate = (proxy.range) ? (direction=="next") ? (proxy.set=='start'&&proxy.date.getDateParts().month<proxy.end.date.getDateParts().month||proxy.set=='start'&&proxy.date.getDateParts().year!=proxy.end.date.getDateParts().year||proxy.set=='end') : (proxy.set=='end'&&proxy.date.getDateParts().month>proxy.start.date.getDateParts().month||proxy.set=='end'&&proxy.date.getDateParts().year!=proxy.start.date.getDateParts().year||proxy.set=='start'): true;
			var select = (proxy.set=='start') ? 'end':'start';

			if (animate) {
				proxy.el.prev_next_btns.off('click');
				proxy.el.month_wrap.addClass('animate '+ direction);

				if (direction=="next") {
					proxy.date.setMonth(proxy.date.getDateParts().month+1);
				} else {
					proxy.date.setMonth(proxy.date.getDateParts().month-1);
				}

				if (proxy.range&&proxy.set=='start'&&proxy.end.date<=proxy.date||proxy.range&&proxy.set=='end'&&proxy.start.date>=proxy.date) {
					proxy.date=new Date(proxy[select].date);
					updateMonthviews();
				}
				update_view();

				proxy.el.month_wrap.on(transitionend, function(){
					proxy.el.current.html(proxy.el[direction].html());
					proxy.el.month_wrap.removeClass('animate '+ direction);
					createMonthview('next');
					createMonthview('previous');
					proxy.el.month_wrap.off(transitionend);
					proxy.el.prev_next_btns.on('click', prev_next);
				});
			};
		};
		var updateMonthviews = function(){
			var view = ['next', 'previous'];
			for (var i = view.length - 1; i >= 0; i--) {
				proxy.el[view[i]].find('.md-selecteddate').removeClass('md-selecteddate');
				proxy.el[view[i]].find('span:matches('+proxy.date.getDateParts().day+')').addClass('md-selecteddate');
			};
		}

		function validRange(){
			if (proxy.start&&proxy.end) {
				// console.log(proxy)
				return (proxy.date!=undefined&&proxy[((proxy.set=='start')?'end':'start')].date!=undefined);
			} else return false;
		}
		var createMonthview = function(view) {
			var month = proxy.date.getDateParts().month,
				tempdate = new Date(proxy.date),
				startday, days = "", classes;

			if (view=='previous') {
				tempdate.setMonth(month-1)
			} else if (view=='next') {
				tempdate.setMonth(month+1)
			}
			startday = weekdaynumber[startDay(tempdate)];
			var dim = daysInMonth(tempdate);
			for (var i = settings.startday; i < startday+settings.startday; i++) {
				days+="<span></span>";
			};
			// (isNaN(proxy.date.getTime()))
			var isSameYearMonth = (today.getDateParts().month==tempdate.getDateParts().month&&today.getDateParts().year==tempdate.getDateParts().year),
				setting 		= (proxy.set=='start') ? 'end':'start';
			if (proxy.range) var isSameStartEnd 	= (tempdate.getDateParts().month==proxy[setting].date.getDateParts().month&&tempdate.getDateParts().year==proxy[setting].date.getDateParts().year);
			for (var i = 1; i <= dim; i++) {
				classes = [];
				if (proxy.date.getDateParts().day==i) classes.push('md-selecteddate');
				if (today.getDateParts().day==i&&isSameYearMonth) classes.push('md-currentdate');
				if (proxy.range&&proxy.set=='start'&&i>proxy.end.date.getDateParts().day&&isSameStartEnd||proxy.range&&proxy.set=='end'&&i<proxy.start.date.getDateParts().day&&isSameStartEnd) classes.push('disabled');

				days+="<span"+((classes.length>=1) ? ' class="'+classes.join(" ")+'"' : ''  )+" >"+i+"</span>"
			};
			proxy.el[view].find('.md-month-display').text(tempdate.loc(settings.language, {month: 'long'}))
			proxy.el[view].find('.md-year-display').text(tempdate.getDateParts().year)
			proxy.el[view].find('.md-week').html(days);
		};
		function prev_next() {
			changeMonth(this.className.split(' ')[0].split('-')[1]);
		}
		var proxy = $(template).appendTo("body");
		proxy.el = {};
		proxy.id_number = id;
		if (settings.timepicker) {
			var canvas = proxy.find('.md-clock');
			svg = $(svg).appendTo(canvas)[0];
			$.extend(proxy, {
				fg:$(svg).find('.lolliclock-canvas-fg')[0],
				canvas:canvas,
				ticks:{}
			});
			proxy.el.svg = svg;
			proxy.el.svg.currentRot = 0;
			proxy.ticks.minutes = proxy.canvas.find('.md-minutes>div');
			proxy.ticks.hours = proxy.canvas.find('.md-hours>div');
			proxy.el.hour = proxy.find('.md-hour');
			proxy.el.minute = proxy.find('.md-minute');
			proxy.el.ampm = proxy.find('.md-ampm-toggle');
			proxy.currentView = 'hours';
			canvas.on(mousedownEvent, mousedown);
		};
		proxy.el.years = proxy.find('.year');
		proxy.el.months = proxy.find('.month');
		proxy.el.days = proxy.find('.day');
		proxy.el.buttons = proxy.find('.md-buttons');
		proxy.el.weekday = proxy.find('.weekday');
		proxy.el.month_wrap = proxy.find('.md-months');
		proxy.el.current = proxy.find(".md-current-month");
		proxy.el.next = proxy.find(".md-next-month");
		proxy.el.prev_next_btns = proxy.find(".md-next").add(proxy.find(".md-previous"));
		proxy.el.select_month = proxy.find(".month-select");
		proxy.el.select_year = proxy.find(".year-select");
		proxy.el.previous = proxy.find(".md-previous-month");
		proxy.el.prev_next_btns.on('click', prev_next);
		proxy.on('click', '.month-select>span, .year-select>span', function(event) {
			if ($(this).data('month')===undefined) {
				proxy.date.setYear($(this).text());
				proxy.el['select_year'].off();
			} else {
				proxy.date.setMonth($(this).data('month'));
				proxy.el['select_month'].off();
			}
			if (proxy.range) {
				if (proxy.set=='start'&&proxy.end.date<=proxy.date||proxy.set=='end'&&proxy.start.date>=proxy.date) {
					var select = (proxy.set=='start') ? 'end':'start';
					proxy.date=new Date(proxy[select].date);
				}
			};
			update_view();
			createMonthview('current');
			$(this).parents('.md-select-wrap').addClass('animate').removeClass('inview').off(transitionend);
			createMonthview('previous');
			createMonthview('next');
		});
		proxy.el.months.on('click', function(event) {
			show_select('month');
		});
		proxy.el.years.on('click', function(event) {
			show_select('year');
		});
		proxy.on('click', '.md-week span', function(event) {
			proxy.el.month_wrap.find(".md-selecteddate").removeClass('md-selecteddate');
			// $(this).addClass('md-selecteddate')
			proxy.el.month_wrap.find('span:matches('+$(this).text()+')').addClass('md-selecteddate');
			proxy.date.setDate($(this).text());
			update_view();
		});

		proxy.on('click', '.md-toggle-state', function(event) {
			proxy.toggleClass('clockpicker', !proxy.hasClass('clockpicker'));
		});
		proxy.on('click', '.md-minute, .md-hour', function(event) {
			timepicker_change(event);
		});
		proxy.on('click', '.md-pm, .md-am', function() {
			toggleAM();
		});
		function toggleAM(){
			proxy.toggleClass('pm', !proxy.hasClass("pm"));
			var value = parseInt(proxy.el.hour.text());
				value = proxy.hasClass('pm') ? (value+12==24) ? 12 : (value+12) : (value==0) ? 0 : (value-12);
			proxy.el.hour.text(value.pad(2));

			proxy.date.setHours(value.pad(2));
		}
		var that = this,
			container = [];
		return this.each(function() {
			this.initilized = true;
			$(this).on('focus', function(event) {
				event.preventDefault();
				$(container).removeClass('focused')
				$(event.target).addClass('focused');
				that.show(event.target);
			});
			container.push(this);
			if ($(this).is('[data-md-start]')) proxy.start = this;
			if ($(this).is('[data-md-end]')) proxy.end = this;
		}).promise().done(function(){
			proxy.state = 'ready';
			if (container.length>2&&proxy.start) {
				throw new Error("Only one start and one end Date is allowed");
			};
			proxy.container = container;
			console.log(moment.duration(moment()-start1));
		})
	};
})( jQuery, window, document );

function daysInMonth(date) {
    return new Date(date.getDateParts().year, date.getDateParts().month+1, 0).getDateParts().day;
}
function startDay(date) {
    return new Date(date.getDateParts().year, date.getDateParts().month, 1).getDateParts().weekday;
}

Number.prototype.remap = function(low1, high1, low2, high2){
	return low2 + (this - low1) * (high2 - low2) / (high1 - low1)
}
Date.prototype.getDateParts = function(){
	return {year: this.getFullYear(), month: this.getMonth(), hours: this.getHours(), minutes: this.getMinutes(), day: this.getDate(), weekday: this.getDay()};
};
Date.prototype.loc = function(lang, options){
	if (toLocaleStringSupports()) {
		return this.toLocaleString(lang, options);
	} else {
		return locale[lang.split('-')[0]][Object.keys(options)[0]][this.getDateParts()[Object.keys(options)]];
	}
};
Element.prototype.setProperties = function(props) {
	'use strict'
	for (var prop in props) {
		if (props.hasOwnProperty(prop)) {
			if (!(this instanceof SVGElement)) {
				this[prop] = props[prop];
			}
			if (this[prop]!=props[prop]) this.setAttribute(prop,props[prop]);
		}
	}
	return this;
};
Number.prototype.pad = function(size) {
	var s = String(this);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
};
String.prototype.pad = function(size) {
	var s = String(this);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
};
$.expr[':'].matches = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().match("^" + arg + "$");
    };
});
function toLocaleStringSupports() {
	try {
		new Date().toLocaleString('i');
	} catch (e) {
		return (e.name==='RangeError');
	}
	return false;
}

