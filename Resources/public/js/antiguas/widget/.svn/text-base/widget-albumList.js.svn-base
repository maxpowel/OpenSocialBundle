(function($) {
	
	$.widget.albumList = {
			widget: null,
			init: function(widget) {
				this.widget=$(widget);
				widget = this.widget;
				
				var albumList = this;
				
				widget.find(".ui-icon-trash").click(function(){
					albumList.removeAlbum(this);
					
				});
				
				widget.find(".ui-icon-gear").click(function(){
					albumList.configureAlbum($(this).parent().attr("album"));
				});
				
				widget.find("span").parent().click(function(){
					$(this).blur();
					location.href="#album/loadAlbum/id/"+$(this).parent().attr("album");
				});
				
				widget.find("#but-newAlbum").button().click(function(){
					jPrompt($._("Please write the name for your new album"),$._("Album name"),$._("New album"),function(name){
						if(name)
						{
							$.post("/core/album/new",{name:name},function(data){
								data = eval('('+data+')');
								if(data.error)
									jAlert($._('Creating album "%"',new Array(name))+": "+data.message);
								else {
									element=$('<li class="ui-state-default ui-corner-all" album="'+data.id+'">'+
								      '<a href="javascript:void(0)"><img src="/core/photo/thumbnail/id/null/type/mini"/>'+
								      '<span>'+name+'</span></a>'+
								  	  '<a href="javascript:void(0)" style="float:right;" class="ui-icon ui-icon-trash" title="'+$._('Remove')+'"></a>'+
									  '<a href="javascript:void(0)" style="float:right;" class="ui-icon ui-icon-gear" title="'+$._('Edit')+'"></a>'+
								      '</li>');
									element.find("span").click(function(){
								    	  $(this).blur();
									  		albumList.loadAlbum(data.id);
									      });
									
									widget.find("#cont-albumList").append(element);
									element.fadeIn().find(".ui-icon-trash").click(function(){
										albumList.removeAlbum(this);
									});
									
									widget.find(".ui-icon-gear").click(function(){
										albumList.configureAlbum($(this).parent().attr("album"));
									});
									
									
									element.find("img")
									.addClass("ui-state-default ui-corner-all")
									.lazyload({
									    placeholder : "images/progress.gif",
									    effect : "fadeIn"
									});
									
									$.widget.photoList.preparePhotoList();
							
								}
							});
						}
					});
				});
				this.widget.find("ul").prepend('<li class="tagged ui-state-default ui-corner-all">'+
				'	<a href="#album/tagged/id/'+$.url.getParam("id")+'"><img class="ui-state-default ui-corner-all" src="/core.php/photo/thumbnail/id//type/mini"/>'+
				'	<span>'+$._('Tagged')+'</span>'+
				'	</a>'+
				'</li>');
			},
			
			
			configureAlbum: function (albumId) {
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
								
								if(widget.find("ul").attr("album") == albumId)
									widget.find(".title").text(name);
									
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
				dialog = $('<div id="dialog-confirm" title="'+$._('Album Configuration')+'">'+
						'<br /><div align="center"><img class="ui-state-default ui-corner-all" src="images/progress.gif" /></div>'+
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


			},removeAlbum: function (element) {
				var row = $(element).parent();
				jConfirm($._("are you sure you want to remove the album \"%\"?",new Array(row.find("span").text())),$._("Confirmation"),function(e){
					if(e)
						$.getJSON("/core/album/remove/id/"+row.attr("album"),function(data){
							if(data.error)
								jAlert(data.message,"Error");
							else
								row.fadeOut();
						});
				});
			},loadAlbum: function (albumId,page) {
				var widget = this.widget;
				
				$.getJSON("/core/album/photos/id/"+albumId+"/page/"+page,function(data){
					if(data.error)
						location.href="#album";
					else{
						$.widget.photoList.widget.find(".paginator").text(data.photos.pagecount);
						var photoList = $('<ul class="thumbs" album="'+albumId+'">');
						$.each(data.photos.photos,function(i,photo){
							photoList.append('<li class="ui-corner-all ui-state-default" photo="'+photo.photo_id+'">'+
							'<a href="#photo/loadPhoto/id/'+photo.photo_id+'"><img style="height: 115px;"src="/core.php/photo/thumbnail/id/'+photo.photo_id+'/type/list"/></a>'+
							'<div class="move">'+photo.title+'<span style="float:right; vertical-align:top" class="ui-icon ui-icon-arrow-4" /></div>'+
						'</li>');
						});

						try{
							$.widget.photoList.widget.find(".photos").html(photoList).append('<input type="hidden" id="txt-albumName" value="'+data.album.name+'"')
							.find("img")
							.addClass("ui-state-default ui-corner-all")
							.lazyload({
							    placeholder : "images/progress.gif",
							    effect : "fadeIn"
							});
						
						}catch(err){
							jAlert($._("Dependency missing")+": "+err.message);
						}
						$.widget.photoList.preparePhotoList();
					}
				});

			}
			
		
	}
	
})(jQuery);