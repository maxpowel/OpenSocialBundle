function newFormFile()
{
        var uploadPhotos = $("<div>");
                uploadPhotos.attr("style","padding:5px"); 
        var div = $("<div>");
                div.addClass("fileinputs");
                        
        var fileInfo = $("<input>");
                fileInfo.attr("type","text");
                fileInfo.addClass("fileInfo text ui-widget-content ui-corner-all ac_input");
                
        
        var input = $("<input>");
                input.attr("type","file");
                input.attr("name","file");
                input.addClass("file");
                input.change(function(){
                        $(this).parent().parent().parent().find(".fileInfo").val($(this).val());
                        if($(this).val().length > 0)
                                $("#listUploadPhotos").append(newFormFile());
                });
                
        var inputId = $("<input>");
                inputId.attr("type","hidden");
                inputId.attr("name","APC_UPLOAD_PROGRESS");
                inputId.attr("id","progress_key");

                
        var fakeButton = $("<div>");
                fakeButton.addClass("fakefile");
        var     prettyButton = $('<a href="javascript:void(0)" class="dialog_link ui-state-default ui-corner-all"><span class="ui-icon ui-icon-folder-open"></span>Seleccionar foto</a>');
                fakeButton.html(prettyButton);
                //COloreamos el boton cuando se pasa por encima del input, pasandolo por encima del boton queda peor    
                input.hover(
                                        function() { $(this).parent().find("div").find("a").addClass('ui-state-hover'); }, 
                                        function() { $(this).parent().find("div").find("a").removeClass('ui-state-hover'); }
                                );
                                        
                
                
        var form = $("<form>");
                form.addClass("uploadForm");
                div.append(inputId);
                div.append(input);
                div.append(fakeButton);
                
        var table = $("<table>");
        var row  = $("<tr>");
        var row2  = $("<tr>");
                table.append(row);
                table.append(row2);
        var col  = $("<td>");
        var col2  = $("<td>");
        var col2_1  = $("<td>");
                row.append(col);
                row.append(col2);
                row2.append(col2_1);
                col.append(fileInfo);
                col2.append(div);
                col2_1.attr("colspan",2);
                
                form.append(table);
                form.attr("enctype","multipart/form-data");
                form.attr("action","/core.php/photo/upload");
                form.attr("method","post");
                
        var bar = $("<span>");
                bar.addClass("progressBar");
                col2_1.append(bar);
                


                uploadPhotos.append(form);
                
                                //Getting new ID
        $.getJSON("/core.php/photo/upload/get_key",
        function(data){
                inputId.attr("value",data.uuid);
                bar.attr("id","pb1-"+data.uuid);
        });
                
        return uploadPhotos;
}

function updateUploadProgress()
{
        var finished = true;
        //Solo acaba valiendo true cuando han finished todas las subidas
        var bars = $(".progressBar");
                $.each(bars, function(i,bar){
                        if($(bar).attr("done") != 1)
                        {
                                finished = false;
                                var id = bar.id.split("-");
                                $.getJSON("core.php/photo/upload/progress_key/"+id[1],
                                function(data){
                                        var progress = data.current*100/data.total;
                                        $(bar).progressBar(progress);
                                        if(data.done == 1)
                                                $(bar).attr("done",1);
                                });
                        }
                });
                
                if(!finished)
                {
                        setTimeout('updateUploadProgress()', 500)
                }
                else
                {
                        $("#uploadPhotosFooter").text("Terminado");
                        $("#uploadState").val(0);
                        //mensajeSistema("Se han finished de subir todas las fotos");
                        $(".progressBar").progressBar(100);
                }
}

