function JPuzzle()
{

	var construct=function __construct(){
    $(".puzzleDrag").remove();
    $(".puzzleDrop").remove();
		    $.each($(".puzzle"),function(number,item){
		    var image=$(item).find("img").get(0);
    	    new Puzzle($(item).find("img").get(0).src,$(item).data("row"),$(item).data("column"),$(item).width(),$(item).height(),item);
    		});
	}();
}
function Puzzle(sourceSrc,tileRowNumber,tileColumnNumber,width,height,appendTo)
{
	var bank;
	var pieces;
	var canvas;
	var canvas2;
	var canvas_temp;
	var puzzleWidth;
	var puzzleHeight;
	var puzzleDrop;
	var puzzleDrag;
  var counter=0;
  var domObject;
	var construct=function __construct(sourceSrc,tileRowNumber,tileColumnNumber,width,height,appendTo){
		makeMobileCompatible();
		setWidth(width);
		setHeight(height);
	    bank=new puzzlePieceBank(tileRowNumber,tileColumnNumber);
	    pieces=bank.getPieces();
	    canvas=createCanvas(false);
	    canvas2=createCanvas(false);
	    canvas_temp=createCanvas(true);
	    setAppendTo(appendTo);
		setImageObj(sourceSrc);


	}(sourceSrc,tileRowNumber,tileColumnNumber,width,height,appendTo);
  

   function makeMobileCompatible(){
(function ($) {
    // Detect touch support
    $.support.touch = 'ontouchend' in document;
    // Ignore browsers without touch support
    if (!$.support.touch) {
    return;
    }
    var mouseProto = $.ui.mouse.prototype,
        _mouseInit = mouseProto._mouseInit,
        touchHandled;

    function simulateMouseEvent (event, simulatedType) { //use this function to simulate mouse event
    // Ignore multi-touch events
        if (event.originalEvent.touches.length > 1) {
        return;
        }
    event.preventDefault(); //use this to prevent scrolling during ui use

    var touch = event.originalEvent.changedTouches[0],
        simulatedEvent = document.createEvent('MouseEvents');
    // Initialize the simulated mouse event using the touch event's coordinates
    simulatedEvent.initMouseEvent(
        simulatedType,    // type
        true,             // bubbles                    
        true,             // cancelable                 
        window,           // view                       
        1,                // detail                     
        touch.screenX,    // screenX                    
        touch.screenY,    // screenY                    
        touch.clientX,    // clientX                    
        touch.clientY,    // clientY                    
        false,            // ctrlKey                    
        false,            // altKey                     
        false,            // shiftKey                   
        false,            // metaKey                    
        0,                // button                     
        null              // relatedTarget              
        );

    // Dispatch the simulated event to the target element
    event.target.dispatchEvent(simulatedEvent);
    }
    mouseProto._touchStart = function (event) {
    var self = this;
    // Ignore the event if another widget is already being handled
    if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
        return;
        }
    // Set the flag to prevent other widgets from inheriting the touch event
    touchHandled = true;
    // Track movement to determine if interaction was a click
    self._touchMoved = false;
    // Simulate the mouseover event
    simulateMouseEvent(event, 'mouseover');
    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');
    // Simulate the mousedown event
    simulateMouseEvent(event, 'mousedown');
    };

    mouseProto._touchMove = function (event) {
    // Ignore event if not handled
    if (!touchHandled) {
        return;
        }
    // Interaction was not a click
    this._touchMoved = true;
    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');
    };
    mouseProto._touchEnd = function (event) {
    // Ignore event if not handled
    if (!touchHandled) {
        return;
    }
    // Simulate the mouseup event
    simulateMouseEvent(event, 'mouseup');
    // Simulate the mouseout event
    simulateMouseEvent(event, 'mouseout');
    // If the touch interaction did not move, it should trigger a click
    if (!this._touchMoved) {
      // Simulate the click event
      simulateMouseEvent(event, 'click');
    }
    // Unset the flag to allow other widgets to inherit the touch event
    touchHandled = false;
    };
    mouseProto._mouseInit = function () {
    var self = this;
    // Delegate the touch handlers to the widget's element
    self.element.bind('touchstart', $.proxy(self, '_touchStart')).bind('touchmove', $.proxy(self, '_touchMove')).bind('touchend', $.proxy(self, '_touchEnd'));

    // Call the original $.ui.mouse init method
    _mouseInit.call(self);
    };
})(jQuery);


   }
  /*function makeMobileCompatible(){
	var init=function init() {
	    document.addEventListener("touchstart", touchHandler, true);
	    document.addEventListener("touchmove", touchHandler, true);
	    document.addEventListener("touchend", touchHandler, true);
	    document.addEventListener("touchcancel", touchHandler, true);
	}();
	function touchHandler(event) {
	    var touch = event.changedTouches[0];

	    var simulatedEvent = document.createEvent("MouseEvent");
	        simulatedEvent.initMouseEvent({
	        touchstart: "mousedown",
	        touchmove: "mousemove",
	        touchend: "mouseup"
	    }[event.type], true, true, window, 1,
	        touch.screenX, touch.screenY,
	        touch.clientX, touch.clientY, false,
	        false, false, false, 0, null);

	    touch.target.dispatchEvent(simulatedEvent);
	    event.preventDefault();
	}

  }*/
  function createOverLay(message){
    var overlayMain = $("<div>");
    var overlayContainer = $("<div>").css({"z-index":"9999999"})
        .css({"width":"100%","height":"100%","text-align":"center","position":"absolute","background-color":"black","opacity":"0.8","font-size": "16px","overflow":"hidden"});
    var overlayContainerFront=$("<div>")
        .css({"width":"100%","height":"100%","text-align":"center","position":"absolute","z-index":"9999999","background-color":"transparent","font-size": "16px","overflow":"hidden", "display":"table"});
    var imgDiv = $("<div>")
        .css({"display": "table-cell", "vertical-align": "middle","margin":"0 auto","width":"100%","height":"100%"});

    var status=1;
    var path='';
    
    if(typeof window.base_path == 'undefined'){
      path="overlay_"+status+".png"
    }
    else
    {
      path=window.base_path+"/css/images/overlay_"+status+".png"
    }
    var img = $("<img/>")
        .css({"height":"30%"}).attr("src",path);

    var p=$("<p/>").css({"color":"white"}).html(message);
    imgDiv.appendTo(overlayContainerFront);
    img.appendTo(imgDiv);
    p.appendTo(imgDiv);
    overlayContainerFront.click(function(){
      $(this).remove();
      overlayContainer.remove();

    });
    overlayContainer.appendTo(overlayMain);
    overlayContainerFront.appendTo(overlayMain);
    return overlayMain;

   };
  function setAppendTo(dom){ 
      puzzleDrag=$('<div>').addClass('puzzleDrag');
      puzzleDrop=$('<div>').addClass('puzzleDrop');
      puzzleDrag.appendTo($(dom));
      puzzleDrop.appendTo($(dom));
      domObject=$(dom);
  }
  function setImageObj(sourceSrc){
		var imageObj = new Image();
	    //imageObj.crossOrigin='anonymous';
	    imageObj.onload = function() 
	    {
	        getContext().drawImage(imageObj, 0, 0,getWidth(),getHeight());
	        getContext2().drawImage(imageObj, 0, 0,getWidth(),getHeight());
	        pieceWidth=getWidth()/(bank.column*1.0);
	        pieceHeight=getHeight()/(bank.row*1.0);
	        for(var i=0;i<getPieces().length;i++)
	        {
	          extractImage(getPieces()[i],pieceWidth,pieceHeight,getWidth(),getHeight());
	          
	        }
	    }
		imageObj.src = sourceSrc;
  }
  function getDom(){
    return domObject;
  }
  function getPieces(){return pieces;}
  function setWidth(width){puzzleWidth=width;}
  function setHeight(height){puzzleHeight=height;}
  function getWidth(){return puzzleWidth;}
  function getHeight(){return puzzleHeight;}

  function createCanvas(type){
  	if (type==true){return $("<canvas>").get(0);}
  	return $("<canvas width='"+getWidth()+"' height='"+getHeight()+"' style='display:none'>").get(0);
  }

  function getContext(){return canvas.getContext('2d');}
  function getContext2(){return canvas2.getContext('2d');}
  function getContextTemp(){return canvas_temp.getContext('2d');}
        
  function extractImage(position,widthPiece,heightPiece){
	var addition;
    var addWidth=0;
    var addHeight=0;

    getContext().globalCompositeOperation ="destination-in"; 
    getContext2().globalCompositeOperation ="destination-out"; 

    addition=((heightPiece/5)+(widthPiece/5))/2;

    getContext().rect(position.j*widthPiece,position.i*heightPiece, widthPiece,heightPiece);
    getContext2().rect(position.j*widthPiece,position.i*heightPiece, widthPiece,heightPiece);
    
    if(position.east==1){
      getContext().globalCompositeOperation ="destination-in";
      getContext2().globalCompositeOperation ="destination-out";
      addWidth+=addition;

      getContext().arc((position.j+1)*widthPiece,(position.i+0.5)*heightPiece,addition, 0, 2 * Math.PI, false);
      getContext2().arc((position.j+1)*widthPiece,(position.i+0.5)*heightPiece, addition, 0, 2 * Math.PI, false);
    }

    if(position.south==1){
      getContext().globalCompositeOperation ="destination-in";
      getContext2().globalCompositeOperation ="destination-out";
      addHeight+=addition;

      getContext().arc((position.j+0.5)*widthPiece,(position.i+1)*heightPiece, addition, 0, 2 * Math.PI, false);
      getContext2().arc((position.j+0.5)*widthPiece,(position.i+1)*heightPiece, addition, 0, 2 * Math.PI, false);            
    }

    getContext().fill();
    getContext2().fill();

    var puzzleImage=convertCanvasToImage(position.i*heightPiece, position.j*widthPiece,widthPiece+addition,heightPiece+addition);
    var data=getContext2().getImageData(0, 0, getWidth(), getHeight());
	getContext().putImageData(data, 0, 0);

    var dragDiv=$("<div></div>");
    var dropDiv=$("<div></div>");
    randomLeft=Math.floor((Math.random() * (getWidth()-widthPiece-widthPiece/5)) + 1);
    randomTop=Math.floor((Math.random() * (getHeight()-heightPiece-heightPiece/5))+1);
    //alert(canvasWidth);
    dragDiv.css({'z-index':'999','position':'absolute','width': (widthPiece)+'px','height': (heightPiece)+'px','margin': '1px','left':randomLeft,'top':randomTop});
    dropDiv.css({'position':'absolute','width': (widthPiece)+'px','height': (heightPiece)+'px','float': 'left','margin': '1px',left:(position.j*widthPiece)+'px',top:(position.i*heightPiece)+'px'});
    $(puzzleImage).appendTo(dragDiv);

    puzzleDrop.css({"width":getWidth()+(bank.column*3)+"px"});
    dragDiv.draggable({
               //revert:"invalid",
               drag:function(event,ui){
               	//document.getElementById(snapfit.imageId).style.backgroundColor='rgba(0, 0, 0, 0.01)';
               	//canvas.style.backgroundColor='rgba(0, 0, 0, 0.01)';


               },
               stop:function(event,ui){
               }
    });
    dropDiv.droppable({
      accept: dragDiv,
      over: function(event, ui) {
        dropDiv.css({"background-color":"green","opacity":"0.3"});
      },
      out:function(event,ui){
        dropDiv.css({"background-color":"transparent","opacity":"1"});
      },
      drop: function( event, ui ) {
       dragDiv.draggable( 'disable' );
       dropDiv.css({"background-color":"transparent","opacity":"1"});
       dragDiv.css({'left':dropDiv.css('left'),'top':dropDiv.css('top')});
        counter=counter+1;
        console.log("PUZZLE->",counter,bank.row,bank.column);
       if(counter==(bank.row*bank.column))
       {
          createOverLay('Tebrikler! Başarıyla tamamladınız...').appendTo(getDom());
       }
      }
    });
    dragDiv.appendTo(puzzleDrag);
    dropDiv.appendTo(puzzleDrop);
   

	}

  function convertCanvasToImage(posi,posj,widthPiece,heightPiece) {
      var imageObj = new Image();
      imageObj.onload=function(){
        console.log("loaded...");
      }
      var data=getContext().getImageData(posj,posi,widthPiece,heightPiece);
      canvas_temp.width=widthPiece;
      canvas_temp.height=heightPiece;
      getContextTemp().putImageData(data,0,0);
      imageObj.src = canvas_temp.toDataURL();
      return imageObj;
    }

}


