(function($) {
	
	$.widget.forumList = {
			widget: null,
			init: function(widget) {
				thisWidget = this;
				this.widget=$(widget);
				widget = this.widget;
				this.widget.find(".but-newSection").button().click(function(){
					var name = $.trim($(this).parent().find("input").val());
					if(name.length > 0){
						var row = $(this).parent();
						$.getJSON("/core/forum/createBoard",{name:name,id:$(this).parent().find("input").attr("forumId")},function(data){
							if(data.error)
								jAlert(data.message,"Error");
							else{
								row.before('<li boardid="'+data.id+'" style="text-indent: 2.5em;"><span style="position:absolute" class="board cursor icon ui-icon ui-icon-close"></span><a href="#tabs-photos">'+name+'</a></li>');
								widget.find("button").unbind("click");
								widget.find(".forum").unbind("click");
								widget.find(".board").unbind("click");
								thisWidget.init(widget);
							}
						});
						$(this).val("");
					}else jAlert("Por favor escribe uno nombre para la nueva seccion");
					$(this).blur();
				});
				
				this.widget.find("#but-newForum").button().click(function(){
					var name = $.trim($(widget).find("#new-forum").val());
					if(name.length > 0){
						$.getJSON("/core/forum/create",{name:name},function(data){
							if(data.error)
								jAlert(data.message,"Error");
							else{
								widget.find("#forum-list").append('<li><h3 forumid="'+data.id+'"><a href="#tabs-friends">'+name+'</a><span class="forum cursor icon ui-icon ui-icon-closethick"></span></h3></li>'+
																   '<li style="text-indent: 2.5em;"><input class="new-section" forumid="'+data.id+'" class="ui-widget-content ui-corner-all" size="20" type="text"> <button class="but-newSection">+</button></li>');
								widget.find("button").unbind("click");
								widget.find(".forum").unbind("click");
								widget.find(".board").unbind("click");
								thisWidget.init(widget);
							}
						});
						$(this).val("");
					}else jAlert("Por favor escribe uno nombre para el nuevo foro");
					
					$(this).blur();
				});
				
				this.widget.find(".forum").click(function(){
					var row = $(this).parent().parent();//<li>
					var forumid = $(this).parent().attr("forumid");
					jConfirm('¿Realmente quieres borrar el foro"'+$(this).parent().find("a").text()+'"? También se borrarán las secciones del foro',"Confirmar",function(yes){
						if(yes){
							$.getJSON("/core/forum/remove",{id:forumid},function(data){
								if(data.error)
									jAlert(data.message,"Error");
								else{
									remove = row;
									row = row.next();
									while(row.find("h3").length == 0 && row.length){
										remove.remove();
										remove = row;
										row = row.next();
									}
									remove.remove();
								}
							});
						}
					});
				});
				this.widget.find(".board").click(function(){
					var row = $(this).parent();//<li>
					var boardid = $(this).parent().attr("boardid");
					jConfirm('¿Realmente quieres borrar la seccion "'+$(this).parent().find("a").text()+'"?',"Confirmar",function(yes){
						if(yes){
							$.getJSON("/core/forum/removeBoard",{id:boardid},function(data){
								if(data.error)
									jAlert(data.message,"Error");
								else{
									row.remove();
								}
							});
						}
					});
					
					
				});
			}
	}
	
})(jQuery);