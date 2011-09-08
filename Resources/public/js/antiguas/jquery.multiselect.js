(function($){
	
$.expr[':'].icontains = function(obj, index, meta, stack){
return (obj.textContent || obj.innerText || jQuery(obj).text() || '').toLowerCase().indexOf(meta[3].toLowerCase()) >= 0;
};

	$.fn.multiselect = function(options) {
		var selectedList;
		var availableList;
		var counter;
		var selectBox = $(this);
		function availableToSelected(element)
		{
			var movedElement = element.clone();
			element.find("span").unbind("click");
			selectBox.find("[value="+element.attr("val")+"]").attr("selected","1");
			counter.text(parseInt(counter.text())+1);
			
			element.slideUp(function(){
				element.remove();
			});
			
			movedElement.find("span").removeClass("ui-icon-plus");
			movedElement.find("span").addClass("ui-icon-minus");
			selectedList.append(movedElement);
			movedElement.hide();
			movedElement.slideDown();
			movedElement.find("span").click(function(){
				selectedToAvailable(movedElement);
			})
		}
	
		function selectedToAvailable(element)
		{
			var movedElement = element.clone();
			element.find("span").unbind("click");
			selectBox.find("[value="+element.attr("val")+"]").attr("selected",null);
			counter.text(parseInt(counter.text())-1);
			
			element.slideUp(function(){
				element.remove();
			});
			
			movedElement.find("span").removeClass("ui-icon-minus");
			movedElement.find("span").addClass("ui-icon-plus");
			availableList.append(movedElement);
			movedElement.hide();
			movedElement.slideDown();
			movedElement.find("span").click(function(){
				availableToSelected(movedElement);
			})
		}
		var settings = $.extend({}, $.fn.multiselect.defaults, options);
		$(this).hide();
		
		var container = $('<div class="ui-multiselect ui-helper-clearfix ui-widget" style="width: 457px;">');
		var containerSelected = $('<div class="selected" style="width: 273px;">');
		
			containerSelected.append('<div class="actions ui-widget-header ui-helper-clearfix">'+
									 '	<span class="count"><span>0</span> seleccionados</span>'+
									 '		<a class="remove-all" href="javascript:void(0)">Quitar todos</a>'+
									 '</div>');
			counter = containerSelected.find("div").find("span").find("span");
			
			containerSelected.find("div").find("a").click(function(){
				$.each(selectedList.find("li"),function(i,element){
					selectedToAvailable($(element));
				});
			});
									 
			
		var containerAvailable = $('<div class="available" style="width: 182px;">');
			containerAvailable.append('<div class="actions ui-widget-header ui-helper-clearfix">'+
									  '	<input type="text" class="search empty ui-widget-content ui-corner-all"/>'+
									  '	<a class="add-all" href="javascript:void(0)">Sel. todos</a>'+
									  '</div>');
			
			containerAvailable.find("input").keyup(function(){
				
				if($(this).val().length > 0)
				{
					containerAvailable.find("li:not(:icontains("+$(this).val()+"))").hide();
					containerAvailable.find("li:icontains("+$(this).val()+")").show();
				}else{
					containerAvailable.find("li").show();
				}
			});
				
			containerAvailable.find("a").click(function(){
				$.each(availableList.find("li"),function(i,element){
					availableToSelected($(element));
				});
			});
			
		selectedList = $('<ul class="selected connected-list ui-sortable" style="height: 167px;"></ul>');
		availableList = $('<ul class="available connected-list" style="height: 167px;"></ul>');
		
				$.each($(this).find(":selected"),function(i,element){
					var text = $(element).text();
					var val = $(element).val();
					var newElement = $('<li title="'+text+'" class="ui-state-default ui-element" style="display: list-item;" val="'+val+'">'+text+'<a class="action" href="javascript:void(0)"><span class="ui-corner-all ui-icon ui-icon-minus"/></a></li>');
					newElement.find("span").click(function(){
							selectedToAvailable(newElement);
						});
					selectedList.append(newElement);

				});
				counter.text($(this).find(":selected").length);
				
				$.each($(this).find(":not(:selected)"),function(i,element){
					var text = $(element).text();
					var val = $(element).val();
					var newElement = $('<li title="'+text+'" class="ui-state-default ui-element" style="display: list-item;" val="'+val+'">'+text+'<a class="action" href="javascript:void(0)"><span class="ui-corner-all ui-icon ui-icon-plus"/></a></li>');
					newElement.find("span").click(function(){
							availableToSelected(newElement);
						});
					availableList.append(newElement);

				});
		
		
		containerSelected.append(selectedList);
		containerAvailable.append(availableList);
		container.append(containerSelected,containerAvailable);
		$(this).after(container);
	}
})(jQuery);

