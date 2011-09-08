(function($) {
	
	$.widget.photoList = {
			widget: null,
			init: function(widget) {
				this.widget = $(widget);
				//this.preparePhotoList()
			},
			
			preparePhotoList: function () {
				var widget = this.widget;
				widget.find(".title").text(widget.find("#txt-albumName").val());
				
				widget.find("li").draggable({revert: true, handle: 'div'});

				try{
						$.widget.albumList.widget.find("li").droppable({
							tolerance: 'pointer',
							greedy: true,
							activeClass: 'ui-state-hover',
							hoverClass: 'ui-state-highlight',
							drop: function(event, ui) {
								ui.draggable.fadeOut(function(){ui.draggable.remove();});
								$.getJSON("/core/photo/moveTo/photo/"+ui.draggable.attr("photo")+"/album/"+$(this).attr("album"),function(data){
									if(data.error)
										jAlert(data.message,"Error");
									else{//Check the new album front (if the first photo is moved the front change)
										var albumList = $("#cont-albumList");
										var newAlbum = data.newAlbum;
										var oldAlbum = data.oldAlbum;
										$.getJSON("/core/album/details/id/"+data.oldAlbum,function(data){
											albumList.find("[album="+oldAlbum+"]").find("img").attr("src","/core/photo/thumbnail/id/"+data.front+"/type/mini");
										});
										
										$.getJSON("/core/album/details/id/"+data.newAlbum,function(data){
											albumList.find("[album="+newAlbum+"]").find("img").attr("src","/core/photo/thumbnail/id/"+data.front+"/type/mini");
										});

									}
								});
							}


					});
				}catch(err){
					jAlert("Dependency missing: "+err.message);
				}
				this.widget.find(".paginator").pager({ pagenumber: 1, pagecount: this.widget.find(".paginator").text(), buttonClickCallback: $.controller.album.loadPage });
			}, insertPhoto: function (photo){
				this.widget.find("ul").append('<li class="ui-corner-all ui-state-default" photo="'+photo.photo_id+'">'+
				'<a href="#photo/loadPhoto/id/'+photo.photo_id+'"><img src="/core.php/photo/thumbnail/id/'+photo.photo_id+'/type/list"/></a>'+
				'<div>'+photo.title+'</div>'+
			'</li>');
		}
			
		
	}
	
})(jQuery);
