'use strict';

$(document).ready(function(){
  $.widget('lindneo.cquizComponent', $.lindneo.component, {
    
    options: {

    },

    _create: function(){

      var that = this;

      var type = "";

      var container = $("<div>")
        .css({"background-image":"url('"+window.base_path+"/css/images/old-white-seamless-paper-texture-500x500.jpg')","background-repeat":"repeat", "width":"100%", "height":"100%", "overflow":"hidden", "font-size": "16px","text-align":"center","position":"absolute"})
        .appendTo(this.element);

        var questionDiv = $("<div>")
          .html(this.options.component.data.question)
          .appendTo(container);

        var buttonDiv = $("<div>").css({"bottom":"0px","position":"absolute","width":"100%"})
          .appendTo(container);

          var questionButtonTrue = $("<img>").css({"margin":"10px"})
            .attr("src",window.base_path+"/css/images/butond.png")
            .click(function(){
              if(that.options.component.data.cquiz_type == true) type = 1; else type = 0;
              console.log(type);
              createOverLay( type,"Üzgünüm! Doğru cevap:  "+that.options.component.data.answer+"!","Tebrikler! Cevabınız Doğru!").appendTo(that.element);
            })
            .appendTo(buttonDiv);

          var questionButtonfalse = $("<img>").css({"margin":"10px"})
            .attr("src",window.base_path+"/css/images/butony.png")
            .click(function(){
              if(that.options.component.data.cquiz_type == "false") type = 1; else type = 0;
              console.log(type);
              createOverLay(type,"Üzgünüm! Doğru cevap  "+that.options.component.data.answer+"!","Tebrikler! Cevabınız Doğru!").appendTo(that.element);
            })
            .appendTo(buttonDiv);


      this._super();
    },

    field: function(key, value)
 {     console.log(key);
      console.log(value);
      
      this._super();

      // set
      this.options.component[key] = value;

    }
    
  });
});

var createOverLay = function (status,trueMessage,falseMessage){
    var overlayMain = $("<div>")
    var overlayContainer = $("<div>")
        .css({"width":"100%","height":"100%","text-align":"center","position":"absolute","background-color":"black","opacity":"0.8","font-size": "16px","overflow":"hidden"});
    var overlayContainerFront=$("<div>")
        .css({"width":"100%","height":"100%","text-align":"center","position":"absolute","background-color":"transparent","font-size": "16px","overflow":"hidden", "display":"table"});
    var imgDiv = $("<div>")
        .css({"display": "table-cell", "vertical-align": "middle","margin":"0 auto","width":"100%","height":"100%"});

    var img = $("<img/>")
        .css({"height":"30%"}).attr("src",window.base_path+"/css/images/overlay_"+status+".png");

    var p=status==0?$("<p/>").css({"color":"white"}).html(trueMessage):$("<p/>").css({"color":"white"}).html(falseMessage);
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

   }


