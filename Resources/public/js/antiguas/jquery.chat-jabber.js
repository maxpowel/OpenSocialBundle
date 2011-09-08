var BOSH_SERVICE = '/http-bind';
var IMAGES_PATH = 'images/chat';
var connection = null;
var puedoSalir = false;

$(window).unload(function() {
	$.xmpp.disconnect();
});

(function($){


	$.fn.chat = function(options) {
		this.css({position: "absolute", top:"10px", right:"10px"});
		//var contactList = $('<ul class="ui-menu ui-widget ui-widget-content ui-corner-all" role="listbox" aria-activedescendant="ui-active-menuitem" style="position:absolute; right: 0px; display: none;"><li class="ui-menu-item" role="menuitem"><button>prueba</button></li></ul>');
		var contactList = $('<ul class="ui-menu ui-widget ui-widget-content ui-corner-all" role="listbox" aria-activedescendant="ui-active-menuitem"></ul>');
		contactList.append('<li class="nobody ui-menu-item" role="menuitem">Nadie conectado</li>');
		var actionButton;
		var buttonList = $("<button>").button({
            icons: {
            secondary: 'ui-icon-triangle-1-s'
        	},
        	label:"Chat"
		}).click(function(){
			//Hacemos que cuando se pinche fuera se cierra, pero sin crear infinitos eventos
			if(contactList.is(":visible"))
			 {
				 $(document).unbind("click");
				 contactList.slideUp();
			 }
			 else
			 {
				 contactList.slideDown(function(){
					 $(document).click(function(){
						 contactList.slideUp(function(){
							 $(document).unbind("click");
						 });
					 });
				 });
			 }
		});
		
		var actionList = $('<ul class="ui-autocomplete ui-menu ui-widget ui-widget-content ui-corner-all" role="listbox" aria-activedescendant="ui-active-menuitem" style="position:absolute; right: 0px; display: none;">'+
							'<li class="ui-menu-item ui-corner-all ui-state-default" style="border:0" role="menuitem" id="a"><a style="display: inline;" state="online" class="ui-corner-all" tabindex="-1">Conectado</a></li>'+
							'<li class="ui-menu-item ui-corner-all ui-state-default" style="border:0" role="menuitem" id="a"><a style="display: inline;" state="dnd" class="ui-corner-all" tabindex="-1">No disponible</a></li>'+
							'<li class="ui-menu-item ui-corner-all ui-state-default" style="border:0" role="menuitem" id="a"><a style="display: inline;" state="away" class="ui-corner-all" tabindex="-1">Ausente</a></li>'+
							'<li class="ui-menu-item ui-corner-all ui-state-default" style="border:0" role="menuitem" id="a"><a style="display: inline;" state="offline" class="ui-corner-all" tabindex="-1">Desconectado</a></li>'+
							'</ul>');
		actionList.find("li").hover(
				 function()
				 {
					 $(this).addClass("ui-state-hover");
				 },
				 function(){
					 $(this).removeClass("ui-state-hover");
				 }).click(function(){
					 var state = $(this).find("a").attr("state");
					 $.xmpp.setPresence(state);
					 actionButton.find("img").attr("src",IMAGES_PATH+"/"+state+".png");
					 $(document).unbind("click");
					 actionList.slideUp();
				 });

		actionList.find("button").button();
		actionButton = $("<button>").button({
        	label:"<img src='"+IMAGES_PATH+"/tray-connecting.png'>"
		}).click(function(){
			//Hacemos que cuando se pinche fuera se cierra, pero sin crear infinitos eventos
			if(actionList.is(":visible"))
			 {
				 $(document).unbind("click");
				 actionList.slideUp();
			 }
			 else
			 {
				 actionList.slideDown(function(){
					 $(document).click(function(){
						 actionList.slideUp(function(){
							 $(document).unbind("click");
						 });
					 });
				 });
			 }
		});
		//Quitar la clase para que no se vea tan gordote
		actionButton.find(".ui-button-text").removeClass("ui-button-text");
		//Ajustar el offset de la lista ya que se quita la clase y modifica la apariencia
		buttonList.css("top","-10px");


		
		/////
		this.append(buttonList,contactList,actionButton,actionList);
		//Colocamos la lista inicial	

		contactList.position({
			of: buttonList,
			my: "right top",
			at: "right bottom",
			offset: "1 8"
		});
		contactList.hide();

		
		//actionList.css("margin-top","-30px");
		
		
		//Nos conectamos
		$.xmpp.connect({jid:$.cookie("jid"),password:Base64.decode($.cookie("hash")),
			onConnect: function(data){
				actionButton.find("img").attr("src",IMAGES_PATH+"/online.png");
			},
			onMessage: function(data){
				response = $(data);
				var message = response.find("body:first").text();
				
				var from = response.attr("from").split("/");
				//TODO Revisar código redundnate//
				var id = MD5.hexdigest(from[0]);
				var conversation = $.window.getWindow(id);
				if(conversation != null){
					//The conversation exists
					var chatWindow = conversation.getContainer();
					if(chatWindow.find(".window_header_minimize").length > 0){
						chatWindow.css("opacity",1).find(".portlet-header").addClass("ui-state-highlight");
					}
				}else if(message.length>0){
					function fixContent(container){
						var textConversation = container.find(".conversation");
						var editor = container.find(".editor");
						textConversation.width(container.width()-10).height(container.height()-editor.height()-textConversation.find(".window_footer").height()-container.find(".window_title_text").height()-40).css("overflow","auto");
						editor.width(container.width()-8);

					}
					var dialog ="<div class='conversation ui-dialog-content ui-widget-content ui-corner-all'></div>"+
								'<div class="editor"></div>';

					var date = new Date();
					conversation = $.window({
					      title: "Conversation with "+from[0],
					      content: dialog, // load window_block2 html content
					      footerContent: 'Chat started at '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds(),
					      id: id,
					      afterCascade: function(){
						  		conversation.select();
						  		fixContent(conversation.getContainer());
						  },
						  onCascade: function(){
							//Remove new message notification
							conversation.getContainer().find(".portlet-header").removeClass("ui-state-highlight");
						  },
					      afterResize: function() {
					    	  fixContent(conversation.getContainer());
					      },
					      afterMaximize: function(){
							 fixContent(conversation.getContainer());
					      },
					      afterRestore: function(){
							 fixContent(conversation.getContainer());
					      }

					   });

					
					conversation.getContainer().append("<span class='jid' style='visibility:hidden'>"+from[0]+"</span>");
					conversation.getContainer().find(".editor").editor({onEnter: function(localText){
						if($.trim(localText.text()).length>0){
							var to = conversation.getContainer().find(".jid").text();
							conversation.getContainer().find(".conversation").append("<div>Yo: "+localText.text()+"</div>");
							conversation.getContainer().find(".conversation").attr({ scrollTop: conversation.getContainer().find(".conversation")[0].scrollHeight });
							$.xmpp.sendMessage({to:to, message:localText.text()});
							$.xmpp.isWriting({to:to, isWriting:false});
						}
						
						
					}});
					
					conversation.getContainer().find(".text").keyup(function(){
						
						if($(this).text().length == 1){
							var to = conversation.getContainer().find(".jid").text();
							$.xmpp.isWriting({to:to, isWriting:true});
						}
						else if($(this).text().length == 0){
							var to = conversation.getContainer().find(".jid").text();
							$.xmpp.isWriting({to:to, isWriting:false});
						}
					});
					//Fix window elements position
					fixContent(conversation.getContainer());
					
					//
				}

				if(response.find("composing").length > 0 && response.find("body").length == 0)
					conversation.setFooterContent("Está escribiendo");
				else if(response.find("active").length > 0)
					conversation.setFooterContent("");
				//Fin código redundante//
				if(message.length > 0){
					conversation.getContainer().find(".conversation").append("<div>"+from[0]+": "+message+"</div>");
					conversation.getContainer().find(".conversation").attr({ scrollTop: conversation.getContainer().find(".conversation")[0].scrollHeight });
				}
			},
			onIq: function(data){
				//console.log(data);
			},
			onPresence: function(data){
				var from = $(data).attr("from").split("/");
				var contact = contactList.find(".contact:contains('"+from[0]+"')").parent();
				if(contact.length){
					if($(data).attr("type")=="unavailable"){
						contact.remove();
						if(contactList.find("li").length == 1)
								contactList.find(".nobody").css("display",null);
						
					}else{
						var state = $(data).find("show").text();
						if(state.length == 0)
							state = "online";
					
						contact.find("img").attr("src","images/chat/"+state+".png");
					}
					
				}else{
					var state = $(data).find("show").text();
					if(state.length == 0)
						state = "online";
					
					contact = $('<li class="ui-menu-item" role="menuitem"><span class="contact">'+from[0]+'</span><div><img style="float:left" src="images/chat/'+state+'.png"><button>'+from[0]+'</button></div></li>');
					contact.find("button").button().click(function(){
						//TODO Revisar código redundnate//
						var id = MD5.hexdigest(from[0]);
						var conversation = $.window.getWindow(id);
						if(conversation != null){
							//The conversation exists
							//If minimized, will restore, else just focus it
							try{
								conversation.restore();
							}catch(e){
								conversation.select();
							}
						}else{
							function fixContent(container){
								var textConversation = container.find(".conversation");
								var editor = container.find(".editor");
								textConversation.width(container.width()-10).height(container.height()-editor.height()-textConversation.find(".window_footer").height()-container.find(".window_title_text").height()-40).css("overflow","auto");
								editor.width(container.width()-8);

							}
							var dialog ="<div class='conversation ui-dialog-content ui-widget-content ui-corner-all'></div>"+
										'<div class="editor"></div>';

							var date = new Date();
							conversation = $.window({
							      title: "Conversation with "+from[0],
							      content: dialog, // load window_block2 html content
							      footerContent: 'Chat started at '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds(),
							      id: id,
							      afterCascade: function(){conversation.select(); fixContent(conversation.getContainer());},
							      afterResize: function() {
							    	  fixContent(conversation.getContainer());
							      },
							      onCascade: function(){
										//Remove new message notification
										conversation.getContainer().find(".portlet-header").removeClass("ui-state-highlight");
							      },
							      afterMaximize: function(){
									 fixContent(conversation.getContainer());
							      },
							      afterRestore: function(){
									 fixContent(conversation.getContainer());
							      }

							   });
							conversation.getContainer().append("<span class='jid' style='visibility:hidden'>"+from[0]+"</span>");
							conversation.getContainer().find(".editor").editor({onEnter: function(localText){
								if($.trim(localText.text()).length>0){
									var to = conversation.getContainer().find(".jid").text();
									conversation.getContainer().find(".conversation").append("<div>Yo: "+localText.text()+"</div>");
									conversation.getContainer().find(".conversation").attr({ scrollTop: conversation.getContainer().find(".conversation")[0].scrollHeight });
									$.xmpp.sendMessage({to:to, message:localText.text()});
									$.xmpp.isWriting({to:to, isWriting:false});
								}
								
								
							}});
							
							conversation.getContainer().find(".text").keyup(function(){
								
								if($(this).text().length == 1){
									var to = conversation.getContainer().find(".jid").text();
									$.xmpp.isWriting({to:to, isWriting:true});
								}
								else if($(this).text().length == 0){
									var to = conversation.getContainer().find(".jid").text();
									$.xmpp.isWriting({to:to, isWriting:false});
								}
							});
							//Fix window elements position
							fixContent(conversation.getContainer());
							
							//
						}
						if(response.find("composing").length > 0 && response.find("body").length == 0)
							conversation.setFooterContent("Está escribiendo");
						else if(response.find("active").length > 0)
							conversation.setFooterContent("");
						//Fin código redundante//
					});
					contactList.find(".nobody").css("display","none");
					contactList.append(contact);
				}
				

			}
			
		});
	};
    
	$.fn.chat.defaults  = {

	};
	
	
	
	
})(jQuery);
