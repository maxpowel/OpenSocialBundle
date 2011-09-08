		$(document).ready(function(){
		$("button").button().click(function(){
			//console.log("hola");
			var gadgetInfo = $(this).parent().parent().parent().find("#gadgetName");
			var dialog = $("<div title='Instalar gadget'>Est&aacute;s a punto de instalar \"" + gadgetInfo.text() + "\"<h3>¿Donde quieres instalar el gadget?</h3><br><div align='center'><button id='profile'>En mi perfil</button><button id='start'>En mi página principal</button></div></div>");
			var button =  $(this).find(".ui-button-text");
			button.text("Instalando");
			
			//TODO sacar la funcion fuera
			function installCallback(data){
				button.button('disable');
				button.text("Instalado");
				dialog.dialog('close');
			}		
			//
			dialog.dialog({modal:true,
						   open:function(){
							   dialog.find("#profile").button().click(function(){
									$.getJSON("/installGadget",{section:"profile",url:gadgetInfo.attr("url")},installCallback);   
							   });
							   
							   dialog.find("#start").button().click(function(){
								   $.getJSON("/installGadget",{section:"start",url:gadgetInfo.attr("url")},installCallback);   
							   });
							   }
						  });
			
			
		});
	
	});


function installCallback(data){
        userNotice(data.message);
}