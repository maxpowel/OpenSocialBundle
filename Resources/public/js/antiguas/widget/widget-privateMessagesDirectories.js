(function($) {
	
	$.widget.privateMessagesDirectories = {
			widget: null,
			init: function(widget) {
				this.widget=$(widget);
				widget = this.widget;
				
				var directoriesList = this;
				
				widget.find(".ui-icon-trash").click(function(){
					directoriesList.removeDirectory(this);
					
				});
				
				widget.find(".ui-icon-gear").click(function(){
					directoriesList.configureDirectory($(this).parent().attr("directory"));
				});
				
				widget.find("span").parent().click(function(){
					$(this).blur();
					location.href="#privateMessage/loadDirectory/id/"+$(this).parent().attr("directory");
				});
				
				widget.find("#but-newDirectory").button().click(function(){
					jPrompt($._("Please write the name for your new message directory"),$._("Directory name"),$._("New message directory"),function(name){
						if(name)
						{
							$.post("/core/privateMessage/newDirectory",{name:name},function(data){
								data = eval('('+data+')');
								if(data.error)
									jAlert(data.message,"Error");
								else {
									element=$('<li class="ui-state-default ui-corner-all" directory="'+data.id+'">'+
								      '<a href="javascript:void(0)">'+
								      '<span>'+name+'</span></a>'+
								  	  '<a href="javascript:void(0)" style="float:right;" class="ui-icon ui-icon-trash" title="'+$._("Remove")+'"></a>'+
									  '<a href="javascript:void(0)" style="float:right;" class="ui-icon ui-icon-gear" title="'+$._("Edit")+'"></a>'+
								      '</li>');
									element.find("span").click(function(){
								    	  $(this).blur();
								    	  location.href="#privateMessage/loadDirectory/id/"+data.id;
									});
									
									
									widget.find("#cont-directoryList").append(element);
									element.fadeIn().find(".ui-icon-trash").click(function(){
										directoriesList.removeDirectory(this);
									});
									
									widget.find(".ui-icon-gear").click(function(){
										directoriesList.configureDirectory($(this).parent().attr("directory"));
									});
									
									$.widget.privateMessages.prepareMessageList();
							
								}
							});
						}
					});
				});
				
			},
			
			configureDirectory: function (albumId) {
				var widget = this.widget;
				jPrompt($._("Please write the new name for the directory"),$._("New name"),$._("New message directory"),function(name){
					if(name){
						
					}
				});


			},removeDirectory: function (element) {
				var row = $(element).parent();
				jConfirm($._("are you sure you want to remove the directory \"%\"?",new Array(row.find("span").text())),$._("Confirmation"),function(e){
					if(e)
						$.getJSON("/core/privateMessage/removeDirectory/id/"+row.attr("directory"),function(data){
							if(data.error)
								jAlert(data.message,"Error");
							else
								row.fadeOut();
						});
				});
			},loadDirectory: function (directoryId) {
				$.widget.privateMessages.paginate(1);
					$.widget.privateMessages.prepareMessageList();
			},
			checkNewMessages: function(){
				var list = this.widget.find("ul");
				$.getJSON("core/privateMessage/directoriesState",function(data){
					$.each(data,function(i,element){
						var directory = list.find("[directory="+element.id+"]");
						if(element.newMessages > 0){
							directory.addClass("ui-state-highlight");
						}else{
							directory.removeClass("ui-state-highlight");
						}
					});
				});
			}
			
		
	}
	
})(jQuery);