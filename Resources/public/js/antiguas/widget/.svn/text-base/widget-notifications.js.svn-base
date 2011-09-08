(function($) {
	
	$.widget.notifications = {
			widget: null,
			init: function(widget) {
				this.widget = $(widget);
				this.widget.find(".accept").button({
					icons: {
	                	primary: 'ui-icon-circle-check'
	            	}
				}).click(function(){
					var row = $(this).parent().parent();
					var id = $(this).attr("requestid");
					$.getJSON("core/user/acceptFriendRequest/id/"+id,function(data){
						if(data.error)
							jAlert(data.message,"Error");
						else{
							row.find(".message").text("");
							row.find("a").attr("href","#profile/load/id/"+id);
							row.prepend($._("New friend")+" ");
							row.find("button").remove();
							$.wixet.userNotice($._("You have a new friend")+": "+row.find("a").text());
						}
					});
				});
				
				this.widget.find(".ignore").button({
					icons: {
	                	primary: 'ui-icon-circle-close'
	            	}
				}).click(function(){
					var button = this;
					$.getJSON("core/user/ignoreFriendRequest/id/"+$(this).attr("requestid"),function(data){
						if(data.error)
							jAlert(data.error,"Error");
						else
							$(button).parent().remove();
						
							
					});
				});
			}
	}
	
})(jQuery);

