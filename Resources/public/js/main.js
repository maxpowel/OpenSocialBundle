//console.log("NOmbre "+person.getDisplayName());
//Gotten from http://stackoverflow.com/questions/527089/is-it-possible-to-create-a-namespace-in-jquery
jQuery.namespace = function() {
    var a=arguments, o=null, i, j, d;
    for (i=0; i<a.length; i=i+1) {
        d=a[i].split(".");
        o=window;
        for (j=0; j<d.length; j=j+1) {
            o[d[j]]=o[d[j]] || {};
            o=o[d[j]];
        }
    }
    return o;
};

// definition
jQuery.namespace( 'jQuery.controller' );
jQuery.namespace( 'jQuery.widget' );
jQuery.namespace( 'jQuery.cache' );
jQuery.namespace( 'jQuery.wixet' );
jQuery.namespace( 'jQuery.wixet.user' );

$.wixet.user.id = $.cookie("userId");
/*$.getJSON("/core/user/whoAmI",function(data){
	$.wixet.user.firstName = data.firstName;
	$.wixet.user.lastName = data.lastName;
	$.wixet.user.id = data.id;
	$.wixet.user.language = data.language.language_code;
});
*/
$.cache.widgetsLoaded = new Array();
$.cache.controllersLoaded = new Array();
$.wixet.garbage = new Array();
$.wixet.actualPage = null;
$.wixet.friendList = new Array();
$.wixet.alphanumericFilter = /(^[a-z0-9]+$)/i

$.wixet.privateMessage = function(id){
	var dialog = $('<div title="New private message">'+
			'<div class="editor"></div>'+
			'</div>').dialog({
				resizable: true,
				height:400,
				width: 500,
				modal: true,
				open: function(){
					$(this).find(".editor").editor({height:230, width:450,youtube:false,sound:false});
				},
				buttons: {
					'Cancel': function() {
						$(this).dialog('close');
					},
					'Send': function() {
						var thisDialog = $(this);
						dialog.find(".editor").editor({send: "/core/privateMessage/send/userId/"+id, callback: function(data){
							data = eval("("+data+")");
							if(data.error)
								jAlert("Error while creating blog entry: "+data.message,"Error");
							else{
								thisDialog.dialog('close');
								$.wixet.userNotice("Private message sent");
							}
						}});
					}
				}
			});
}


$.wixet.uploadPhotoDialog = function(){
	//Hacer que solo se abra si no existe
	var uploadPhotoWindow = $("#uploadPhotosWindow");
	if(uploadPhotoWindow.length == 1)
	{
		//try{
                    uploadPhotoWindow.focus();
		//	uploadPhotoWindow.restore();
		/*}catch(e)
		{
			uploadPhotoWindow.select();
		}*/
	}else{

            var width = 350;
            $.newWindow({
                    id: "uploadPhotosWindow",
                    title: "Subir fotos",
                    width: width,
                    height: 320,
                    posx: $(window).width()/2-(width/2),
                    posy: 200,
                    onWindowClose: function(){
                        if($("#uploadState").val() == "PROCESS"){
                            jConfirm("Cuidado, si cierras la ventana se cancelará la subida de fotos","Confirmación de cierre",function(y){
                                if(y) $.closeWindow("uploadPhotosWindow");
                            });
                            
                            return false;
                        }
                        else return true;
                    },
                    content: "<div id='uploadForm'>",
                    statusBar: true,
                    minimizeButton: true,
                    maximizeButton: true,
                    closeButton: true,
                    draggable: true,
                      type: "normal", // "normal" or "iframe"
                      modal: false
            });
            
            $("#uploadForm").photoUpload();
		/* uploadPhotoWindow = $.window({
             id: "uploadPhotos", 
             title: "Subir fotos",
             content: "<div class='uploadForm'>", // load window_block8 html content
             footerContent: '<input type="hidden" id="uploadState" value="0"><div id="uploadPhotosFooter">Selecciona las fotos que quieres subir</div>',
             containerClass: "portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all",
             headerClass: "portlet-header-centro ui-widget-header ui-corner-all",
             frameClass: "portlet-content",
             footerClass: "portlet-content",
             onClose: function() { // a callback function while user click close button
                  if(uploadPhotoWindow.getContainer().find(".state").val() == 1)
                  {
                          jConfirm("Si cierras la ventana se cancelaran todas las subidas que no se hayan finalizado","Confirmar cierre", 
                          function (r)
                          {
                                  if(r)
                                	  uploadPhotoWindow.close(true);
                          });
                          return false;
                  }else return true;
                  }
          });
		 uploadPhotoWindow.getContainer().find(".uploadForm").photoUpload();*/
	}
}

