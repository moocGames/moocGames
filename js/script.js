var canvas, ctx;

var flagL=false, flagR=false, flagU=false;flagD=false;//movement control
var currentChar=0; //the character that is now selected to be controlled by keybord
var maxWidth=document.getElementById('myCanvas').width, maxHeight=document.getElementById('myCanvas').height;
	
var flock=[]; //contains all character objects

//define class of moving objects 
   class Character {
		constructor(name,path,coX,coY,maxX,maxY)
		{
			this.name=name; 
			this.counter=0;this.jFlag=false;this.sFlag=false;this.cFlag=false;//this counter and flags help to control comeHere() and salto() functions
			this.path=path;
			this.CharX=coX;
			this.CharY=coY;
			this.CharAngle=0;this.scaleX=0.1;this.scaleY=0.1;this.vh=0;this.vv=0;this.acc=1;this.direction=1;
			this.maxX=maxX;
			this.maxY=maxY;
			this.imageChar=new Image();
			this.imageChar.src=path+".png";
			this.imageChar.onload= function() {};
			this.helloAudio=new Audio(path+"_hello.wav");
			this.stepAudio=new Audio(path+"_step.wav");
			this.jupiAudio=new Audio(path+"_jump.wav");
		}
		
		speak()
		{
			console.log("my name is "+this.name+", image: "+this.imageChar.src);
		}
	
		go()
		{
			if((this.CharX<this.maxX||this.vh<0)&&(this.CharX>0||this.vh>0))
			{
				this.CharX +=this.acc*this.vh;
				if(this.CharX%10<5&&(this.CharAngle>-0.1))
				{
					this.CharAngle -=0.02;
				}
				else if(this.CharAngle<0.1)
				{
					this.CharAngle +=0.02;
				}
			}			
			//up/down
			if((this.CharY>0||this.vv>0)&&(this.CharY<this.maxY||this.vv<0)) 
			{
				this.CharY +=this.acc*this.vv;
			}
			
		}
	
   
   }

for(var i=0;i<characters.length;i++)
   {
		var path=characters[i]+"/"+characters[i];
		flock[i]=new Character(characters[i],path,400+i*20,405,maxWidth,maxHeight);
		document.body.appendChild(flock[i].helloAudio);
		document.body.appendChild(flock[i].stepAudio);
		document.body.appendChild(flock[i].jupiAudio);
   }
   



function init() {
  
  var buttons =  document.getElementById('nav'); 
     for (var i=0; i < characters.length; i++) {
      var input = document.createElement('button');

      input.setAttribute('id', 'bu'+i);
      input.setAttribute('class', 'unsel');
      input.setAttribute('onclick', 'flipChar('+i+')');
      input.textContent = characters[i];
 
      buttons.appendChild(input);
    }
   
   
     // Call this function when body is loaded
     // Get canvas
     canvas = document.getElementById('myCanvas');
     // Get context
     ctx=canvas.getContext('2d');
     // Add key listeners
     canvas.addEventListener('keydown', handleKeydown, false);
     canvas.addEventListener('keyup', handleKeyup, false);
    
	
     requestId = requestAnimationFrame(animationLoop);
}
   
   
 function handleKeydown(evt) {
     if (evt.keyCode === 37) {
        //left key 
		flagL=true;flock[currentChar].stepAudio.play();
     } else if (evt.keyCode === 39) {
        // right key
		flagR=true;flock[currentChar].stepAudio.play();
	   } else if (evt.keyCode === 38) {
        // up key
		flagU=true;flock[currentChar].stepAudio.play();
	   } else if (evt.keyCode === 40) {
        // up key
		flagD=true;flock[currentChar].stepAudio.play();
	   }else if (evt.keyCode === 32) {
        // space
		flock[currentChar].acc=4;flock[currentChar].stepAudio.playbackRate = 4.0;flock[currentChar].stepAudio.play();
	   } else if (evt.keyCode === 17) {
        // ctrl
		flock[currentChar].imageChar.src=characters[currentChar]+"/"+characters[currentChar]+'2.png';
       flock[currentChar].imageChar.onload = function() {}
		}  else if (evt.keyCode === 18) {
			flock[currentChar].sFlag=true;flock[currentChar].jupiAudio.play();
		}else if (evt.keyCode === 74) {
			flock[currentChar].jFlag=true;flock[currentChar].jupiAudio.play();
		}
}
   
   
 function handleKeyup(evt) {
     if (evt.keyCode === 37) {
        //left key 
		flagL=false;flock[currentChar].CharAngle=0;
     } else if (evt.keyCode === 39) {
        // right key
		flagR=false;flock[currentChar].CharAngle=0;
	   } else if (evt.keyCode === 38) {
        // up key
		flagU=false;
	   } else if (evt.keyCode === 40) {
        // up key
		flagD=false;
	   }
	   else if (evt.keyCode === 32) {
        // space
		flock[currentChar].acc=1;flock[currentChar].stepAudio.playbackRate = 1.0;
	   }
	   else if (evt.keyCode === 17) {
        // ctrl
		flock[currentChar].imageChar.src=characters[currentChar]+"/"+characters[currentChar]+'.png';
       flock[currentChar].imageChar.onload = function() {}
		   } 
}


