var id=0;
(function ( $, window, document, undefined ) {
	$.fn.md_datepicker = function(options) {
		"use strict";
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
			color: null,
			_24h:false,
			format: null,
			animated: true,
			submit:'string',
			custom_class:''
		},
		touchSupported = 'ontouchstart' in window,
		mousedownEvent = 'mousedown' + ( touchSupported ? ' touchstart' : ''),
		mousemoveEvent = 'mousemove.lolliclock' + ( touchSupported ? ' touchmove.lolliclock' : ''),
		mouseupEvent = 'mouseup.lolliclock' + ( touchSupported ? ' touchend.lolliclock' : ''),
		today = new Date(),
		settings = $.extend( {}, defaults, options ),
		weekdaynumber = [0,1,2,3,4,5,6],
		parts = weekdaynumber.splice(-settings.startday),
		weekdaynumber = parts.concat(weekdaynumber);
		settings.language = (settings.language) ? settings.language : navigator.language || navigator.userLanguage;
		today.setSeconds(0);
		if (settings.format) {
			var delimiter 	= settings.format.match(/\W/),
				format 		= settings.format.split(' ')[0].split(delimiter).reverse();

			$.each(settings.format.split(' ')[1].split(':'), function(index, val) {
				 format.push(val)
			});

		};

		for (var i = 0,temp_day, day_array = []; i < 7; i++) {
			temp_day = new Date(2015, 1, i);
			day_array[temp_day.g()] = temp_day.toLocaleString(settings.language, {weekday: 'short'}).replace(".","")
		};
		parts 	 = day_array.splice(0, settings.startday);
		var weekdays = day_array.concat(parts),
			day_template = "",
			weektemplate = "";

		$.each(weekdays, function(index, val) {
			weektemplate+= '<span>'+val+'</span>';
		});

		for (var i = 0,temp_day, month_array = [], month_template=""; i < 12; i++) {
			temp_day = new Date(2015, i, 1);
			month_array[i] = temp_day.toLocaleString(settings.language, {month: 'long'})
			month_template+='<span data-month="'+i+'">'+month_array[i]+'</span>'
		};
		for (var i = 0,temp_day, year_template="", today_year = today.g(1); i < 100; i++) {
			year_template+='<span>'+(today_year-i)+'</span>'
		};

		var submit_values = $(this);
		submit_values.each(function() {
			var timestamp = this.cloneNode(true);
			timestamp.type = 'hidden';
			timestamp.className = '';
			timestamp.output = this;
			this.readOnly =true;
			timestamp.id = this.id+'-timestamp';
			if (settings.submit=='timestamp') {
				this.name ="";
			} else {
				timestamp.name ="";
			}
			this.timestamp = timestamp;
			this.parentNode.appendChild(timestamp);
			this.onchange = function(e){
				if (this.value!='') {
					this.timestamp.value = moment(this.value, settings.format).unix();
					this.date = new Date(moment(this.value, settings.format).unix());
				}
				else {
					this.timestamp.value = 0;
					this.timestamp.date = undefined;
				}
			}
			this.timestamp.onchange = function(e){
				var timestamp_value = Number(this.value*1000),
				old_function = timestamp.output.onchange;
				timestamp.output.onchange = null;

				if (this.value=='') {
					timestamp.output.value = '';
					timestamp.output.date = undefined;
				} else {
					timestamp.output.value = moment(timestamp_value).format(settings.format);
					timestamp.output.date = new Date(timestamp_value);
				}
				$(timestamp.output).change();
				timestamp.output.onchange = old_function;
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
			function createTick(dialRadius, radian, tickRadius, num, scale){
				return '<div class="lolliclock-tick" style="left:'+(dialRadius + Math.sin(radian) * (radius * scale) - tickRadius).toFixed(2)+'px;top:'+(dialRadius - Math.cos(radian) * (radius*scale) - tickRadius).toFixed(2)+'px">'+num+'</div>';
			}
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
			'<i class="md-toggle-state no-hover">event</i>'+
			'</div>'+
			'<div class="md-clock">'+
				'<div class="md-hours">'+hour_tmpl+'</div>'+
				'<div class="md-minutes">'+min_tmpl+'</div>'+
			'</div>'+
			'</div>',
			svgNS = 'http://www.w3.org/2000/svg';

			function createSvgElement(name) {
				return document.createElementNS(svgNS, name);
			}
			// Draw clock SVG
			var svg = createSvgElement('svg');
			svg.setAttribute('class', 'lolliclock-svg');
			svg.setAttribute('width', diameter);
			svg.setAttribute('height', diameter);
			var g = createSvgElement('g');
			g.setAttribute('transform', 'translate(' + dialRadius + ',' + dialRadius + ')');
			var bearing = createSvgElement('circle');
			bearing.setAttribute('class', 'lolliclock-bearing');
			bearing.setAttribute('cx', 0);
			bearing.setAttribute('cy', 0);
			bearing.setAttribute('r', 5);
			var hand = createSvgElement('line');
			hand.setAttribute('x1', 0);
			hand.setAttribute('y1', 0);
			var bg = createSvgElement('circle');
			bg.setAttribute('class', 'lolliclock-canvas-bg');
			bg.setAttribute('r', 20);
			var fg = createSvgElement('circle');
			fg.setAttribute('class', 'lolliclock-canvas-fg');
			fg.setAttribute('r', 3.5);
			g.appendChild(hand);
			g.appendChild(bg);
			g.appendChild(fg);
			g.appendChild(bearing);
			svg.appendChild(g);


			var mousedown = function (e) {
				var offset = canvas.offset(),
				isTouch = /^touch/.test(e.type),
				x0 = offset.left + dialRadius,
				y0 = offset.top + dialRadius,
				dx = (isTouch ? e.originalEvent.touches[0] : e).pageX - x0,
				dy = (isTouch ? e.originalEvent.touches[0] : e).pageY - y0,
				z = Math.sqrt(dx * dx + dy * dy),
				moved = false;

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

				// Mousemove on document
				$(document).off(mousemoveEvent).on(mousemoveEvent, function (e) {
					e.preventDefault();
					var isTouch = /^touch/.test(e.type),
					x = (isTouch ? e.originalEvent.touches[0] : e).pageX - x0,
					y = (isTouch ? e.originalEvent.touches[0] : e).pageY - y0;
					if (!moved && x === dx && y === dy) {
						// Clicking in chrome on windows will trigger a mousemove event
						return;
					}
					moved = true;
					setHand(x, y);
				});

				// Mouseup on document
				$(document).off(mouseupEvent).on(mouseupEvent, function (e) {
					e.preventDefault();
					var isTouch = /^touch/.test(e.type),
					x = (isTouch ? e.originalEvent.changedTouches[0] : e).pageX - x0,
					y = (isTouch ? e.originalEvent.changedTouches[0] : e).pageY - y0;
					if (x === dx && y === dy) {
						setHand(x, y);
					}
					if (proxy.currentView === 'hours') {
						// this.toggleView('minutes', duration / 2);
						timepicker_change(true);
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
		((settings.timepicker) ? '<i class="md-toggle-state no-hover">access_time</i>':'')+
		'</div>'+
		'<div class="md-datepick-month">'+
		'<i class="md-previous md-touchtarget no-hover">navigate_before</i><i class="md-next md-touchtarget no-hover">navigate_next</i>'+
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
		'<div class="md-button-flat button-delete">Löschen</div>'+
		'<div class="md-button-flat button-cancel">Abbrechen</div>'+
		'<div class="md-button-flat button-ok">OK</div>'+
		'</div>'+
		'</div>';
		var setHand = function (x, y) {
			//Keep radians postive from 1 to 2pi
			var radian = Math.atan2(-x, y) + Math.PI;
			var isHours = proxy.currentView === 'hours';
			var unit = Math.PI / (isHours ? 6 : 30);
			var value;

			// Get the round value
			value = Math.round(radian / unit);
			// Get the round radian
			radian = value * unit;

			// Correct the hours or minutes
			if (isHours) {
				if (value === 0) {
					value = 12;
				}
				proxy.fg.style.visibility = 'hidden';
				proxy.el.hour.text(proxy.hasClass('pm') ? (value+12==24) ? 12 : (value+12).pad(2) : (value==12) ? '00' : (value).pad(2));

				proxy.date.setHours(proxy.el.hour.text());
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
				proxy.el.minute.text(value.pad(2));
				proxy.date.setMinutes(proxy.el.minute.text());
			}
			// Once hours or minutes changed, vibrate the device
			var ticks = (proxy.currentView=="hours") ? proxy.ticks.hours : proxy.ticks.minutes;
			ticks.each(function(index, el) {
				$(el).toggleClass('active', $(el).text()==value);
			});

			proxy.g.insertBefore(proxy.hand, proxy.bearing);
			proxy.g.insertBefore(proxy.bg, proxy.fg);
			proxy.bg.setAttribute('class', 'lolliclock-canvas-bg');

			// Set clock hand and others' position
			var cx = Math.sin(radian) * radius,
			cy = -Math.cos(radian) * radius;
			proxy.hand.setAttribute('x2', Math.sin(radian) * (radius - tickRadius));
			proxy.hand.setAttribute('y2', -Math.cos(radian) * (radius - tickRadius));
			proxy.bg.setAttribute('cx', cx);
			proxy.bg.setAttribute('cy', cy);
			proxy.fg.setAttribute('cx', cx);
			proxy.fg.setAttribute('cy', cy);
		};
		var locate = function(input){
			var pos = $(input).offset(), width = proxy.width(), height = proxy.height();
			pos.top = (pos.top+height+8>=window.innerHeight) ? window.innerHeight-height-8 : pos.top;
			pos.left = (pos.left+width+8>=window.innerWidth) ? window.innerWidth-width-8 : pos.left;
			return pos;
		}
		this.show = function(input){
			var date_str = (input.value!='') ? (settings.format) ?  moment(input.value, settings.format) : moment(input.value) : moment(),
				pos 	 = locate(input);

			proxy.date = new Date(date_str);
			proxy.set = (proxy.start==input) ? 'start' : 'end';
			proxy.date = (isNaN(proxy.date.getTime())) ? new Date() : proxy.date;
			proxy.range = validRange();
			proxy.el.prev_next_btns.removeClass('disabled');

			createMonthview('current');
			createMonthview('previous');
			createMonthview('next');
			update_view();

			if (settings.animated) {
				proxy.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
					proxy.addClass('animate');
					proxy.off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd')
				});
				if (proxy.hasClass('clockpicker')) {
					proxy.removeClass('clockpicker');
					proxy.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', '.md-datepicker-views', function(event) {
						event.preventDefault();
							$(proxy).css({
								top: pos.top,
								left: pos.left
							}).off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd')
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
					$(input).val(proxy.date.g(1)+'-'+(proxy.date.g(2)+1).pad(2)+'-'+proxy.date.g(3).pad(2)).change();
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
			$(window).on('resize', function(event) {
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
			$(window).off('resize');
		}
		var update_view = function(){
			if (proxy.range) {
				var select = (proxy.set=='start') ? 'end':'start';
				var elem = $('.md-select-wrap>span:matches('+proxy[select].date.g(1)+')')

				if (proxy.start.date&&proxy.start.date.g(1)==proxy.date.g(1)&&select=='start'||proxy.end.date&&proxy.end.date.g(1)==proxy.date.g(1)&&select=='end'){
					$(proxy.el.prev_next_btns[proxy.set=='start'|0]).toggleClass('disabled', proxy[select].date.g(2)==proxy.date.g(2));
					elem.push(($('.md-select-wrap>span[data-month='+proxy[select].date.g(2)+']'))[0]);
				}
				proxy.find('.md-select-wrap>span').removeClass('disabled');
				if (proxy.set=='end') {
					$(elem[1]).prevAll().addClass('disabled');
					$(elem[0]).nextAll().addClass('disabled');
				} else {
					$(elem[0]).prevAll().addClass('disabled');
					$(elem[1]).nextAll().addClass('disabled');
				}
			};

			proxy.el.months.text(proxy.date.toLocaleString(settings.language, {month: 'long'}));
			proxy.el.years.text(proxy.date.g(1));
			proxy.el.days.text(proxy.date.g(3));
			proxy.el.weekday.text(proxy.date.toLocaleString(settings.language, {weekday: 'short'}).replace(".",""));

			if (settings.timepicker) {
				proxy.removeClass('minute');
				proxy.currentView = "hours";

				proxy.toggleClass('pm', proxy.date.g(4)>=12);
				proxy.el.hour.text(proxy.date.g(4).pad(2));
				proxy.el.minute.text(proxy.date.g(5).pad(2));

	      		var radian = (proxy.date.g(4)) * (Math.PI / 6),
				x = Math.sin(radian) * radius,
				y = -Math.cos(radian) * radius;
				setHand(x, y);
			};
		};
		var timepicker_change = function(event){
			proxy.toggleClass('minute', !$(event.target).is(".md-hour"));
			proxy.currentView = (!$(event.target).is(".md-hour")) ? "minutes" : "hours";
      		var radian = (!$(event.target).is(".md-hour") ? proxy.el.minute.text() : proxy.el.hour.text()) * (Math.PI / (proxy.currentView === 'hours' ? 6 : 30)),
			x = Math.sin(radian) * radius,
			y = -Math.cos(radian) * radius;
			setHand(x, y);
		}
		var show_select = function(view){
			var elem = (view=='year') ? $('.md-select-wrap>span:matches('+proxy.date.g(1)+')') : $('.md-select-wrap>span[data-month='+proxy.date.g(2)+']');
			if (!elem.length) {
				var run = proxy.date.g(1)-Number(proxy.el.select_year.children(':first-child').text());
				for (var i = 1, lastyear=Number(proxy.el.select_year.children(':first-child').text()); i <= run; i++) {
					proxy.el.select_year.prepend('<span>'+(lastyear+i)+'</span>');
				};
				elem = $('.md-select-wrap>span:matches('+proxy.date.g(1)+')');
			};
			var offset = elem.position().top;

			proxy.el['select_'+view].children('span').removeClass('md-currentdate')
			if (view=='year') $('.md-select-wrap>span:matches('+proxy.date.g(1)+')').addClass('md-currentdate');
			else $('.md-select-wrap>span[data-month='+proxy.date.g(2)+']').addClass('md-currentdate');

			proxy.el['select_'+view].addClass('inview animate');
	        proxy.el['select_'+view].stop().animate({
        		scrollTop: offset+proxy.el['select_'+view][0].scrollTop-(proxy.el['select_'+view][0].clientHeight-48)/2
        	}, parseInt(Math.abs(offset.remap(0,2000,500,3000))), 'easeInOutExpo');
			proxy.el['select_'+view].on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
				proxy.el['select_'+view].removeClass('animate');
			});
			proxy.el['select_'+view].on('mousewheel', function(event) {
				proxy.el['select_'+view].stop();
			});
		};
		var changeMonth = function(direction){
			var animate = (proxy.range) ? (direction=="next") ? (proxy.set=='start'&&proxy.date.g(2)<proxy.end.date.g(2)||proxy.set=='start'&&proxy.date.g(1)!=proxy.end.date.g(1)||proxy.set=='end') : (proxy.set=='end'&&proxy.date.g(2)>proxy.start.date.g(2)||proxy.set=='end'&&proxy.date.g(1)!=proxy.start.date.g(1)||proxy.set=='start'): true;
			var select = (proxy.set=='start') ? 'end':'start';

			if (animate) {
				proxy.el.prev_next_btns.off('click');
				proxy.el.month_wrap.addClass('animate '+ direction);

				if (direction=="next") {
					proxy.date.setMonth(proxy.date.g(2)+1);
				} else {
					proxy.date.setMonth(proxy.date.g(2)-1);
				}

				if (proxy.range&&proxy.set=='start'&&proxy.end.date<=proxy.date||proxy.range&&proxy.set=='end'&&proxy.start.date>=proxy.date) {
					proxy.date=new Date(proxy[select].date);
					updateMonthviews();
				}
				update_view();

				proxy.el.month_wrap.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
					proxy.el.current.html(proxy.el[direction].html());
					proxy.el.month_wrap.removeClass('animate '+ direction);
					createMonthview('next');
					createMonthview('previous');
					proxy.el.month_wrap.off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
					proxy.el.prev_next_btns.on('click', prev_next);
				});
			};
		};
		var updateMonthviews = function(){
			var view = ['next', 'previous'];
			for (var i = view.length - 1; i >= 0; i--) {
				console.log(proxy.el[view[i]])
				proxy.el[view[i]].find('.md-selecteddate').removeClass('md-selecteddate');
				proxy.el[view[i]].find('span:matches('+proxy.date.g(3)+')').addClass('md-selecteddate');
			};
		}

		function validRange(){
			if (proxy.start&&proxy.end) {
				return (proxy.date!=undefined&&proxy[((proxy.set=='start')?'end':'start')].date!=undefined);
			} else return false;
		}
		var createMonthview = function(view) {
			var month = proxy.date.g(2),
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
			var isSameYearMonth = (today.g(2)==tempdate.g(2)&&today.g(1)==tempdate.g(1)),
				setting 		= (proxy.set=='start') ? 'end':'start';
			if (proxy.range) var isSameStartEnd 	= (tempdate.g(2)==proxy[setting].date.g(2)&&tempdate.g(1)==proxy[setting].date.g(1));
			for (var i = 1; i <= dim; i++) {
				classes = [];
				if (proxy.date.g(3)==i) classes.push('md-selecteddate');
				if (today.g(3)==i&&isSameYearMonth) classes.push('md-currentdate');
				if (proxy.range&&proxy.set=='start'&&i>proxy.end.date.g(3)&&isSameStartEnd||proxy.range&&proxy.set=='end'&&i<proxy.start.date.g(3)&&isSameStartEnd) classes.push('disabled');

				days+="<span"+((classes.length>=1) ? ' class="'+classes.join(" ")+'"' : ''  )+" >"+i+"</span>"
			};
			proxy.el[view].find('.md-month-display').text(tempdate.toLocaleString(settings.language, {month: 'long'}))
			proxy.el[view].find('.md-year-display').text(tempdate.g(1))
			proxy.el[view].find('.md-week').html(days);
		};
		function prev_next() {
			changeMonth(this.className.split(' ')[0].split('-')[1]);
		}
		var proxy = $(template).appendTo("body");
		proxy.el = {};
		if (settings.timepicker) {
			var canvas = proxy.find('.md-clock');
			canvas.append(svg);
			proxy.hand = hand;
			proxy.bg = bg;
			proxy.fg = fg;
			proxy.bearing = bearing;
			proxy.g = g;
			proxy.canvas = canvas;
			proxy.ticks = {};
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
			$(this).parents('.md-select-wrap').addClass('animate').removeClass('inview').off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
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
			$(".md-selecteddate").removeClass('md-selecteddate');
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
		proxy.on('click', '.md-pm, .md-am', function(event) {
			proxy.toggleClass('pm', !$(event.target).is(".md-am"));
			var value = parseInt(proxy.el.hour.text());
				value = proxy.hasClass('pm') ? (value+12==24) ? 12 : (value+12) : (value==0) ? 0 : (value-12);
			proxy.el.hour.text(value.pad(2));

			proxy.date.setHours(value.pad(2));
		});

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
		})
	};
	$.fn.md_datepicker.version =  "1.4.1-dev";
})( jQuery, window, document );

function daysInMonth(date) {
    return new Date(date.g(1), date.g(2)+1, 0).g(3);
}
function startDay(date) {
    return new Date(date.g(1), date.g(2), 1).g();
}

Number.prototype.remap = function(low1, high1, low2, high2){
	return low2 + (this - low1) * (high2 - low2) / (high1 - low1)
}
Date.prototype.g = function(v){
	return (v==1)?this.getFullYear():(v==2)?this.getMonth():(v==4)?this.getHours():(v==5)?this.getMinutes():(v==3)?this.getDate():this.getDay();
};
Number.prototype.pad = function(size) {
	var s = String(this);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
}
String.prototype.pad = function(size) {
	var s = String(this);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
}

$.expr[':'].matches = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().match("^" + arg + "$");
    };
});

$(document).ready(function() {
	$("input.datepicker").md_datepicker({
		timepicker:true,
		theme: 'dark red',
		submit: 'timestamp',
		// _24h:true,
		format: 'DD.MM.YYYY HH:mm [Uhr]'
	});
});