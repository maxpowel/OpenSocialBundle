(function($) {
	
	$.widget.searchBody = {
			widget: null,
			init: function(widget) {
				this.widget = $(widget);
				this.widget.find("button").button();
				//this.widget.find(".paginator").pager({ pagenumber: 1, pagecount: 0, buttonClickCallback: $.widget.searchBody.paginate });
			},
			
			load: function(){
				//do nothing
			},
			
			paginate: function(page){
				$.widget.searchOptions.page = page;
				$.widget.searchOptions.widget.find(".but-people").click();

			}
		
	}
	
})(jQuery);
