(function($) {
	
	$.widget.accountActions = {
			widget: null,
			init: function(widget) {
				this.widget = $(widget);
				this.widget.find("a").button();
			},
			
			
	}
	
})(jQuery);