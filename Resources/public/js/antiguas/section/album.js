$(document).ready(function(){

    $(".ui-icon-trash").click(function(){
            removeAlbum(this);

    });

    $(".ui-icon-gear").click(function(){
            configureAlbum($(this).parent().attr("album"));
    });

    $("#cont-albumList").find("span").parent().click(function(){
            $(this).blur();
            location.href="#album/"+$(this).parent().attr("album");
    });

    $("#but-newAlbum").button().click(function(){
            jPrompt("Please write the name for your new album","Album name","New album",function(name){
                    if(name)
                    {
                            createAlbum(name);
                    }
            });
    });
    paginate(1);
});

function paginate(page){
	$("#loadingAlbum").show();
	$("#loadedAlbum").hide();
	var req = opensocial.newDataRequest();
	var params = {};
	params[opensocial.DataRequest.MediaItemRequestFields.FIRST] = (page-1)*10;
	params[opensocial.DataRequest.MediaItemRequestFields.MAX] = 10;
	//params[opensocial.MediaItem.Field.ALBUM_ID] = $("#albumId").val();
	req.add(req.newFetchMediaItemsRequest('OWNER',$("#albumId").val(),params), 'mediaItems');
	req.send(function(data){
		var mediaItems = data.get('mediaItems').getData();
		var list = $("#photoList");
		list.html("");
		mediaItems.each(function(mediaItem){
			list.append('<li class="ui-corner-all ui-state-default" photo="'+ mediaItem.getField(opensocial.MediaItem.Field.ID) +'">'+
						'	<a href="#mediaItem/'+ mediaItem.getField(opensocial.MediaItem.Field.ID) +'"><img sytle="height: 115px;" src="'+ mediaItem.getField(opensocial.MediaItem.Field.THUMBNAIL_URL) +'"/></a>'+
						'	<div class="move">'+ mediaItem.getField(opensocial.MediaItem.Field.TITLE) +'<span style="float:right; vertical-align:top" class="ui-icon ui-icon-arrow-4"></span></div>'+
						'</li>');
						
			});
		$("#loadingAlbum").hide();
		$("#loadedAlbum").show();
		$(".paginator").pager({pagenumber: page, pagecount: Math.ceil((mediaItems.getTotalSize()/10)), buttonClickCallback: paginate});
		makeDragNDrop();
	});
	
}

