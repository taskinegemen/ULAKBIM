'use strict';

$(document).ready(function(){
  $.widget('lindneo.plumbComponent', $.lindneo.component, {
    
    options: {

    },

    _create: function(){
      


      console.log("JSPLUMB reset");
      var that = this;

      var letters = [];
      var i = this.options.component.data.word.length;
      while (i--) {
        letters.push(this.options.component.data.word[i]);
      }
      letters.reverse();
      console.log(letters);
      
      if(this.options.component.data.size == "") this.options.component.data.size = 100;
      console.log($(this.element).find("select .yanlis"));
      this._super();
     /* $.ajaxSetup({
        cache: true
      });*/ 
      $.getScript('/js/lib/dom.jsPlumb-1.6.2-min.js',function(){
        window["instanceJsPlumb"+that.options.component.id] = jsPlumb.getInstance();
      window["instanceJsPlumb"+that.options.component.id].bind("ready", function() {
        tesbihKonteyner=tesbihTaneleriOlustur(that.options.component.data.kelimeler,letters, that.element, parseInt(that.options.component.data.size)); 
        tesbihTazele(tesbihKonteyner,window["instanceJsPlumb"+that.options.component.id]);
      });
       $( that.element ).resize(function() {
        window["instanceJsPlumb"+that.options.component.id].deleteEveryEndpoint();
        window["instanceJsPlumb"+that.options.component.id].reset();
        console.log("ID",that.options.component.id);
        tesbihTazele(tesbihKonteyner,window["instanceJsPlumb"+that.options.component.id]);
      });
       });


    },

    field: function(key, value){
      console.log(key);
      console.log(value);
      
      this._super();

      // set
      this.options.component[key] = value;

    }
    
  });
});

var tesbihKonteyner;

var tesbihTaneleriOlustur = function (kelimeler,cevaplar, element, taneBoyutu){

  $("<style type='text/css'>.yanlis{color:red;-webkit-text-stroke: "+parseInt(taneBoyutu*3.0/100)+"px black} .dogru{color:green;-webkit-text-stroke: "+parseInt(taneBoyutu*3.0/100)+"px black}</style>").appendTo("head");

  tesbihKonteyner=$("<div></div>").css({"width":"100%","float":"left"});
  var tesbihKelimeler=$("<div><b>Bulmacadaki kelimeler:</b><br>"+kelimeler.split(",").join("<br>")+"</div>").css({"border-style":"solid","border-width":"1px","width":"100%","float":"left","font-size":(taneBoyutu/3)+"px"});
  var tesbihDiv=$("<div></div>").css({"width":"100%"});

  var alfabe=["?","A","B","C","Ç","D","E","F","G","Ğ","H","I","İ","J","K","L","M","N","O","Ö","P","R","S","Ş","T","U","Ü","V","Y","Z"];
  for (var i = 0; i < cevaplar.length; i++) {
    var tane=$("<div></div>")
        .css({"border-radius": "50%","behavior": "url(PIE.htc)","margin":"10px","float":"left","width": parseInt(taneBoyutu*1.5)+"px","height":parseInt(taneBoyutu*1.5)+"px","background-image": "url(../../../css/images/amber.png)","background-size": parseInt(taneBoyutu*1.5)+"px "+parseInt(taneBoyutu*1.5)+"px","background-repeat": "no-repeat"})
        .appendTo(tesbihKonteyner);

    var taneKapsul=$("<div></div>")
        .css({"width": parseInt(taneBoyutu*1.5)+"px","height": parseInt(taneBoyutu*1.5)+"px","display":"table-cell","vertical-align":"middle","text-align":"center"})
        .appendTo(tane);

    var secimKutusu= $("<select>")
        .css({"padding-right":"0","font-size":parseInt(taneBoyutu*0.5)+"px","font-weight": "bolder","background-color": "transparent","border":"none","outline": "none","-webkit-appearance": "none","-moz-appearance": "none","appearance": "none"})
        .focus(function(){
          $( this ).css({"border":"none","outline": "none"});
        });
    secimKutusu.addClass("yanlis");
    secimKutusu.attr('data-cevap', cevaplar[i]);
    secimKutusu.appendTo(taneKapsul);
    secimKutusu.on('change', '', function (e) {
          console.log("secim",$(this).val());
          console.log("cevap",$(this).data("cevap"))
          if($(this).val()==$(this).data("cevap")){
            $(this).removeClass("yanlis");
            $(this).addClass("dogru");
          }
          else
          {
            $(this).removeClass("dogru");
            $(this).addClass("yanlis");
          }
          console.log($(element).find(".dogru").length);
          if(cevaplar.length == $(element).find(".dogru").length) {

            createOverLay("Tebrikler, başarıyla tamamladınız!").css({"z-index":"1","position":"absolute","width":"100%","height":"100%"}).appendTo(tesbihDiv);
            console.log("overlay");
            //alert("Doğru bildin, tebrikler...");

          }
    });

    for (var j = 0; j < alfabe.length; j++) {
       $("<option></option>", {value: alfabe[j], text: alfabe[j]}).appendTo(secimKutusu);
    };

  };

  
  tesbihKonteyner.appendTo(tesbihDiv);
  tesbihKelimeler.appendTo(tesbihDiv);
  tesbihDiv.appendTo(element);

  //tesbihKonteyner.appendTo("<div>"+kelimeler+"</div>");
  return tesbihKonteyner;

}

