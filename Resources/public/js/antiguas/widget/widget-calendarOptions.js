(function($) {
	
	$.widget.calendarOptions = {
			widget: null,
			init: function(widget) {
				this.widget=$(widget);
				
				var input = this.widget.find("input"); 
					input.hint();
				this.widget.find("button").button().click(function(){
					jAlert("Buscando "+input.val());
				});
			}
	}
	
})(jQuery);