function puzzlePiece(westPos,eastPos,northPos,southPos)
{
  var west;
  var east;
  var north;
  var south;
  var i;
  var j;
  var that=this;
  var __construct=function(westPos,eastPos,northPos,southPos){
      setPosition(westPos,eastPos,northPos,southPos);
  }(westPos,eastPos,northPos,southPos);

  this.setPosition=function(westPos,eastPos,northPos,southPos){
      setPosition(westPos,eastPos,northPos,southPos);

  }

  function setPosition(westPos,eastPos,northPos,southPos)
  {
    that.west=westPos;
    that.east=eastPos;
    that.north=northPos;
    that.south=southPos;    
  }

  this.setIndex=function(i,j){
    this.i=i;
    this.j=j;
  }
  this.setRow=function(rowPos){
    that.i=rowPos;
  }  

  this.setColumn=function(columnPos){
    that.j=columnPos;
  }  

  this.setWest=function(westPos){
    that.west=westPos;
  }
  this.setEast=function(eastPos){
    that.east=eastPos;
  }
  this.setNorth=function(northPos){
    that.north=northPos;
  }
  this.setSouth=function(southPos){
    that.south=southPos;
  }  
  this.getPosition=function(){
    return {
              west:that.west,
              east:that.east,
              north:that.north,
              south:that.south,
              row:that.row,
              column:that.column
            }
  }
  this.toString=function(){
      return [that.west,that.east,that.north,that.south,{row:that.row,column:that.column}];
  }

}

