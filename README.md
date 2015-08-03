# Material Design Datepicker
Material Design inspired date- and timepicker.

## Usage
```js
$(document).ready(function() {
	$("input.datepicker").md_datepicker({
		format: 'DD.MM.YYYY HH:mm [Uhr]'
	});
});
```
## Properties
###language
###theme
**dark or light**
additonally there are some colors to combine with the two themes
-red
-pink
-deep_purple
-indigo
-blue
-teal
-green
-light_green
-amber
-orange
-grey
-blue_grey

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