function makeDragNDrop(){
	$("#photoList").find("li").draggable({revert: true, handle: 'div'});

				$("#cont-albumList").find("li").droppable({
						tolerance: 'pointer',
						greedy: true,
						activeClass: 'ui-state-hover',
						hoverClass: 'ui-state-highlight',
						drop: function(event, ui) {
								ui.draggable.fadeOut(function(){ui.draggable.remove();});
                                                                
                                                                var req = opensocial.newDataRequest();
                                                                var params = {};
                                                                params[opensocial.MediaItem.Field.ALBUM_ID] = $(this).attr("album");
                                                                req.add(req.newUpdateMediaItemRequest('OWNER', $(this).attr("album"), ui.draggable.attr("photo"),params), 'update');
                                                                req.send();


						}


		});
	
}



				
				/*$("ul").prepend('<li class="tagged ui-state-default ui-corner-all">'+
				'	<a href="#album/tagged/id/'+$.url.getParam("id")+'"><img class="ui-state-default ui-corner-all" src="/core.php/photo/thumbnail/id//type/mini"/>'+
				'	<span>'+$._('Tagged')+'</span>'+
				'	</a>'+
				'</li>');*/
			
			
			function configureAlbum (albumId) {
				var widget = this.widget;
				var dialog = null;
				var buttonsOpts = {};
				buttonsOpts[$._('Cancel')] = function (){
					$(this).dialog('close');
				};
				
				buttonsOpts[$._('Save changes')] = function() {
					var name = $.trim(dialog.find(".name").removeClass("ui-state-error").val());
					var allowed = new Array();
					var denied = new Array();
					var ok = true;
					if(name.length > 0)
					{
						$.each(dialog.find(".allowed option:selected"),function(i,group){
							allowed.push({id:$(group).val()});
						});
						
						$.each(dialog.find(".denied option:selected"),function(i,group){
							denied.push({id:$(group).val()});
						});
						
						$.getJSON("/core/album/newName/id/"+albumId+"/name/"+name,function(data){
							if(data.error)
							{
								ok = false;
								jAlert(data.message,"Error");
							}
							else{
								$("[album="+albumId+"] span").text(name);
								
								if($("ul").attr("album") == albumId)
									$(".title").text(name);
									
								userNotice($._('The album name have been successfully changed'));
							}
								
						});
						
						$.post("/core/album/newPermissions/id/"+albumId,{permissions:$.toJSON({allowed:allowed,denied:denied})},function(data){
							data = eval("("+data+")");
							if(data.error)
							{
								ok = false;
								jAlert(data.message,"Error");
							}else
								userNotice($._('The album permissions have been successfully changed'));
						});
						
						if(ok)
						{
							$(this).dialog('close');
						}
						
					}else{
						var input = dialog.find(".name");
						input.focus().addClass("ui-state-error");
						jAlert($._('Please write an album name'),"Error",function(){
							input.focus();
						});
					}
				};
				dialog = $('<div id="dialog-confirm" title="Album Configuration">'+
						'<br /><div align="center"><img class="ui-state-default ui-corner-all" src="/bundles/wixet/images/progress.gif" /></div>'+
						'</div>').dialog({
							resizable: true,
							height:400,
							width: 500,
							modal: true,
							open: function(){
								$.getJSON("/core/album/details/id/"+albumId,function(album){
									dialog.html("<div>"+$._('Album name')+": <input type='text' class='name ui-widget-content ui-corner-all' value='"+album.name+"'></div>" +
											'<br/><br/></div>');
									dialog.append("<div align='center' class='ui-widget-header ui-corner-all'>"+$._('Access allowed')+"</div>");
									dialog.append("<div align='center' multiple class='allowed'></select></div>");
									
									dialog.append("<br/><br/><div align='center' class='ui-widget-header ui-corner-all'>"+$._('Access denied')+"</div>");
									dialog.append("<div align='center' multiple class='denied'></select></div>");
									
									$.getJSON("/core/album/permissionsDetails/id/"+albumId,function(groups){
										var allowedSelect = dialog.find(".allowed");
										var deniedSelect = dialog.find(".denied");
										$.each(groups.allowedGroups,function(i,group){
											allowedSelect.append("<option selected value='"+group.group_id+"'>"+group.group_name+"</option>");
										});
										$.each(groups.undefinedAllowedGroups,function(i,group){
											allowedSelect.append("<option value='"+group.group_id+">"+group.group_name+"</option>");
										});
										
										$.each(groups.deniedGroups,function(i,group){
											deniedSelect.append("<option selected value='"+group.group_id+">"+group.group_name+"</option>");
										});
										$.each(groups.undefinedDeniedGroups,function(i,group){
											deniedSelect.append("<option value='"+group.group_id+">"+group.group_name+"</option>");
										});
										allowedSelect.multiselect();	
										deniedSelect.multiselect();
									});
								});
							},
							buttons:buttonsOpts
						});


			}
			
			
			//Nuevo
			function removeAlbum(element) {
				var row = $(element).parent();
				jConfirm("Realmente quieres borrar el album \""+row.find("span").text()+"\"? (los archivos multimedia del directorio también serán eliminados)","Confirmacion",function(e){
					if(e){
						var req=opensocial.newDataRequest();
						req.add(req.newDeleteAlbumRequest("OWNER",row.attr("album")), "result");
			
						req.send(function(data){
							var res = data.get("result").getData();
							if(res.error)
								jAlert(res.message,"Error");
							else
								document.location.href="#album?reload="+(new Date().getTime());
						});
					}
				});
			}
			
			function createAlbum(name) {
				//var album = new opensocial.Album();
				//album.setField(opensocial.Album.Field.TITLE,name);
				
				var req=opensocial.newDataRequest();
				req.add(req.newCreateAlbumRequest("OWNER",name), "albumId");
	
				req.send(function(data){
					var id = data.get("albumId").getData();
					document.location.href="#album/"+id;
				});
			}
			
			
			//Fin nuevo
			function loadAlbum(albumId,page) {
				
				$.getJSON("/core/album/photos/id/"+albumId+"/page/"+page,function(data){
					if(data.error)
						location.href="#album";
					else{
						/*$.widget.photoList.$(".paginator").text(data.photos.pagecount);
						var photoList = $('<ul class="thumbs" album="'+albumId+'">');
						$.each(data.photos.photos,function(i,photo){
							photoList.append('<li class="ui-corner-all ui-state-default" photo="'+photo.photo_id+'">'+
							'<a href="#photo/loadPhoto/id/'+photo.photo_id+'"><img style="height: 115px;"src="/core.php/photo/thumbnail/id/'+photo.photo_id+'/type/list"/></a>'+
							'<div class="move">'+photo.title+'<span style="float:right; vertical-align:top" class="ui-icon ui-icon-arrow-4" /></div>'+
						'</li>');
						});

						try{
							$.widget.photoList.$(".photos").html(photoList).append('<input type="hidden" id="txt-albumName" value="'+data.album.name+'"')
							.find("img")
							.addClass("ui-state-default ui-corner-all")
							.lazyload({
							    placeholder : "images/progress.gif",
							    effect : "fadeIn"
							});
						
						}catch(err){
							jAlert($._("Dependency missing")+": "+err.message);
						}
						$.widget.photoList.preparePhotoList();*/
					}
				});

			}