function uploadPhotoDialog()
{
        //Hacer que solo se abra si no existe
		var uploadPhotoWindow
		if(uploadPhotoWindow == $.window.getWindow("uploadPhotos"))
		{
			try{
				uploadPhotoWindow.restore();
			}catch(e)
			{
				uploadPhotoWindow.select();
			}
		}else{
	        var dialog = $("<div>");
	        var list = $("<div>");
	                list.attr("id","listUploadPhotos");             
	        dialog.append(list);
	                var uploadButton = $('<a href="javascript:void(0)" class="dialog_link ui-state-default ui-corner-all"><span class="ui-icon ui-icon-circle-arrow-n"></span>Subir Fotos</a>');
	                
	                dialog.append(uploadButton);
	                uploadButton.click(function(){
	                        //La leyenda
	                        $("#uploadPhotosFooter").text("Subiendo fotos, por favor no cierres esta ventana");
	                        $("#uploadState").val(1);
	                        //quitamos el boton
	                        $(this).remove();
	                        //Comprobamos que todos los campos tienen algo
	                        $.each($("form"), function(i,form){
	                                if($(form).find(".fileInfo").val().length == 0)
	                                {
	                                        $(form).remove();
	                                }
	                        });
	                        var forms = $(".uploadForm");
	                        
	                                forms.ajaxForm({
	                                beforeSubmit: function(a,f,o) {
	                                        $(".progressBar").progressBar();
	                                //o.dataType = $('#uploadResponseType')[0].value;
	                                //$('#uploadOutput').html('Submitting...');
	                                
	                        },success:    function(data) {
	                                var response = eval('('+data+')');
	                                //Creamos enlace
	                                var message = $('<span style="padding: 0.2em 0.7em;">');
	                                var stateImage = $('<span style="float: left; margin-right: 0.3em;"/>');
	                                if(response.error == 0)
	                                {
	                                        userNotice("Foto "+response.filename+" subida");
	                                        link = $('<a class="ui-helper-reset ui-corner-all" href="#photo/loadPhoto/id/'+response.id+'"><img class="ui-state-default ui-corner-all" src="/core.php/photo/thumbnail/id/'+response.id+'/type/mini"> Ver foto</a>');
	                                        link.prepend(stateImage);
	                                        
	                                        message.addClass("ui-state-highlight ui-corner-all");
	                                        message.prepend(link);
	                                        stateImage.addClass("ui-icon ui-icon-check");
	                                }else{
	                                        userNotice("No se puedo subir la foto "+response.filename);
	                                        message.text(response.message);
	                                        message.prepend(stateImage);
	                                        message.addClass("ui-state-error ui-corner-all");
	                                        
	                                        stateImage.addClass("ui-icon ui-icon-closethick");
	                                }
	                                
	                                $('#pb1-'+response.uploadId).parent().parent().parent().parent().parent().append(message);
	                                
	                                $('#pb1-'+response.uploadId).parent().parent().parent().parent().remove();
	                                
	                                
	                        }
	
	                                });
	                                forms.submit();
	                                updateUploadProgress();
	                });
	                
	                uploadPhotoWindow = $.window({
	                   id: "uploadPhotos", 
	                   title: "Subir fotos",
	                   content: dialog, // load window_block8 html content
	                   footerContent: '<input type="hidden" id="uploadState" value="0"><div id="uploadPhotosFooter">Selecciona las fotos que quieres subir</div>',
	                   containerClass: "portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all",
	                   headerClass: "portlet-header-centro ui-widget-header ui-corner-all",
	                   frameClass: "portlet-content",
	                   footerClass: "portlet-content",
	                   onClose: function() { // a callback function while user click close button
	                        if($("#uploadState").val() == 1)
	                        {
	                                jConfirm("Si cierras la ventana se cancelaran todas las subidas que no hayan finished","Confirmar cierre", 
	                                function (r)
	                                {
	                                        if(r)
	                                                ventanaFotos.close(true);
	                                });
	                        }else return true;
	                        }
	                });
	                
	                
	                //Se pone aqui debajo porque sino no asigna el id en el json de nuevoArchivoSubir()
	                //Habra algun conflico entre window y esto, pero así funciona bien
	                $("#listUploadPhotos").append(newFormFile());
		}

}


