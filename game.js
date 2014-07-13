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
	// var ctx = null;
	// window.requestAnimFrame = (function(){
	// 	return window.requestAnimationFrame	||
	// 	window.webkit.requestAnimationFrame ||
	// 	window.moz.requestAnimationFrame ||
	// 	window.o.requestAnimationFrame ||
	// 	window.ms.requestAnimationFrame ||
	// 	function(callback){
	// 		window.setTimeOut(callback,1000/60);
	// 	};
	// })();

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
    var Screen = {
    	welcome: function(){
    		this.text = "CANVAS RICOCHET";
    		this.textSub = "Click to Start";
    		this.textColor = "White";
    		this.create();
    	},
    	create: function(){
    		ctx.fillStyle="black";
    		ctx.fillRect(0,0,Game.width,Game.height);
    		ctx.fillStyle=this.textColor;
    		ctx.textAlign = 'center';
    		ctx.font="30px helvetica, arial";
    		ctx.fillText(this.text,Game.width/2,Game.height/2+10);
    		ctx.fillStyle ="#999999";
    		ctx.font="20px helvetica, arial";
    		ctx.fillText(this.textSub,Game.width/2,Game.height/2+30);
    	},
    	gameover: function(){
			this.text= "Game Over";
			this.textSub="click to retry";
			this.textColor="red";
			this.create();
		}
    }
    var Hud = {
    	init:function(){
    		this.lv=1;
    		this.score=0;
    	},
    	draw:function(){
    		ctx.font='8 px helvetica, arial';
    		ctx.fillStyle="white";
    		ctx.fillText("score: "+ this.score, 40, Game.height-10);
    		ctx.textAlign = 'center';
    		ctx.fillText("lv: "+this.lv, Game.width -20,Game.height -5);
    	}
    }
	var Game = {
		canvas: document.getElementById("canvas"),
		setup: function(){
			//SET CONTEXT IF DETECTED
			if (canvas.getContext){
				ctx = this.canvas.getContext('2d');
				this.width = this.canvas.width;
				this.height = this.canvas.height;
				this.canvas.addEventListener('click',Game.rungame,false);
				Screen.welcome();
				Ctrl.init();
			}
		},
		levelup:function(){
			Hud.lv+=1;
			Bricks.init();
			Ball.init();
			Paddle.init();
		},
		rungame:function(){
			
			Game.canvas.removeEventListener('click',Game.rungame,false);
			Game.init();
			Game.animate();
			
		},
		restartgame: function(){
			Game.canvas.removeEventListener('click',Game.restartgame,false);
			window.cancelAnimationFrame(Game.play);
			Game.init();
		},
		init: function(){
			Hud.init();
			Background.init();
			Ball.init();
			Paddle.init();
			Bricks.init();
			this.animate();
		},
		draw: function(){
			//clear rect will clear the drawing board each time update occurs
			ctx.clearRect(0,0,this.width,this.height);
			Background.draw();
			Hud.draw();
			Bricks.draw();
			Paddle.draw();
			Ball.draw();
		},
		animate: function() {
			Game.play = requestAnimationFrame(Game.animate,ctx);
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
		h: 8,
		init: function(){
			this.row = 2 + Hud.lv;
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
						if(Ball.x<=this.x(j)+this.w &&
							Ball.x>=this.x(j) &&
							Ball.y<=this.y(i)+this.h &&
							Ball.y>=this.y(i)){
							this.collide(i,j);
							continue;
						}
						ctx.fillStyle = this.gradient(i);
						ctx.fillRect(this.x(j),this.y(i),this.w,this.h);
					}
				}
				if(this.total===(this.row*this.col)){
					Game.levelup();
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
		},
		collide: function(i,j){
			Hud.score+=1;
			this.total +=1;
			this.count[i][j]= false;
			Ball.sy = -Ball.sy;
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
			if (Ctrl.left&&this.x<Game.width-this.w/2) {
				this.x += this.speed;
			}
			else if (Ctrl.right && this.x>-this.w/2){
				this.x+= -this.speed;
			}
		}
	}
	var Ball= {
		r : 10,
		init:function(){
			this.x =100;
			this.y=100;
			//these refer to the speeds on the x and y axes respectively
			this.sx = 1+(0.4*Hud.lv);
			this.sy = -1.5-(0.4*Hud.lv);
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
				this.sx=+7*((this.x-(Paddle.x+Paddle.w/2))/Paddle.w);
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
				
				Screen.gameover();
				Game.canvas.addEventListener('click',Game.restartgame,false);
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
		//capture input here 
		init:function(){
			window.addEventListener('keydown',this.keyDown,true);
			window.addEventListener('keyup',this.keyUp,true);
		},
		keyDown:function(event){
			//capture input and move paddle
			switch(event.keyCode){
				case 39:
					Ctrl.left = true;
					break;
				case 37:
					Ctrl.right = true;
					break;
				default:
					break;
			}
		},
		keyUp: function(event){
			//key up will reset Ctrl input monitoring each frame
			switch(event.keyCode){
				case 39:
					Ctrl.left=false;
					break;
				case 37:
					Ctrl.right=false;
					break;
				default:
					break;

			}
		}
	};
	//only setup game when index.html loaded else program may crash.
	window.onload = function(){
		Game.setup();
	};
}());