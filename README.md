# Material Design Datepicker
Material Design inspired date- and timepicker.

##Todo
- [ ] Small device support
- [ ] Better language support
- [ ] Browser testing

## Usage
###Basic
**HTML**
```html
	<link rel="stylesheet" href="md-datepicker/dist/md-datepicker.min.css">
</head>
<body>
	<input type="text" id="birthday" class="datepicker" name="birthday">

	<script src="md-datepicker/dist/md-datepicker.min.js"></script>
</body>
```
**JS**
```js
$(document).ready(function() {
	$("input.datepicker").md_datepicker({
		format: 'DD.MM.YYYY HH:mm [Uhr]'
	});
});
```
###Daterange
Simple add the **data-md-start** and **data-md-end** to the inputs.
Only 2 Inputs are allowed.

**HTML**
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