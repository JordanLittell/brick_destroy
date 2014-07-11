//verify to see if browser supports canvas contenxt 
//if so assign context to it
var canvas = document.getElementById('canvas');
if (canvas.getContext && canvas.getContext('2D')){
	var ctx = canvas.getContext('2D');
}
else {
	console.log("Canvas not detected.");
	}