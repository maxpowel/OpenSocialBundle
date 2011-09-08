(function($){
//TODO deprecated, mirar a ver si se usa y quitarlo
	
	$.fn.combo = function(options) {
		var settings = $.extend({}, $.fn.combo.defaults, options);
		
		$(this).hide();
		var selectBox = $(this);
		var menu = $("<div>").css("display","inline");
		var boton = $("<button>");
		
		boton.button({
            icons: {
            primary: 'alt',
            secondary: 'ui-icon-triangle-1-s'
        	},
        	label:selectBox.find(":selected").text()
		});
		boton.find(".alt").remove();
		
		var lista =$('<ul class="ui-autocomplete ui-menu ui-widget ui-widget-content ui-corner-all" role="menu" aria-activedescendant="ui-active-menuitem" style="z-index:3005; margin-left:'+settings.margenIzquierdo+'px">');
		     
		$.each($(this).find("option"),function(i,elemento){
			 var nuevoElemento = $('<li class="ui-menu-item ui-corner-all" role="menuitem" val="'+$(elemento).val()+'"><a id="ui-active-menuitem" class="ui-corner-all" tabindex="-1">'+$(elemento).text()+'</a></li>');
			 nuevoElemento.hover(
					 function()
					 {
						 $(this).addClass("ui-state-hover");
					 },
					 function(){
						 $(this).removeClass("ui-state-hover");
					 }).click(function(){
						 selectBox.find(":selected").val($(this).attr("val"));
						 boton.find(".ui-button-text").text($(this).text());
						 if(settings.callback != null)
							 settings.callback(this);

						 $(document).unbind("click");
						 lista.slideUp();
					 })
			lista.append(nuevoElemento);
		});

		
		
		lista.hide();
		var positioned = false;
		boton.click(function(){
			if(!positioned){
				positioned = true;
				var helper = $("<div class='combohelper'>");
				menu.append(helper);
				lista.position({
					of: menu,
					my: "left top",
					at: "left bottom",
				});
			}
			$(this).focus();
			 if(lista.is(":visible"))
			 {
				 $(document).unbind("click");
				 lista.slideUp();
			 }
			 else
			 {
				 lista.slideDown(function(){
					 $(document).click(function(){
						 lista.slideUp(function(){
							 $(document).unbind("click");
						 });
					 });
				 });
			 }
		 });

		//Para que cuando se pinche fuera se quite la lista. En fx y chrome va diferente
		//boton.blur(function(){lista.hide()})

		menu.append(boton,lista);
		//$(this).after(menu);
		$(this).after(menu);
		/*lista.position({
			of: boton,
			my: "left top",
			at: "left bottom",
		});
		*/
		
	};
    
	$.fn.combo.defaults  = {
			insertar: null,
			modificar: null,
			elminar: null,
			margenIzquierdo: 0
			
	};
	
	
	
	
})(jQuery);

