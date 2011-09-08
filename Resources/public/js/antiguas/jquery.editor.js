(function($){
//TODO hacer i18n este plugin
        var settings;
	$.fn.editor = function(options) {

		settings = $.extend({}, $.fn.editor.defaults, options);
		

		$(this).addClass("text").attr("align","left");
		
		var text = $("<div>").html($(this).html()).addClass("text ui-widget ui-widget-content ui-corner-all")
							                       .attr({contenteditable: true, border:0, id:$(this).attr("id")+"-text"})
							                       .css("overflow","auto");

		
		text.click(function(){
			text.blur();
			text.focus();
		});
		
		
		var barra = $("<div>").html('<table class="ui-buttonset"><tr></td></table>');
		$(this).html("");
		$(this).append(barra,text);
		
		barra.addClass("ui-widget-header ui-corner-all ui-helper-clearfix");
		var buttonset = barra.find(".ui-buttonset").find("tr");
		if(settings.emoticon){
			var row = $("<td>");
			var select = $("<select style='display:none'>");
			row.append(select);
			buttonset.append(row);
			/*$.getJSON("core/user/emoticonList",function(data){
				
				
				$.each(data,function(i,emoticon){
					select.append('<option value="'+emoticon.short_key+'">'+emoticon.id+'</option>');
				});
				select.selectmenucontainer({style:'dropdown',maxHeight:100,icon:'images/icons/emoticon.png',imageList:true,callback:function(element){
					text.append(element.attr("title"));
				}});
			});*/
		}
		
		if(settings.youtube){
			var dialog;
			function paginateYoutube(page){
				var videoList = dialog.find("#videoList");
				videoList.html('<div align="center"><img class="ui-state-default ui-corner-all" src="/bundles/wixet/images/progress.gif" /></div>');
				$.getJSON("core/search/youtube/query/"+dialog.find("#query").val()+"/size/5/page/"+page,
						function(data)
						{
							videoList.html('');
							dialog.find(".paginator").pager({ pagenumber: page, pagecount: data.pages, buttonClickCallback: paginateYoutube });
							$.each(data.videos,function(i,video){
								var element = $("<li><button>Insertar</button><div class='ui-state-default ui-corner-all'><div><a href='javascript:void(0)'><img class='ui-state-default ui-corner-all' src='"+video.thumbnail+"' /></a></div><div class='title'>"+video.title+"</div></div></li>");
								videoList.append(element);
								element.find(".title").width(100);
								element.find("button").button().click(function(){
									text.append("[youtube]"+video.id+"[/youtube]");
									dialog.dialog('close');
								});
								element.find("a").click(function(){
									$.youtubePlayer.play(video.id);
								});

							});
						}
				);
			};
			buttonset.append('<td><button class="youtube ui-state-default ui-corner-all">'+
							 '<img src="/images/icons/youtube.png">'+
							 '</button></td>');
			var youtton = buttonset.find(".youtube");
			youtton.button().css("margin","0").find(".ui-button-text").css("padding","3px");
			
			youtton.click(function(){
				var searchButton = $("<button>Buscar</button>")
					.button()
					.click(
							function() {
								//dialog.find(".paginator").pager({ pagenumber: 1, pagecount: 0, buttonClickCallback: paginateYoutube });
							    paginateYoutube(1);
							}
						);
				 
				dialog = $('<div align="center" id="dialog-youtube" title="Videos de Youtube">'+
						'<div>Descripcion: <input id="query" class="text ui-widget-content ui-corner-all" type="text">&nbsp;</div>'+
						'<div align="center"><ul id="videoList" class="thumbs"></ul></div>'+
						'<div align="center"><div class="paginator" style="clear:left"/></div></div>');
				dialog.find("#query").parent().append(searchButton);
				dialog.find("#query").keyup(function(key){
					if(key.keyCode == 13)
						searchButton.click();
				});

				
				dialog.dialog({
					autoOpen: true,
					bgiframe: true,
					width: 800,
					modal: true,
					draggable:false,
					resizable:false
				});
			});
			
			
		}
		
		if(settings.sound){
			var rowSound = $("<td>");
			var selectSound = $("<select style='display:none'>");
			rowSound.append(selectSound);
			buttonset.append(rowSound);
			buttonset.append('<td><input type="text" class="search ui-widget-content ui-corner-all ui-autocomplete-input" title="Buscar sonido" />&nbsp;<span class="soundname"></span><input type="hidden" class="soundid">'+
			'<span class="playerEditor" style="display:none">'+
			'<a href="javascript:void(0)"><span class="remove icon-right ui-icon ui-icon-close"></span></a>'+
			'<a href="javascript:void(0)"><span class="stop icon-right ui-icon ui-icon-stop"></span></a>'+
			'<a href="javascript:void(0)"><span class="play icon-right ui-icon ui-icon-play"></span></a>'+
			'</span></td>');
			buttonset.find(".play").click(function() {
				$.audioPlayer.play('/core/sound/play/id/'+buttonset.find(".soundid").val());
			});
			
			buttonset.find(".stop").click(function() {
				$.audioPlayer.stop();
			});
			
			buttonset.find(".remove").click(function() {
				buttonset.parent().parent().parent().find(".soundid").val("");
				buttonset.parent().parent().parent().find(".soundname").text("");
				buttonset.find(".playerEditor").hide();
				$.audioPlayer.stop();
			});
			
			/*$.getJSON("core/user/soundList",function(data){
				
				
				$.each(data,function(i,sound){
					selectSound.append('<option value="'+sound.sound_id+'">'+sound.name+'</option>');
				});
				selectSound.selectmenucontainer({style:'dropdown',maxHeight:100,icon:'images/icons/sound.png',callback:function(element){
					buttonset.find(".playerEditor").show();
					buttonset.find(".soundid").val(element.attr("title"));
					buttonset.find(".soundname").text(element.text());
				}});
			});*/
			buttonset.find(".search").hint().autocomplete({
				source: "core/search/sound",
				minLength: 2,
				select: function(event, ui) {
					buttonset.find(".playerEditor").show();
					buttonset.find(".soundid").val(ui.item.id);
					buttonset.find(".soundname").text(ui.item.label);
					setTimeout(function(){ buttonset.find(".search").val(""); },100);

				}
			});
		}
		
		if(settings.post != null){
			var button = $('<button id="but-sendComment">'+ settings.post.button +'</button>');
			var buttonContainer = $("<div align='center' style='margin-top:10px; margin-bottom:10px'>");
			buttonContainer.append(button);
			$(this).append(buttonContainer);
			var context = $(this);
			button.button().click(function(){
				post(context,settings.post.url,settings.post.callback,settings.post.cleanOnSubmit)
			});
		}
		
		if(settings.onEnter != null)
		{
			text.keydown(function(e)
			{
				if(e.keyCode == 13 && !e.shiftKey)
				{
					settings.onEnter(text);
					
				}
			});
			
			text.keyup(function(e)
					{
						if(e.keyCode == 13 && !e.shiftKey)
						{
							text.html("");
							text.blur();
							text.focus();
							
						}
					});

			
		}
		text.height(settings.height);
		$(this).width(settings.width);
		text.blur();
		text.focus();		
		
	};
	

	$.fn.editor.emoticons = {},
	
	function getContent(){
		return this.text;
	};
	
	function post(context,url,callback,clean){
			var textEditor = context;
			var text = textEditor.find(".text");
			var sombra = $("<div align='center' class='sombra ui-widget-overlay ui-corner-all'></div>").css({width: text.width()+1, height: text.height()+1, position: "absolute", left: text.position().left, top: text.position().top});
			textEditor.append(sombra);
			var img = $("<br><img class='ui-state-default ui-corner-all' src='/bundles/wixet/images/progress.gif'/>");
			sombra.append(img);
			textEditor.addClass("ui-overlay");
			var contenido = text.html();

			soundObj = textEditor.find(".soundid");
			if(soundObj){
				sound = soundObj.val();
				soundObj.val("");
				textEditor.find(".soundname").val("");
			}
			else
				sound = null;


                        //Using opensocial
                        var req = opensocial.newDataRequest();
                        
                        if(settings.post.type == "mediaItem"){
                            req.add(req.newCreateMediaItemCommentRequest(settings.post.id,contenido,{}), 'comments');
                        }else if(settings.post.type == "profile"){
                            req.add(req.newCreateProfileCommentRequest(settings.post.id,contenido,{}), 'comments');
                        }


                        req.send(function(data){
                            if(clean)
                                    text.html("");
                            if(callback != null)
                                    callback(data);
                            textEditor.find(".sombra").remove();
                        });
			/*$.post(url,{content: contenido,sound:sound},
					function(data){
						if(data.error)
						{
							text.html(contenido);
							//mensajeSistema("No se pudo insertar el comentario");
						}else{
							if(clean)
								text.html("");
							if(callback != null)
								callback(data);
						}
						textEditor.find(".sombra").remove();
					});*/
	}
	
	
	$.fn.editor.defaults  = {
			onEnter : null,
			height: 35,
			width: 390,
			post: null,
			cleanOnSumbit: true,
			youtube: true,
			emoticon: true,
			sound: true
	};
	

	
	
})(jQuery);