$.wixet.postmessagesCommands = new Array();

$.wixet.postmessagesCommands['goto'] = function(id,params){
    if($.trim(params['url']).indexOf("http://")==0)
        jConfirm("El enlace te lleva a una página externa de Wixet que puede ser inseguro y donde no podemos garantizar tu seguridad ¿Deseas continuar?","Confirmar",function(go){
            if(go)
                location.href=params['url'];
        });
    else
        location.href=params['url'];
};

$.wixet.postmessagesCommands['settile'] = function(id,params){
	$("#"+id).find(".title").text(params['title']);
};


$.wixet.postmessagesCommands['notice'] = function(id,params){
    $.wixet.userNotice(params.content);
}

$.wixet.postmessagesCommands['alert'] = function(id,params){
	jAlert(params.content,params.title);
}
$.wixet.postmessagesCommands['dialog'] = function(id,params){
	if(params.action == "create"){
		
		//When button is clicked a postmessage is sent to notify the event
		if(params.params.buttons){
			buttons = {};
			$.each(params.params.buttons,function(i,button){
				buttons[button] = function() {
					pm({
					  target: window.frames["iframe-"+params.params.gadgetId],
					  type: "dialog-button-"+button, 
					  data:{}
					});
				};
			});
			params.params.buttons = buttons;
		}
		/////

		diag = params.dialog.replace(/((<[\s\/]*script\b[^>]*>)([^>]*)(<\/script>))/ig,'');//Safe html
		$(diag).attr({id:"dialog-gadget-"+id}).dialog(params.params);
	}else if(params.action == "open"){
		$("#dialog-gadget-"+id).dialog('open');
	}else if(params.action == "close"){
		$("#dialog-gadget-"+id).dialog('close');
	}else if(params.action == "focus"){
		$("#dialog-gadget-"+id).find("#"+params.id).focus();
	}else if(params.action == "addClass"){
		$("#dialog-gadget-"+id).find("#"+params.id).addClass(params.className);
	}else if(params.action == "removeClass"){
		$("#dialog-gadget-"+id).find("#"+params.id).removeClass(params.className);
	}else if(params.action == "settext"){
		console.log(params.id);
		//$("#"+params.id).val(params.value);
		$("#"+params.id).text(params.value);
	}else if(params.action == "gettext"){
		return $("#dialog-gadget-"+id).find("#"+params.id).val();

	}

};



							
$(document).ready(function() {
console.log("hola");
//Language
        var lang = $.cookie("language");
        if(lang == null)
                lang = "es_ES";

        $._.setLocale(lang);
        $.get("/bundles/wixet/js/locals/config."+$._.getLocale()+".json",function(data){
                eval(data);
        });
 ////


//RPC config
    $.jsonRPC.setup({
  		endPoint: '/app_dev.php/rpc'
	});
/////////
	$(document).themeswitcher();
	$.wixet.body = $("#content");
/*if($("#chat").length)
	$("#chat").chat();
*/
	//Historial
	$.history.init(historial);
	function historial(hash)
	{
		if($.wixet.garbage.length > 0)
		{
			for(var i = 0; i<$.wixet.garbage.length; i++)
				$.wixet.garbage[i]();
			$.wixet.garbage = new Array();
		}

		var vars = new Object();
		var section;
		
		if(hash.length == 0)
			window.location.href = "#start";
		else{
			section = hash.split("#");
			section = section[0].split("?");
			section = section[0];
			//Cargamos widgets
			$.wixet.body.load("/"+section,function(){
				//Bind de postmessage to allow gadget communication
					$.each($(".widget"),function(i,widget){
						var id = $(widget).attr("id");
						pm.bind(id, function(data) {
							//console.log(JSON.stringify(data));
							var result;
							try{
								result = $.wixet.postmessagesCommands[data.command](id,data.parameters);
							}catch(e){
								console.log("Command "+data.command+" not allowed: "+e);
							}
							
							return result;
						});
					});
                                 
                                 
                                $( ".portletColumn" ).sortable({
				connectWith: ".portletColumn",
				handle: 'div.portlet-header',
                                stop: function(event,ui){
                                    var columns = new Array();
                                    $.each($( ".portletColumn" ),function(i,column){
                                        columns[i] = new Array();
                                        $.each($(column).find(".portlet"),function(j,row){
                                            var id = $(row).attr("id").split("-");
                                            columns[i][j] = id[1];
                                        
                                        });
                                    });
                                    $.post("widgetPosition",$.toJSON({section:section, positions:columns}));
                                    
                                }
			 });
                         
				});
	
                         
			/*$.getJSON("/section/"+section,function(data){
				var columnCenter = $("#columnCenter");
				var columnLeft = $("#columnLeft");
				
				$.each(data.center,function(i,widget){
					
						columnCenter.append('<div class="widget portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" id="widget-'+widget.id+'">'+
											'<div class="portlet-header ui-widget-header ui-corner-all move">'+
											'<div class="title">Gadget</div>'+
											'</div>'+
												'<iframe scrolling="no" frameborder="0" style="border: 0pt none; padding: 0pt; margin: 0pt; width: 100%; overflow: hidden;" src="http://code/info/memcache?url='+widget.url+'"></iframe>'+
											'</div>');
					});
					
				
				$.each(data.left,function(i,widget){
						columnLeft.append('<div class="widget portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" id="widget-'+widget.id+'">'+
											'<div class="portlet-header ui-widget-header ui-corner-all move">'+
											'<div class="title">Gadget</div>'+
											'</div>'+
												'<iframe scrolling="no" frameborder="0" style="border: 0pt none; padding: 0pt; margin: 0pt; width: 100%; overflow: hidden;" src="http://code/info/memcache?url='+widget.url+'"></iframe>'+
											'</div>');
					});
					
				$( ".column" ).sortable({
				connectWith: ".column",
				handle: 'div.portlet-header'
			 });	
			});*/
		  
		}

			
			//Imágenes
			/*$(".demo img[load!=false]")
			.addClass("ui-state-default ui-corner-all")
			.lazyload({
			    placeholder : "images/progress.gif",
			    effect : "fadeIn"
			});*/
			
			
			
		  //Ahora se hace sortable

		

	}
//Fin animacion widgets


	//El dock
	$('#dock').Fisheye(
		{
			maxWidth: 50,
			items: 'a',
			itemsText: 'span',
			container: '.dock-container',
			itemWidth: 30,
			proximity: 90,
			halign : 'center'
		}
	);			
	$("#dock").find("span").addClass("portlet-header-center ui-widget-header ui-corner-all");
	//Pijada para que no se quede marcado cuando se pincha
	$(".dock-item").click(
		function()
		{
			$(this).blur();
	});
	//find dock
		
	//actividad ajax
	var cargando = $("#ajaxLoading");
	cargando.hide();
	$(document).ajaxSend(function() {
		cargando.show();

		});
	
	$(document).ajaxComplete(function() {
		cargando.hide();
		});
	//fin actividad ajax
	
	//toolbar
	//Toolbar
	$("#buttons").buttonset();

		
	$("#but-start").click(
		function () { 
		  window.location.href = "#start"; 
		  $(this).blur();
		}
    );
    $("#but-profile").click(
		function () { 
		  window.location.href = "#profile"; 
		  $(this).blur();
		}
    );
    $("#but-search").click(
		function () { 
		  window.location.href = "#search"; 
		  $(this).blur();
		}
    );
    $("#but-contents").click(
    		function () { 
    		  window.location.href = "#contents"; 
    		  $(this).blur();
    		}
        );
    
    $("#but-services").click(
    		function () { 
    		  window.location.href = "#services"; 
    		  $(this).blur();
    		}
        );
	
		//$(".column").disableSelection();
		

	//fin toolbar

});

/*-----------*/
function userNotice(message)
{
        $.jGrowl(message, { 
                                        theme:  'manilla',
                                        speed:  'slow'});
}

$.wixet.userNotice = function(message){
	userNotice(message);
}

