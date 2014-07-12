//verify to see if browser supports canvas contenxt 
//if so assign context to it

//create engine components 

//our game consists of paddle, bricks, and ball
//renderer, initialization
/*===========================================================
	DEFINE ALL COMPONENTS OF THE GAME
===========================================================*/
// (function(){
// //scope so as to avoid conflicts with global variables
// 	var ctx = null;
// 	window.requestAnimFrame = (function(){
// 		return window.requestAnimationFrame	||
// 		window.webkit.requestAnimationFrame ||
// 		window.moz.requestAnimationFrame ||
// 		window.o.requestAnimationFrame ||
// 		window.ms.requestAnimationFrame ||
// 		function(callback){
// 			window.setTimeOut(callback,1000/60);
// 		};
// 	})();

	(function() {
	var ctx = null;
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
	var Game = {
		canvas: document.getElementById("canvas"),
		setup: function(){
			//SET CONTEXT IF DETECTED
			if (canvas.getContext){
				ctx = this.canvas.getContext('2d');
				this.width = this.canvas.width;
				this.height = this.canvas.height;
				this.init();
				Ctrl.init();
			}
		},
		init: function(){
			Bricks.init();
			Paddle.init();
			Ball.init();
			Background.init();
			this.animate();
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
			Game.play = requestAnimationFrame(Game.animate);
			Game.draw();
		}	
	};

	//define objects to avoid reference errors.
	var Background= {
		init: function(){
			this.ready = false;
			this.img = new Image();
			this.img.src = "space.jpeg";
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
			var grad = ctx.createLinearGradient(0,y,0,y+this.h);
			grad.addColorStop(0,color1);
			grad.addColorStop(1,color2);
			return grad;
		},
		draw: function(){
			var i,j;
			for (i=this.row;i--;){
				for(j=this.col;j--;){
					if(this.count[i][j]!==false){
						ctx.fillStyle = this.gradient(i);
						ctx.fillRect(this.x(j),this.y(i),this.w,this.h);
					}
				}
			}
		},
		x: function(row){
			//adjust position by width of brick + space for gap
			return (row*this.w)+(row*this.gap);
		},
		y: function(col){
			//adjust position by height of brick + gap
			return (col*this.h) + (col*this.gap);
		}
	}
	var Paddle= {
		w: 90,
		h:10,
		r:9,
		init:function(){
			//set spawn position
			this.x = 100;
			this.y = Game.height-this.h;
			//speed will come in handy later during animation
			this.speed = 4;
			
		},
		draw:function(){
			ctx.fillStyle= "#CCC";
			ctx.fillRect(this.x,this.y,this.w,this.h);
			this.move();
		},
		move: function(){
			//define bounds for the paddle
			if (this.x+this.w<Game.width && this.x>0) {
				this.x += this.speed;
			}
			
		}
	}
	var Ball= {
		r : 10,
		init:function(){
			this.x =120;
			this.y=120;
			//these refer to the speeds on the x and y axes respectively
			this.sx = 2;
			this.sy=-2;
		},
		draw: function(){
			this.edges();
			this.collide();
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
			ctx.closePath();
			ctx.fillStyle= '#121212';
			ctx.fill();
			this.move();

		},
		collide:function(){
			if(this.x>=Paddle.x&&this.x<=Paddle.x+Paddle.w&&this.y<=Paddle.y+Paddle.h&&this.y>=Paddle.y){
				this.sx=7*((this.x-(Paddle.x-Paddle.w/2))/Paddle.w);
				this.sy=-this.sy;
			}
		},
		//placeholders for configuring ball's movement later on
		edges: function(){
		//set up the boundries of the game
			if(this.y<1){
				//top boundry
				this.y = 1;
				this.sy=-this.sy;
			}
			if(this.y>Game.height){
				//bottom boundry
				this.sy=this.sx=0;
				this.x=this.y=1000;
				Screen.gameover();
				canvas.addEventListener('Click',Game.restartgame,false);
				return;
			}
			if(this.x <1){
				//left boundry
				this.x =1;
				this.sx = -this.sx;
			}
			if(this.x > Game.width){
				//right boundry
				this.x = Game.width -1;
				this.sx=-this.sx;
			}
		},
		
		move:function(){
			
			this.x+=this.sx;
			this.y+=this.sy;

		}
	}
	var Ctrl = {
		init:function(){}
	};
	//only setup game when index.html loaded else program may crash.
	window.onload = function(){
		Game.setup();
	};
}());