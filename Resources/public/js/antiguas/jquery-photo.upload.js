(function ($) {

$.fn.photoUpload = function () {
	var container;
	var state = $("<input type='hidden' id='uploadState' value=''/>");
	$(this).append(state);
	$(this).append(
			'<div style="padding: 25px;">'+
                        '<div class="sub"><h3>Subir fotos al album</h3></div>'+
                        '<div><span style="z-index:10000"><select style="display:none" id="inAlbum"></select><br/></div>'+
			'<h3>Selecciona las fotos que quieres subir</h3>'+
			'<div class="sub forms">'+
			'</div>'+
			'</div>'+
                        '<div align="center"><br><br>'+
                                '<div id="uploadName"></div>'+
                                '<div style="width:50%" id="uploadProgress"></div><br>'+
                        '</div>'+
                        '<ul id="photoListUploaded" class="thumbs"></ul>');
                    
                    
        var albums = $(this).find("#inAlbum");
        
        
        var req=opensocial.newDataRequest();
        req.add(req.newFetchUserAlbumsRequest('OWNER'), "albums");

        req.send(function(data){
            var albumData = data.get("albums").getData()
            albumData.each(function(album){
                if(album.getField("main")){
                    albums.append("<option selected='selected' value='"+album.getField("id")+"'>"+album.getField("name")+"</option>");
                }else{
                    albums.append("<option value='"+album.getField("id")+"'>"+album.getField("name")+"</option>");
                }
            });
            albums.chosen({customNotFound:function(terms){
                    no_results_html = $('<li class="no-results"><div>No se encontró el album "<span>'+terms+'</span>".<div><br/> <div><a style="text-decoration: none; font-weight: bold"  href="javascript:void(0)">Crear album "<span>'+terms+'</span>"</a></div></li>');
                    no_results_html.find("a").click(function(){
                        
                        var req=opensocial.newDataRequest();
                        req.add(req.newCreateAlbumRequest("OWNER",terms), "albumId");

                        req.send(function(data){
                            var id = data.get("albumId").getData();
                            albums.find("option:selected").attr("selected", "false");
                    
                            albums.append("<option selected='selected' value='"+id+"'>"+terms+"</option>");
                            albums.trigger("liszt:updated");
                                
                        });
                    });
                    return no_results_html;
            }});
        });
        
	
	form = $("<div align='center' style='padding:3px'>"+
				"<input type='file' multiple='multiple' name='file' class='file' style='float:right; position:absolute; z-index: 1; opacity:0'>" +
				"<button>Seleccionar fotos</button>"+
			'</div>');
	container = $(this).find(".forms");
        container.append(form);

	
	container.find("button").button();
	container.find(".text").attr("disabled",true);
	container.find(".file").hover(
			function(){$(this).parent().find("button").focus();},
			function(){$(this).parent().find("button").blur();}
		).change(function(){
			$(this).parent().find(".text").val($(this).val());
		}).height(27);
	
	
        var progressBar = $( "#uploadProgress" );
        var uploadName = $("#uploadName");
	$(".file").html5_upload({
                                        url: function(){
                                          return "/html5_upload?albumId="+albums.find("option:selected").val();  
                                        },
                                        sendBoundary: window.FormData || $.browser.mozilla,
                                        onFinish: function(event, total) {
                                            progressBar.progressbar('destroy');
                                            uploadName.html("");
                                            state.val("");
                                            window.onbeforeunload = null;
                                            userNotice("Todas las fotos se han subido con éxito");
                                        },
                                        onStart: function(event, total) {
                                                window.onbeforeunload = function(){
                                                    return 'Atención: Si continuas se cancelará la subida de fotos';
                                                };
                                                state.val("PROCESS");

                                            return true;
                                        },
                                        setName: function(text) {
                                                        uploadName.html(text);
					},
                                        setProgress: function(val) {
                                            progressBar.progressbar({value: Math.ceil(val*100)});        
                                        },
                                        onFinishOne: function(event, response, name, number, total) {
                                                //alert(response);
                                                //console.log(response);
                                                response = eval("("+response+")");
                                                $("#photoListUploaded").append('<li><a class="ui-helper-reset ui-corner-all" href="#mediaItem/'+response.id+'"><img class="ui-state-default ui-corner-all" src="'+response.thumbnail_url+'"></a></li>');
                                                
                                                
                                        }
                                });

	
	


};

})(jQuery);
