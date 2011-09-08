var oTable; //Data table

function permissionsDialog(mediaItemId)
{
    var buttonsOpts = {};
    var dialog = null;
    buttonsOpts['Añadir usuario'] = function (){
            var dialog = $('<div id="dialog-confirm" title="Añadir usuario">');
            dialog.dialog();
    };
    
    buttonsOpts['Añadir grupo'] = function (){
            var dialog = $('<div id="dialog-confirm" title="Añadir grupo">');
            dialog.dialog({modal: true});
    };
    
    buttonsOpts['Cancelar'] = function (){
            $(this).dialog('close');
    };
    buttonsOpts['Guardar cambios'] = function() {
            var allowed = new Array();
            var denied = new Array();
            var ok = true;

                    $.each(dialog.find(".allowed option:selected"),function(i,group){
                            allowed.push({id:$(group).val()});
                    });

                    $.each(dialog.find(".denied option:selected"),function(i,group){
                            denied.push({id:$(group).val()});
                    });


                    /*$.post("/core/photo/newPermissions/id/"+photoId,{permissions:$.toJSON({allowed:allowed,denied:denied})},function(data){
                            data = eval("("+data+")");
                            if(data.error)
                            {
                                    ok = false;
                                    jAlert(data.message,"Error");
                            }else
                                    userNotice($._("The photo permissions have been successfully changed"));
                    });*/

                    if(ok)
                    {
                            $(this).dialog('close');
                    }

    };

    dialog = $('<div id="dialog-confirm" title="'+"Permisos"+'">'+
                    '<br /><div align="center">'+
                    //The datatable
                    '<table cellpadding="0" cellspacing="0" border="0" class="display" id="permissions">'+
                                        '<thead>'+

                                        '       <tr>'+
                                        '               <th width="40%">Nombre</th>'+
                                        '               <th width="1%">Tipo</th>'+
                                        '               <th width="1%">Lectura permitida</th>'+
                                        '               <th width="1%">Escritura permitida</th>'+
                                        '               <th width="1%">Lectura denegada</th>'+
                                        '               <th width="1%">Escritura denegada</th>'+
                                        '               <th width="1%">Eliminar</th>'+
                                        '       </tr>'+
                                        '</thead>'+
                                        '<tbody>'+
                                        '       <tr>'+
                                        '               <td colspan="5" class="dataTables_empty">Cargando</td>'+
                                        '       </tr>'+
                                        '</tbody>'+
                                        '<tfoot>'+

                                                '<tr>'+
                                                        '<th width="40%">Nombre</th>'+
                                        '               <th width="1%">Tipo</th>'+
                                        '               <th width="1%">Lectura permitida</th>'+
                                        '               <th width="1%">Escritura permitida</th>'+
                                        '               <th width="1%">Lectura denegada</th>'+
                                        '               <th width="1%">Escritura denegada</th>'+
                                        '               <th width="1%">Eliminar</th>'+

                                '               </tr>'+
                                '       </tfoot>'+

                                '</table>'+
                            
                    '</div>').dialog({
                            resizable: true,
                            height:500,
                            width: 800,
                            modal: true,
                            close: function(){
                                oTable.fnDestroy();
                                $(this).remove();
                            },
                            open: function(){
                                 var dataTable = $('#permissions');
                                      oTable = dataTable.dataTable( {
                                          "bSort": false,
                                          
                                          "fnServerData": function ( sSource, aoData, fnCallback ) {
                                              var params = {};
                                              params['sEcho'] = aoData[0].value;
                                              params['FIRST'] = aoData[3].value;
                                              params['MAX'] = aoData[4].value;
                                              params['type'] = "Wixet\\WixetBundle\\Entity\\MediaItem";
                                              params['id'] = mediaItemId;
                                              $.jsonRPC.request(sSource, params, {
                                              success: function(result) {
                                                  var data = result.result;
                                                  var ids = new Array();
                                                  var list = new Array();
                                                  $.each(data.entry, function(i,permission){
                                                      list.push([permission.identity.name,
                                                                "<img src='/bundles/wixet/images/dataTable/" + permission.identity.type + "' border='0' title='" + permission.identity.type + "' alt='" + permission.identity.type + "'>",
                                                                "<input type='checkbox'"+(permission.read_granted?"checked":"")+">",
                                                                "<input type='checkbox'"+(permission.write_granted?"checked":"")+">",
                                                                "<input type='checkbox'"+(permission.read_denied?"checked":"")+">",
                                                                "<input type='checkbox'"+(permission.write_denied?"checked":"")+">",
                                                                "<a href='javascript:removePermission(\""+permission.identity.type+"\","+permission.id+",this)'><img src='/bundles/wixet/images/dataTable/details_close.png' border='0' title='Eliminar' alt='Eliminar'></a>"
                                                            ]);
                                                  });
                                                 var json = {
                                                        sEcho: data.sEcho,
                                                        iTotalRecords: data.totalResults,
                                                        iTotalDisplayRecords: data.itemsPerPage,
                                                        aaData: list
                                                        };
                                                fnCallback(json);
                                              },
                                              error: function(result) {
                                                $.wixet.userNotice("Error al cargar lista de permisos");
                                              }
                                          });
                                          },
                                        "bProcessing": true,
                                        "bServerSide": true,
                                        //"sAjaxSource": "/core/forum/getTopics",
                                        "sAjaxSource": "permissions.get",
                                        "bJQueryUI": true,
                                        "sPaginationType": "full_numbers"
                                        
                                        
                                        /*"oLanguage": {
                                                "sUrl": "/js/locals/dataTable-"+$._.getLocale()+".js"}*/
                                      } );
                                      	
                                
                            },
                            buttons: buttonsOpts
                    });
}
                        
                        

$(document).ready(function(){
    $("button").button().css("width","150px");
    /*
     * 
     * .click(function(){
		$(".add-note").click();
		$.wixet.userNotice("Haz click sobre la foto para insertar la etiqueta");
		});
     */
    
    
    $("#doMain").click(function(){
        //Using RPC
        $.jsonRPC.request('people.update', {params:{thumbnail:$("#mediaItemId").val()}}, {
          success: function(result) {
            $.wixet.userNotice(result.result.message);
          },
          error: function(result) {
            $.wixet.userNotice(result.error.message);
          }
        });
        
    });
    
    $("#download").click(function(){
        
    });
    
    $("#denounce").click(function(){
        
    });
    
    //TODO ponerlo en ingles
    $("#Permisos").click(function(){
        permissionsDialog($("#mediaItemId").val());
    });
    
	 $("#tagList").find("li").hover(
		 function()
		 {
			 $(this).addClass("ui-state-hover");
		 },
		 function(){
			 $(this).removeClass("ui-state-hover");
		 });

	
	$("#comments").commentList({type:"mediaItem", id:$("#mediaItemId").val()});


	$("#img-photo").jQueryNotes({operator: '/core/photo/getTags/id/',
									operatorUpdate: '/core/photo/updateTag/id/',
                                    operatorNew: '/core/photo/newTag/id/',
                                    operatorRemove: '/core/photo/removeTag/id/',
                                    allowLink: false,
                                    allowReload: false,
                                    allowHide: false});

});


function removePermission(type,id, vRow){
    //var realRow = ()
    //console.log(oTable.fnGetPosition( row ));
    $.jsonRPC.request("permissions.remove", {type:type, id:id}, {
          success: function(result) {
             $.wixet.userNotice("Permiso eliminado");
             oTable.fnPageChange( 'first' );
          },
          error: function(result) {
            $.wixet.userNotice("Error al eliminar permiso");
          }
      });
    
}