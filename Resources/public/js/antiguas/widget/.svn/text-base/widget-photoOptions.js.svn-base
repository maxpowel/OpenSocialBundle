(function($) {
	
	$.widget.photoOptions = {
			widget: null,
			init: function(widget) {
				this.widget = $(widget);
				this.widget.find(".doMain").button().click(function(){
					$.getJSON("core/user/setMainPhoto/id/"+$.url.getParam("id"),function(data){
						if(data.error)
							jAlert(data.message,"Error");
						else
							$.wixet.userNotice($._("Main photo changed"))
					});
				});
				this.widget.find(".download").button().click(function(){
					location.href = "core/photo/image/id/"+$.url.getParam("id");
				});
				this.widget.find(".report").button().click(function(){
					jPrompt($._("Please write the reason of your report"),"",$._("Photo report"),function(reason){
						if(reason)
							$.post("core/photo/report/id/"+$.url.getParam("id"),{reason:reason},function(data){
								data = eval("("+data+")");
								if(data.error)
									jAlert(data.message,"Error");
								else{
									$.wixet.userNotice($._("Photo reported"));
								}
																	
							});
					});
				});
				this.widget.find(".remove").button().hide();
				this.widget.find(".permission").button().hide();
				this.widget.find("button").width(110);
			},
			
			load: function(actionVars){
				if($.wixet.user.id == $.controller.photo.owner.id){
					this.widget.find(".remove").button().show().click(function(){
						jConfirm("Are you sure to remove this photo? Also photo comments and everything related with this photo will be removed",$._("Please confirm"),function(yes){
							if(yes){
								$.getJSON("core/photo/remove/id/"+$.url.getParam("id"),function(data){
									if(data.error)
										jAlert(data.message,"Error");
									else{
										$.wixet.userNotice($._("Photo removed"));
										location.href="#start";
									}
																		
								});
							}
								
						});
					});
					this.widget.find(".permission").button().show().click(function(){
						$.widget.photo.photoPermissionsDialog($.controller.photo.id);
					});
				}
			}
	}
	
})(jQuery);