# Material Design Datepicker
Material Design inspired date- and timepicker.

## Usage
```html
		<link rel="stylesheet" href="md-datepicker/dist/md-datepicker.min.css">
	</head>
	<body>
		<input type="text" id="birthday" class="datepicker" name="birthday">

		<script src="md-datepicker/dist/md-datepicker.min.js"></script>
	</body>
```
```js
$(document).ready(function() {
	$("input.datepicker").md_datepicker({
		format: 'DD.MM.YYYY HH:mm [Uhr]'
	});
});
```
###Daterange
```html
	<input type="text" id="start-date" class="datepicker" name="start-timestamp" data-md-start>
	<input type="text" id="end-date" class="datepicker" name="end-timestamp"  data-md-end>
```

## Properties
###language
###theme
**dark or light**


additonally there are some colors to combine with the two themes
-	red
-	pink
-	deep_purple
-	indigo
-	blue
-	teal
-	green
-	light_green
-	amber
-	orange
-	grey
-	blue_grey

**Example:**
```js
	$("input.datepicker").md_datepicker({
		theme: 'dark red'
	});
```
###timepicker
**true or false**
###autoclose
**true or false**

Automatic closing the datepicker after input

###_24h
###format
###animated
###submit
###custom_class