var tesbihTazele = function (tesbihKonteyner,instanceJsPlumb){

  var tesbihTaneleri=tesbihKonteyner.children();
  var tesbihTaneleriSayisi=tesbihTaneleri.length;
  var c1,c2;
  //jsPlumb.draggable($(".circleBase"));
  $.each(tesbihTaneleri,function(id,val){
      jsPlumb.draggable($(val));
      /*(val).draggable({

           drag: function() {
              jsPlumb.deleteEveryEndpoint();
              tesbihTazele(tesbihKonteyner);
          }

      });*/
      if(id==0){
         c1 = instanceJsPlumb.addEndpoint($(val),{anchor:"Right", endpoint: ["Dot", { radius: 5}]});
      }
      else
      {
        //c2=jsPlumb.addEndpoint($(val),{anchor:"RightMiddle"});
         c2=instanceJsPlumb.addEndpoint($(val),{anchor:"Left",endpoint: ["Dot", { radius: 5}]});
        instanceJsPlumb.connect({
             source:c1, 
             target:c2,
                    /*
                     endpoint: {type:"Dot",
                          radius: 1
                      },*/
                      endpointStyle: {
                          fillStyle: "#19070B"

                      },
                      //setDragAllowedWhenFull: true,
                      paintStyle: {
                          strokeStyle: "#19070B",
                          lineWidth: 5
                      },
                      connector: ["Flowchart",{cornerRadius:10}]


           });
        if(id!=tesbihTaneleriSayisi-1)
        c1=instanceJsPlumb.addEndpoint($(val),{anchor:"Right",endpoint: ["Dot", { radius: 5}]});
      }


    }

  );
  $(tesbihKonteyner).parent().css({"position":"absolute","z-index":"9999999"});
}




