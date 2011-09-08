(function ($) {

$.fn.photoUpload = function () {
	var container;
	var state = $("<input type='hidden' class='uploadState' value='0'/>");
	$(this).append(state);
	$(this).append(
			'<div style="padding: 25px;">'+
			'<h3>Selecciona las fotos que quieres subir</h3>'+
			'<div class="sub forms">'+
			'</div>'+
			'<div class="sub"><h3>Subir fotos al album</h3><span style="position:absolute; z-index:10000"><select id="inAlbum"></span><option>Prueba</option></select></div>'+
                        '<span style="float:right"><button>Subir fotos</button></span>'+
			'</div>');
                    
                    
        var albums = $(this).find("#inAlbum");
        
        
        var req=opensocial.newDataRequest();
        req.add(req.newFetchUserAlbumsRequest('OWNER'), "albums");

        req.send(function(data){
            var albumData = data.get("albums").getData()
            albumData.each(function(album){
                if(album.getField("main")){
                    albums.append("<option selected value='"+album.getField("id")+"'>"+album.getField("name")+"</option>");
                }else{
                    albums.append("<option value='"+album.getField("id")+"'>"+album.getField("name")+"</option>");
                }
            });
            
            albums.chosen();
            
        });
        
        
	$(this).find("button").button().click(function(){
                var albumSelected = albums.find(":selected");
                var parent = albums.parent().parent();
                parent.html("");
                $(this).remove();
                parent.append("<span>Subiendo fotos al album \""+albums.find(":selected").text()+"</span>\"");
                
		state.val(1);
		$.each(container.find(".file"),function(i,element){
			if($(element).val().length > 0)
			{
				var form = $(element).parent();
				$.getJSON("/uploadKey",function(data){
					var progressBar = null;
					var thisInterval = null;
					form.find("[name=APC_UPLOAD_PROGRESS]").val(data.key);
					form.ajaxForm({ beforeSubmit: function() {
							progressBar = $("<div>").height(15).width(form.find(".text").width());
							form.find("button").button('disable');
							form.find(".file").css("display","none");
							form.append(progressBar);
                        	progressBar.progressbar({ value: 10 });

                        },
                        success: function(data){	
                        	var response = eval('('+data+')');
                        	clearInterval(thisInterval);
                        	if(response.error == false)
                            {
                                    userNotice(response.message);
                                    //Set permissions
                                    var req = opensocial.newDataRequest();
                                    $.each(groupsAllowed,function(i,groupId){
                                        var permission = new opensocial.Permission({"groupId":groupId, "readGranted":true});
                                        req.add(req.newAddPermissionRequest("mediaItem",response.id,permission), "event");
                                    });
                                    req.send();
                                    
                                    ////////////////
                                    message = $('<a class="ui-helper-reset ui-corner-all" href="#mediaItem/'+response.id+'"><img class="ui-state-default ui-corner-all" src="'+response.thumbnail_url+'"></a>');
                                    try{
                                    	$.window.getWindow("uploadPhotos").setFooterContent(response.message);
                                    }catch(e){/*Window closed*/}
                            }else{
                            		message = $("<div>");
                                    userNotice(response.message);
                                    message.append(response.message);
                                    message.addClass("ui-state-error ui-corner-all");
                                    try{
                                    	$.window.getWindow("uploadPhotos").setFooterContent(response.message);
                                    }catch(e){/*Window closed*/}
                            }
                        	form.children().remove();
                        	form.append(message);
                        	if(container.find(".file").length == 0)
                        		state.val(0);
                        }
					});
					form.submit();
					thisInterval = setInterval(function(){
						 $.getJSON("/progressKey/"+data.key,
	                                function(data){
							 				progressBar.progressbar({ value: data.current*100/data.total });
	                                        if(data.done == 1 || $.window.getWindow("uploadPhotos").length == 0)
	                                        	clearInterval(thisInterval);
	                                });
					},5000);
				});
			}else $(element).parent().remove();
		});
		$(this).button('disable').blur();
	});
	
	form = $("<div style='padding:3px'>"+
			'<form enctype="multipart/form-data" action="app_dev.php/upload" method="POST">'+
				'<input type="hidden" name="APC_UPLOAD_PROGRESS">'+
				"<input type='file' name='file' class='file' style='float:right; position:absolute; z-index: 1; opacity:0'>" +
				"<input class='text ui-widget-content ui-corner-all' type='text'>&nbsp;&nbsp;<button>Examinar</button>"+
			'<form>'+
			'</div>');
	container = $(this).find(".forms");
	for(var i=0;i<5;i++){
		container.append(form.clone());
	}
	
	container.find("button").button()/*.click(function(){
		//form.find(".file").click();
	})*/;
	container.find(".text").attr("disabled",true);
	container.find(".file").hover(
			function(){$(this).parent().find("button").focus();},
			function(){$(this).parent().find("button").blur();}
		).change(function(){
			$(this).parent().find(".text").val($(this).val());
		}).height(27);
	
	
	
	
	


};

})(jQuery);