function puzzlePieceBank(rowNumber,columnNumber)
{
   var row;
   var column;
   var that=this;
   var puzzlePieces;
   

  var __construct = function(rowNumber,columnNumber) {
       setValues(rowNumber,columnNumber);
       setPieces();
   }(rowNumber,columnNumber);

   this.setPieces=function(){setPieces();}
   function setPieces(){
      for (var i = 0; i < that.row; i++) {
        for (var j = 0; j < that.column; j++) 
        {
          /*BEGIN:arrange according to row*/
          var pos=(i*that.column)+j;
          that.puzzlePieces[pos]=new puzzlePiece(0,0,0,0);
          that.puzzlePieces[pos].setIndex(i,j);

          if(i==0){
              (that.puzzlePieces[pos]).setNorth(0);
              (that.puzzlePieces[pos]).setSouth(1);                
          }
          else if(i==((that.row)-1))
          {
              (that.puzzlePieces[pos]).setNorth(-1);
              (that.puzzlePieces[pos]).setSouth(0); 
          }
          else
          {
             (that.puzzlePieces[pos]).setNorth(-1);
             (that.puzzlePieces[pos]).setSouth(1);
          }
          /*END:arrange according to row*/

          /*BEGIN:arrange according to column*/
          if(j==0 ){
              (that.puzzlePieces[pos]).setWest(0);
              (that.puzzlePieces[pos]).setEast(1);                
          }
          else if(j==((that.column)-1))
          {
              (that.puzzlePieces[pos]).setWest(-1);
              (that.puzzlePieces[pos]).setEast(0); 
          }
          else
          {
              (that.puzzlePieces[pos]).setWest(-1);
              (that.puzzlePieces[pos]).setEast(1);  
          }

          /*END:arrange according to column*/

          console.log(that.puzzlePieces[pos]);
          

        }
      }

   };

   function setValues(rowNumber,columnNumber){
       that.row = rowNumber;
       that.column=columnNumber;
       that.puzzlePieces=[];
   }
   this.getPieces = function()
   {
       return that.puzzlePieces;
   }
}