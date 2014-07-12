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
			this.ready = true;
			this.img = new Image();
			this.img.src = "space.jpeg";
			this.img.onload = function(){
				Background.ready = false;
			}
		},
		draw: function(){
			if(this.ready){
				Game.ctx.drawImage(this.img,0,0);
			}
		}
	}
	
	var Bricks= {
		//add the bricks dynamically
		col: 5,
		gap: 2,
		w: 60,
		h: 15,
		init: function(){
			this.row = 3;
			this.total = 0;
			this.count =[this.row];
			for(var i = this.row;i--;){
				this.count[i] = [this.col];
			}
		}, 
		gradient: function(row){
			switch(row){
				case 0:
					return this.gradientPurple ?
						this.gradientPurple:
						this.grandientPurple = this.makeGradient(row,'#bd06f9','#9604c7');
				case 1:
					return this.gradientRed ? 
						this.gradientRed:
						this.gradientRed = this.makeGradient(row,'#f9064a','#c7043b');
				case 2: 
					return this.gradientGreen ?
						this.gradientGreen:
						this.gradientGreen = this.makeGradient(row,'#05fa15','#04c711');
				default:
					return this.gradientOrange ?
						this.gradientOrange: 
						this.gradientOrange = this.makeGradient(row,'#faa105','#c77f04');
			}
		},
		makeGradient: function(row,color1,color2){
			var y = this.y(row);
			var grad = Game.ctx.createLinearGradient(0,y,0,y+this.h);
			grad.addColorStop(0,color1);
			grad.addColorStop(1,color2);
			return grad;
		},
		draw: function(){
			var i,j;
			for (i=this.row;i--;){
				for(j=this.col;j--;){
					if(this.count[i][j]!==false){
						Game.ctx.fillStyle = this.gradient(i);
						Game.ctx.fillRect(this.x(j),this.y(i),this.w,this.h);
					}
				}
			}
		},
		x: function(row){
			return (row*this.w)+(row*this.gap);
		},
		y: function(col){
			return (col*this.h) + (col*this.gap);
		}
	}
	var Paddle= {
		init:function(){},
		draw:function(){}
	}
	var Ball= {
		r : 10,
		init:function(){
			this.x =120;
			this.y=120;
			this.sx = 2;
			this.sy=-2;
		},
		draw: function(){
			this.edges();
			this.collide();
			this.move();
			Game.ctx.beginPath();
			Game.ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
			Game.ctx.closePath();
			Game.ctx.fillStyle= '#eee';
			Game.ctx.fill();
		},
		edges: function(){},
		collide: function(){},
		move:function(){}
	}
	var Ctrl = {
		init:function(){}
	};

	//only setup game when index.html loaded else program may crash.
	window.onload = function(){
		Game.setup();
		Game.init();
		Bricks.init();
		Bricks.draw();
		Ball.init();
		Ball.draw();
		console.log(Game.canvas);
		console.log(Game.ctx);
		console.log(Game.width);
		console.log(Background.ready);
	};
}());