function animationLoop() {
      // 1 - Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 2 Draw

	 
	for(var i=0;i<flock.length;i++)
	{
		drawCharacter(flock[i]);
	}
      // 3 Move

		moveChar(flock[currentChar]);

		if(flock[currentChar].sFlag)
			{
				salto(flock[currentChar]);
			}
		else if(flock[currentChar].jFlag)
			{
				jump(flock[currentChar]);
			}

			
		if(flock[currentChar].cFlag)
			{
				comeHere(flock[currentChar],405);
			}
	

      // call again mainloop after 16.6 ms (60 frames/s)
      requestId = requestAnimationFrame(animationLoop);
 }   
   function drawCharacter(CharObj) {   
     // GOOD PRACTICE : SAVE CONTEXT AND RESTORE IT AT THE END
     ctx.save();
     
     // Moves the coordinate system so that the monster is drawn
     // at position (x, y)
     ctx.translate(CharObj.CharX,CharObj.CharY);
     ctx.rotate(CharObj.CharAngle);
	 ctx.scale(CharObj.scaleX,CharObj.scaleY);
	 
	ctx.translate(-150, -100);//must be for setting rotation centre
	
	 //insert image
	 ctx.drawImage(CharObj.imageChar, 80, 10, 150, 150);
     
     // GOOD PRACTICE !
     ctx.restore();
   }
        
	function moveChar(CharObj)
	{
		if(flagL) CharObj.vh=-1;CharObj.go();
		if(flagR) CharObj.vh=1;CharObj.go();
		if(flagU) CharObj.vv=-1;CharObj.go();
		if(flagD) CharObj.vv=1;CharObj.go();
		
		CharObj.vh=0;CharObj.vv=0;
	}
	
	//to switch character to be controlled by keyboard
	function flipChar(nr)
	{
		currentChar=nr;
		var buttons =document.getElementsByTagName("button");
		for(var i=0;i<buttons.length;i++)
		{
			if(i!=nr)
			{
				buttons[i].classList.remove("selec");
				buttons[i].classList.add("unsel");
			}
			else
			{
				buttons[i].classList.remove("unsel");
				buttons[i].classList.add("selec");
				flock[i].helloAudio.play();
				flock[i].cFlag=true;
				
			}
			
		}
	}
	
	//character jumps and rotates 360 deg in 36 frames 
		function salto(CharObj)
	{
		var sign=0; if(flagL) {sign=-1;}else if(flagR){sign=1;} else {sign=0;}
		CharObj.counter++;
		if(CharObj.counter<=9)
		{
			 CharObj.vh=-2;
			 CharObj.vv=-2;
			 CharObj.CharAngle=(CharObj.counter*Math.PI)/18;
		}
		else if(CharObj.counter<=18)
		{
			CharObj.vh=2;
			 CharObj.vv=-2;
			 CharObj.CharAngle=(CharObj.counter*Math.PI)/18;
		}
		else if(CharObj.counter<=36)
		{
			
			CharObj.vh=2*sign;
			 CharObj.vv=2;
			 CharObj.CharAngle=(CharObj.counter*Math.PI)/18;
		}
		else
		{
			CharObj.sFlag=false;CharObj.counter=0; flagL=false; flagR=false;flagU=false;flagD=false;//function ends after 36 frames
			CharObj.CharAngle=0;
		}
		CharObj.go();
	}
	
	//at the beginning, all characters are small and standing away, this function brings them closer and makes bigger
	function comeHere(CharObj,targetY)
	{
		CharObj.counter++;
		if(CharObj.counter%5==0) //change movement direction every 5 frames and make the character a bit bigger (scale+=0.1)
		{
			CharObj.direction*=(-1);
			if(CharObj.scaleX<1)
			{
				CharObj.scaleX+=0.1;
			}
			if(CharObj.scaleY<1)
			{
				CharObj.scaleY+=0.1;
			}
		}
		////////////////////////////////////
		if(CharObj.counter<50&&CharObj.scaleX<1)
		{
			
			
			if(CharObj.CharX>0&&CharObj.CharX<canvas.width) {CharObj.vh=10*CharObj.direction;}
			if(CharObj.CharY>0&&CharObj.CharY<targetY) {CharObj.vv=1;}
			//if(CharObj.CharY>0&&CharObj.CharY<canvas.height-80) {CharObj.vv=1;}
			
			CharObj.go();
			
		}
		else
		{
			CharObj.counter=0;CharObj.cFlag=false;
		}
	}
   
   
   //simplified salto function, the object only goes up in 18 frames and then down in another 18 frames
   function jump(CharObj)
   {
		
		CharObj.counter++;
		if(CharObj.counter<=18)
		{
			CharObj.vv=-1;
		}
		else if(CharObj.counter<=36)
		{
			CharObj.vv=1;
		}
		else
		{
			CharObj.jFlag=false;CharObj.counter=0; flagL=false; flagR=false;flagU=false;flagD=false;//function ends after 36 frames
		}
		CharObj.go();
	}
   
   
   function foo()
   {}
   
   