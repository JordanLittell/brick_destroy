//verify to see if browser supports canvas contenxt 
//if so assign context to it
var canvas = document.getElementById('canvas');
if (canvas.getContext && canvas.getContext('2d')){
	var ctx = canvas.getContext('2d');
}
else {
	console.log("Canvas not detected.");
	}

//create engine components 

//our game consists of paddle, bricks, and ball
//renderer, initialization

(function(){
//scope so as to avoid conflicts with global variables
	var ctx = null;

	var Game = {
		canvas: document.getElementById("canvas"),
		setup: function(){
			if (canvas.getContext){
				this.ctx = this.canvas.getContext('2d');
				this.width = this.canvas.width;
				this.height = this.canvas.height;
				this.init();
				Ctrl.init();
			}
		},
		animate: function() {

		},
		draw: function(){
			//clear rect will clear the drawing board each time update occurs
			ctx.clearRect(0,0,this.width,this.height);
			Background.draw();
			Bricks.draw();
			Paddle.draw();
			Ball.draw();
		},
		init: function(){
			Background.init();
			Bricks.init();
			Paddle.init();
			Ball.init();
		}	
	}
	var Background= {
		init: function(){},
		draw: function(){},
	}
	var Bricks= {
		init: function(){},
		draw: function(){},
	}
	var Paddle= {
		init: function(){},
		draw: function(){},
	}
	var Ball= {
		init: function(){},
		draw: function(){},
	}
	var Ctrl = {
		init:function(){}
	};
	window.onload = function(){
		Game.setup();
	};
}());