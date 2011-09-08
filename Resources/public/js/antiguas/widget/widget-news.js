(function($) {
	
	$.widget.news = {
			widget: null,
			init: function(widget) {
				this.widget = $(widget);
				this.widget.find(".title").parent().remove();
				this.widget.find(".portlet-content").css("padding","0em");
				$("#news").tabs({
					select: function(event, ui) {
						var panel = $(ui.panel);
						var type = ui.panel.id.split("-")[1];
							panel.html('<div align="center"><img src="images/progress.gif" /></div>');
							$.getJSON("core/user/news/type/"+type,function(data){
								panel.html('<ul class="normal-list">');
								var list = panel.find("ul");
								if(data.length > 0){
									$.each(data,function(i,activity){
										///Calculate the time
										var timeString ="";
										//$._("% minutes ago",new Array(""+activity.time))+
										if(activity.time < 86400){
											var number = activity.time;
											var index = 0;
											while(number>60){
												index++;
												number=Math.floor(number/60);
											}
											var timeType;
											if(index == 0){
												//Seconds
												timeType = number==1?$._("second"):$._("seconds");
											}else if(index == 1){
												//Minutes
												timeType = number==1?$._("minute"):$._("minutes");
											}else
												timeType = number==1?$._("hour"):$._("hours");
											timeString = $._("% % ago",[number,timeType])
										}else{
											var number=Math.floor(number/86400);
											var timeType = number==1?__("day"):__("days");
											timeString = $._("More than % % ago",[number,timeType])

										}
										/////////////////////
										newActivity = $('<li style="clear:left;"><hr class="ui-state-default"></hr>'+
												'<img class="ui-state-default ui-corner-all" style="float:left;" src="core.php/photo/thumbnail/id/'+activity.photo_id+'/type/mini" />'+
												'<ul class="normal-list" style="float:left;">'+
	
												'</ul>'+
												'<div style="float:right">'+timeString+'</div>'+
												"</li>");
										var events = newActivity.find("ul");
										events.append('<li style="margin-top:0";><a class="ui-state-default ui-corner-all" href="#'+activity.url+'/load/id/'+activity.id+'" style="text-decoration:none;">'+activity.title+'</a></li>');
										$.each(activity.events,function(i,event){
											if(event.extra != null)
												extra = event.extra;
											else
												extra = "";
											events.append('<li style="margin-top:0; width:500px;"><span class="icon ui-icon ui-icon-'+event.icon+'"></span><a href="#'+event.url+'/load/id/'+event.id+'" style="text-decoration:none;">'+event.content+'</a>'+extra+'</li>');
										});
										list.append(newActivity);
									});
									list.find("hr").eq(0).remove();
								}else{
									list.append("<li>"+$._("You does not have any recent activity")+"</li>");
									
								}
								
							});
					}
				});
				this.widget.find("#news").removeClass("ui-widget-content");
				
			}
			
	}
	
})(jQuery);