var createOverLay = function (message){
    var overlayMain = $("<div>");
    var overlayContainer = $("<div>").css({"z-index":"9999999"})
        .css({"width":"100%","height":"100%","text-align":"center","position":"absolute","background-color":"black","opacity":"0.8","font-size": "16px","overflow":"hidden"});
    var overlayContainerFront=$("<div>")
        .css({"width":"100%","height":"100%","text-align":"center","position":"absolute","z-index":"9999999","background-color":"transparent","font-size": "16px","overflow":"hidden", "display":"table"});
    var imgDiv = $("<div>")
        .css({"display": "table-cell", "vertical-align": "middle","margin":"0 auto","width":"100%","height":"100%"});

    var status=1;
    var img = $("<img/>")
        .css({"height":"30%"}).attr("src",window.base_path+"/css/images/overlay_"+status+".png");

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
var createPlumbComponent = function ( event, ui ,oldcomponent) {

  var taneler;
  var boyut= "";
  var kelimeler="";
  var width="";
  var height="";
  if(typeof oldcomponent == 'undefined'){
    var top = (ui.offset.top-$(event.target).offset().top ) + 'px';
    var left = ( ui.offset.left-$(event.target).offset().left ) + 'px';
  }
  else{
    boyut=oldcomponent.data.size;
    taneler=oldcomponent.data.word.toLowerCase();;
    kelimeler=oldcomponent.data.kelimeler;
    top = oldcomponent.data.self.css.top;
    left = oldcomponent.data.self.css.left;
    width= oldcomponent.data.self.css.width;
    height= oldcomponent.data.self.css.height;
    console.log(height,width);
  };
  
  var min_left = $("#current_page").offset().left;
  var min_top = $("#current_page").offset().top;
  var max_left = $("#current_page").width() + min_left;
  var max_top = $("#current_page").height() + min_top;
  var window_width = $( window ).width();
  var window_height = $( window ).height();

  if(max_top > window_height) max_top = window_height;
  if(max_left > window_width) max_top = window_width;

  top=(event.pageY-25);
  left=(event.pageX-150);

  if(left < min_left)
    left = min_left;
  else if(left+310 > max_left)
    left = max_left - 310;

  if(top < min_top)
    top = min_top;
  else if(top+600 > max_top)
    top = max_top - 600;

  top = top + "px";
  left = left + "px";

  var idPre = $.now();

  $('<div>').componentBuilder({

    top:top,
    left:left,
    title: j__("Sıralı Bulmaca"),
    btnTitle : j__("Ekle"), 
    beforeClose : function () {
      /* Warn about not saved work */
      /* Dont allow if not confirmed */
      return confirm(j__("Yaptığınız değişiklikler kaydedilmeyecektir. Kapatmak istediğinize emin misiniz?"));
    },
    onBtnClick: function(){

      if(typeof oldcomponent == 'undefined'){
        //console.log('dene');
        var top = (ui.offset.top-$(event.target).offset().top ) + 'px';
        var left = ( ui.offset.left-$(event.target).offset().left ) + 'px';
        
      }
      else{
        top = oldcomponent.data.self.css.top;
        left = oldcomponent.data.self.css.left;

      };
      
      var component = {
          'type' : 'plumb',
          'data': {
            "word":taneler,
            "size":boyut,
            "kelimeler":kelimeler,
            'lock':'',
            'self': {
              'css': {
                'position':'absolute',
                'top': top ,
                'left':  left ,
                'width': width==''?'300px':width,
                'height': height==''?'300px':height,
                'background-color': 'transparent',
                'overflow': 'visible',
                'z-index': 'first'
              }
            }
          }
        };

      if(typeof oldcomponent !== 'undefined'){
        window.lindneo.tlingit.componentHasDeleted( oldcomponent, oldcomponent.id );
      };
      window.lindneo.tlingit.componentHasCreated( component );
    },
    onComplete:function (ui){
      var mainDiv = $('<div>')
        .appendTo(ui);

        var wordLabel = $('<label>')
          .text(j__("Bulmacanın içeriğindeki harfleri giriniz. Örnek: kapırasa"))
          .appendTo(mainDiv);
        $("<br>").appendTo(mainDiv);
        var wordDiv = $('<input type="text">')
          .val(taneler)
          .change(function(){
            taneler = $(this).val().toUpperCase();
          })
          .appendTo(mainDiv);
        $("<br>").appendTo(mainDiv);
          
        var eachWordLabel = $('<label>')
          .text(j__("Bulmacanın içeriğindeki kelimeleri virgül kullaran giriniz. Örnek: kapı,pırasa"))
          .appendTo(mainDiv);
        $("<br>").appendTo(mainDiv);
        var eachWordDiv = $('<input type="text">')
          .val(kelimeler)
          .change(function(){
            kelimeler = $(this).val();
          })
          .appendTo(mainDiv);

        $("<br>").appendTo(mainDiv);

        var sizeLabel = $('<label>')
          .text(j__("Tane boyutunu giriniz.Örnek:50"))
          .appendTo(mainDiv);
          $("<br>").appendTo(mainDiv);
        var sizeDiv = $('<input type="text">')
          .val(boyut)
          .change(function(){
            boyut = $(this).val();
          })
          .appendTo(mainDiv); 

                    
    }

  }).appendTo('body');

};