var createCquizComponent = function ( event, ui, oldcomponent ) {  

  var popupDiv;
  var answerDiv;
  var question;
  var answer;
  var cquiz_type;
  
  if(typeof oldcomponent == 'undefined'){
    console.log('dene');
    var top = (ui.offset.top-$(event.target).offset().top ) + 'px';
    var left = ( ui.offset.left-$(event.target).offset().left ) + 'px';
    question = '';
    answer = '';
    var width = 'auto';
    var height = 'auto';
    cquiz_type = true;
  }
  else{
    top = oldcomponent.data.self.css.top;
    left = oldcomponent.data.self.css.left;
    question = oldcomponent.data.question;
    answer = oldcomponent.data.answer;
    var width = oldcomponent.data.width ;
    var height = oldcomponent.data.height;
    cquiz_type = oldcomponent.data.cquiz_type;
  };

  var true_check_active = '';
  var false_check_active = '';

  if(cquiz_type) { true_check_active = 'active'; false_check_active='';}
  else {  false_check_active = 'active'; true_check_active='';}
  
  var min_left = $("#current_page").offset().left;
  var min_top = $("#current_page").offset().top;
  var max_left = $("#current_page").width() + min_left;
  var max_top = $("#current_page").height() + min_top;
  var window_width = $( window ).width();
  var window_height = $( window ).height();

  if(max_top > window_height) max_top = window_height;
  if(max_left > window_width) max_top = window_width;
  
  var top=(event.pageY - 25);
  var left=(event.pageX-150);

  console.log(top);

  if(left < min_left)
    left = min_left;
  else if(left+200 > max_left)
    left = max_left - 200;

  if(top < min_top)
    top = min_top;
  else if(top+300 > max_top)
    top = max_top - 300;

  top = top + "px";
  left = left + "px";

  var idPre = $.now();

  $('<div>').componentBuilder({
    top:top,
    left:left,
    title: j__("Card Quiz"),
    btnTitle : j__("Ekle"), 
    beforeClose : function () {
      /* Warn about not saved work */
      /* Dont allow if not confirmed */
      return confirm(j__("Yaptığınız değişiklikler kaydedilmeyecektir. Kapatmak istediğinize emin misiniz?"));
    },
    onBtnClick: function(){

      if (question == "") {
          alert (j__("Lütfen Sorunuzu giriniz"));
          return false;
      }

      if(!cquiz_type)
        if (answer == "") {
            alert (j__("Lütfen Cevabınızı giriniz"));
            return false;
        }

      if(typeof oldcomponent != 'undefined'){
        
        top = oldcomponent.data.self.css.top;
        left = oldcomponent.data.self.css.left;
      }  

      var  component = {
        'type' : 'cquiz',
        'data': {
          'question':  question,
          'answer':  answer,
          'cquiz_type':cquiz_type,
          'width': width,
          'height': height,
          'lock':'',
          'self': {
            'css': {
              'position':'absolute',
              'top': top ,
              'left':  left ,
              'width':'128px',
              'height':'128px',
              'background-color': 'transparent',
              'overflow': 'visible',
              'z-index': 'first',
              'opacity':'1'
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
        .css({"width":"100%","height":"100%"})
        .appendTo(ui);

        var wrapperDiv = $('<div>')
          .addClass("popup_wrapper drag-cancel")
          .css({"width":"100%","height":"60%","border": "1px #ccc solid"})
          .appendTo(mainDiv);

        popupDiv = $('<div>')
          .appendTo(mainDiv);

          var questionLabel = $('<label>')
            .text(j__("Sorunuzu giriniz."))
            .appendTo(wrapperDiv); 

          var detail = $('<textarea>')
            .addClass("drag-cancel")
            .css({"resize":"none","width":"100%", "height":"100%"})
            .val(question)
            .change(function(){
              question = $(this).val();
            })
            .appendTo(wrapperDiv); 

       var answerTypeDiv = $('<div>')
          .addClass("typei")
          .css({"padding": "4px", "display": "inline-block"})
          .appendTo(mainDiv);

          var trueTypeRadioDiv = $('<div>')
            .addClass("btn-group")
            .attr("data-toggle","buttons")
            .appendTo(answerTypeDiv);

            var trueTypeLinkLabel = $('<label>')
              .addClass("btn btn-primary "+true_check_active)
              .text(j__("Doğru"))
              .appendTo(trueTypeRadioDiv);

              var videoTypeLinkInput = $('<input type="radio">')
                .attr("name","cquiz_type")
                .val("true")
                .change(function () {
                  popupDiv.html('');
                  cquiz_type = $(this)[0].value;
                })
                .appendTo(trueTypeLinkLabel);

          var falseTypeRadioDiv = $('<div>')
            .addClass("btn-group")
            .attr("data-toggle","buttons")
            .appendTo(answerTypeDiv);

            var falseTypeLinkLabel = $('<label>')
              .addClass("btn btn-primary "+false_check_active)
              .text(j__("Yanlış"))
              .appendTo(falseTypeRadioDiv);

              var videoTypeLinkInput = $('<input type="radio">')
                .attr("name","cquiz_type")
                .val("false")
                .change(function(){
                  answerDiv = $('<div>')
                    .addClass("popup_wrapper drag-cancel")
                    .css({"width":"100%","height":"20%","border": "1px #ccc solid","margin-top":"4%"})
                    .appendTo(popupDiv);

                    var questionLabel = $('<label>')
                      .text(j__("Cevabınızı giriniz."))
                      .appendTo(answerDiv); 

                    var detail = $('<textarea>')
                      .addClass("drag-cancel")
                      .css({"resize":"none","width":"100%", "height":"100%"})
                      .val(answer)
                      .change(function(){
                        answer = $(this).val();
                      })
                      .appendTo(answerDiv); 
                cquiz_type = $(this)[0].value;
              })
                .appendTo(falseTypeLinkLabel);

                

    }

  }).appendTo('body');

};