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
/*===========================================================
	DEFINE ALL COMPONENTS OF THE GAME
===========================================================*/
(function(){
//scope so as to avoid conflicts with global variables
	var ctx = null;
	window.requestAnimFrame = (function(){
		return window.requestAnimationFrame	||
		window.webkit.requestAnimationFrame ||
		window.moz.requestAnimationFrame ||
		window.o.requestAnimationFrame ||
		window.ms.requestAnimationFrame ||
		function(callback){
			window.setTimeOut(callback,1000/60);
		};
	})();
	var Game = {
		canvas: document.getElementById("canvas"),
		setup: function(){
			//SET CONTEXT IF DETECTED
			if (canvas.getContext){
				this.ctx = this.canvas.getContext('2d');
				this.width = this.canvas.width;
				this.height = this.canvas.height;
				this.init();
				Ctrl.init();
			}
		},
		init: function(){
			Background.init();
			Bricks.init();
			Paddle.init();
			Ball.init();
		},
		draw: function(){
			//clear rect will clear the drawing board each time update occurs
			ctx.clearRect(0,0,this.width,this.height);
			Background.draw();
			Bricks.draw();
			Paddle.draw();
			Ball.draw();
		},
		animate: function() {
			Game.play = Game.requestAnimFrame(Game.animate);
			Game.draw();
		}	
	}
	//define objects to avoid reference errors.
	var Background= {
		init: function(){
			this.ready = false;
			this.img = new Image();
			this.img.src = "background.jpeg";
			this.img.onload = function(){
				Background.ready = true;
			}
		},
		draw: function(){
			if(this.ready){
				ctx.drawImage(this.img,0,0);
			}
		}
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
	//only setup game when index.html loaded else program may crash.
	window.onload = function(){
		Game.setup();
	};
}());