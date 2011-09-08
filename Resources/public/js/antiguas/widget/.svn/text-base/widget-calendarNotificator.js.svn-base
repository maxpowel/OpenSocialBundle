(function($) {
	
	$.widget.calendarNotificator = {
			widget: null,
			init: function(widget) {
				this.widget=$(widget);
				var fullTime = new Date();
				var today = new Date(fullTime.getFullYear(),fullTime.getMonth(),fullTime.getDate());
				$.each(this.widget.find(".date"),function(i,element){
					actionDate = new Date($(element).text());
					actionDate = new Date(actionDate.getFullYear(),actionDate.getMonth(),actionDate.getDate());
					if(actionDate - today == 0){
						$(element).next().html("<b>"+$._("Today")+"</b>");
					}
				});
				this.widget.find("#calendarNotificator").tablesorter({sortList: [[1,0]]});

			},
			load: function(actionVars){
			}
	
	}
	
})(jQuery);