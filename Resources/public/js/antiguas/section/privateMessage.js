$(document).ready(function(){

    $(".ui-icon-trash").click(function(){
            removeCollection(this);

    });

    $(".ui-icon-gear").click(function(){
            configureCollection($(this).parent().attr("collection"));
    });

    $("#cont-collectionList").find("span").parent().click(function(){
            $(this).blur();
            location.href="#privateMessage/"+$(this).parent().attr("collection");
    });

    $("#but-newCollection").button().click(function(){
            jPrompt("Please write the name for your new message directory","Directory name","New message directory",function(name){
                    if(name)
                    {
                            createCollection(name);
                    }
            });
    });
    paginate(1);
});

function paginate(page){
    	$("#loadingCollection").show();
	$("#loadedCollection").hide();
	var req = opensocial.newDataRequest();
	var params = {};
	params['FIRST'] = (page-1)*10;
	params['MAX'] = 10;
	req.add(req.newFetchMessagesRequest('OWNER',$("#collectionId").val(),params), 'messages');
	req.send(function(data){
		var messages = data.get('messages').getData();
		var list = $("#accordion");
		list.html("");
		messages.each(function(message){
                    var highlight = "";
                   // if(message.new)
                        highlight = "class='ui-state-highlight'";
                        

                    list.append('<h3 message="'+message.getField(opensocial.Message.Field.ID)+'"><a href="#" '+highlight+'>'+message.getField(opensocial.Message.Field.TITLE)+' ['+message.getField(opensocial.Message.Field.TIME_SENT)+']<img src="/bundles/wixet/images/cruzTemporal.png" class="move ui-state-default ui-corner-all" style="float:right;" /></a></h3>'+
                                                                                                                         '<div><div id="'+message.getField(opensocial.Message.Field.ID)+'" align="center"><img src="/bundles/wixet/images/progress.gif"/></div></div>');

			});
		$("#loadingCollection").hide();
		$("#loadedCollection").show();
		$(".paginator").pager({pagenumber: page, pagecount: Math.ceil((messages.getTotalSize()/10)), buttonClickCallback: paginate});
                makeDragNDrop();
                makeAccordion();
		
	});

}

function makeDragNDrop(){
	$("#loadedCollection").find("h3").draggable({revert: true, handle: '.move'});
        $("#loadedCollection").find("h3").find("img").click(function(event) {
                                        if (stop) {
                                                event.stopImmediatePropagation();
                                                event.preventDefault();
                                        }
                                });

				$("#cont-collectionList").find("li").droppable({
						tolerance: 'pointer',
						greedy: true,
						activeClass: 'ui-state-hover',
						hoverClass: 'ui-state-highlight',
						drop: function(event, ui) {
								ui.draggable.fadeOut(function(){ui.draggable.remove();});

                                                                var req = opensocial.newDataRequest();
                                                                var params = {};
                                                                params[opensocial.Message.Field.COLLECTION_IDS] = $(this).attr("collection");
                                                                req.add(req.newUpdateMessageRequest('OWNER', $(this).attr("collection"), ui.draggable.attr("message"),params), 'update');
                                                                req.send();
						}


		});
	
}



function makeAccordion(){

                                $(".accordion").accordion({
                                        autoHeight: false,
                                        navigation: true,
                                        collapsible: true,
                                        active: false,
                                        changestart: function(event, ui) {
                                                if(ui.newContent.length){
                                                        //Only if not loaded
                                                        if(ui.newContent.text().length == 0){
                                                                var id = ui.newContent.find("div").attr("id");
                                                                $.getJSON("core/privateMessage/getConversation/conversation/"+id,function(data){
                                                                        if(ui.newHeader.find("a").hasClass("ui-state-highlight")){
                                                                                //Opening new message
                                                                                $.widget.privateMessagesDirectories.checkNewMessages();
                                                                                ui.newHeader.find("a").removeClass("ui-state-highlight");
                                                                        }
                                                                        ui.newContent.html("");
                                                                        var messages = $("<div>").addClass("messages");
                                                                        $.each(data, function(i,message){

                                                                                var odd;
                                                                                if( (i % 2) == 0 )
                                                                                {
                                                                                        odd = 'class="ui-state-default ui-corner-all"';
                                                                                }else odd = "";

                                                                                messages.prepend('<table '+ odd +' width="100%">'+
                                                                                '<tbody>'+
                                                                                '       <tr>'+
                                                                                '               <td valign="top" width="50px">'+
                                                                                '                       <a class="ui-helper-reset" href="#profile/loadProfile/id/'+message.author.id+'" rel="history">'+
                                                                                '                               <img alt="'+message.author.first_name+' '+message.author.last_name+'" title="'+message.author.first_name+" "+message.author.last_name+'" src="/core/photo/thumbnail/id/'+message.author.main_photo_id+'/type/mini" class="ui-state-default ui-corner-all" border="0">'+
                                                                                '                       </a>'+
                                                                                '               </td>'+
                                                                                '               <td valign="top"><div style="color: rgb(0, 0, 0);">'+
                                                                                '                       <a class="ui-helper-reset" href="#profile/loadProfile/id/'+message.author.main_photo_id+'" rel="history" style="color: rgb(0, 0, 0);">'+
                                                                                                message.author.first_name+' '+message.author.last_name+
                                                                                '                       </a>'+
                                                                                '                       <span> el dia '+message.date+'</b></span>'+
                                                                                '                       </div>'+
                                                                                '                       <div>'+
                                                                                '                               <div style="color: rgb(0, 0, 255); font-family: times new roman,times;">'+message.body+'</div>'+
                                                                                '                       </div>'+
                                                                                '               </td>'+
                                                                                '       </tr>'+
                                                                                '</tbody>'+
                                                                                '</table>'+
                                                                                '<div><br/></div>');


                                                                        });
                                                                        ui.newContent.append(messages);
                                                                        ui.newContent.append('<div align="center">'+
                                                                        '<div style="width: 400px;" class="texto" id="cont-writeMessage" align="left">'+
                                                                        '</div>'+
                                                                        '<br />'+
                                                                        '<button id="but-sendMessage">'+$._("Send message")+'</button>'+
                                                                        '<br />'+
                                                                        '<br />'+
                                                                        '</div>');
                                                                        ui.newContent.find("#cont-writeMessage").editor({height:80, width:400,youtube:false,sound:false});
                                                                        ui.newContent.find("#but-sendMessage").button().click(function(){

                                                                                if(ui.newContent.find("#cont-writeMessage").find(".text").html().length > 0)
                                                                                {
                                                                                        var content = ui.newContent.find("#cont-writeMessage").text();
                                                                                        ui.newContent.find("#cont-writeMessage").editor({send: "/core/privateMessage/send/conversation/"+id, callback: function(data){
                                                                                                data = $.toJSON(data);
                                                                                                if(data.error)
                                                                                                        jAlert(data.message,"Error");
                                                                                                else{

                                                                                                        var odd;
                                                                                                        if( (messages.find("table").length % 2) == 0 )
                                                                                                        {
                                                                                                                odd = 'class="ui-state-default ui-corner-all"';
                                                                                                        }else odd = "";

                                                                                                        messages.prepend('<table '+ odd +' width="100%">'+
                                                                                                                        '<tbody>'+
                                                                                                                        '       <tr>'+
                                                                                                                        '               <td valign="top" width="50px">'+
                                                                                                                        '                       <a class="ui-helper-reset" href="#profile/loadProfile/id/'+$.wixet.user.id+'" rel="history">'+
                                                                                                                        '                               <img alt="'+$.wixet.user.firstName+'" title="'+$.wixet.user.firstName+'" src="/core/photo/thumbnail/id/'+$.wixet.user.mainPhotoId+'/type/mini" class="ui-state-default ui-corner-all" border="0">'+
                                                                                                                        '                       </a>'+
                                                                                                                        '               </td>'+
                                                                                                                        '               <td valign="top"><div style="color: rgb(0, 0, 0);">'+
                                                                                                                        '                       <a class="ui-helper-reset" href="#profile/loadProfile/id/'+$.wixet.user.id+'" rel="history" style="color: rgb(0, 0, 0);">'+
                                                                                                                                                $.wixet.user.firstName+
                                                                                                                        '                       </a>'+
                                                                                                                        '                       <span> el dia </b></span>'+
                                                                                                                        '                       </div>'+
                                                                                                                        '                       <div>'+
                                                                                                                        '                               <div style="color: rgb(0, 0, 255); font-family: times new roman,times;">'+content+'</div>'+
                                                                                                                        '                       </div>'+
                                                                                                                        '               </td>'+
                                                                                                                        '       </tr>'+
                                                                                                                        '</tbody>'+
                                                                                                                        '</table>'+
                                                                                                                        '<div><br/></div>');
                                                                                                }

                                                                                        }});
                                                                                }
                                                                        });
                                                                });

                                                        }
                                                }
                                        }
                                });



}
			
			function configureCollection (collectionId) {
				var widget = this.widget;
				var dialog = null;
				var buttonsOpts = {};
				buttonsOpts[$._('Cancel')] = function (){
					$(this).dialog('close');
				};
				
				buttonsOpts[$._('Save changes')] = function() {
					var name = $.trim(dialog.find(".name").removeClass("ui-state-error").val());
					var allowed = new Array();
					var denied = new Array();
					var ok = true;
					if(name.length > 0)
					{
						$.each(dialog.find(".allowed option:selected"),function(i,group){
							allowed.push({id:$(group).val()});
						});
						
						$.each(dialog.find(".denied option:selected"),function(i,group){
							denied.push({id:$(group).val()});
						});
						
						$.getJSON("/core/album/newName/id/"+albumId+"/name/"+name,function(data){
							if(data.error)
							{
								ok = false;
								jAlert(data.message,"Error");
							}
							else{
								$("[album="+albumId+"] span").text(name);
								
								if($("ul").attr("album") == albumId)
									$(".title").text(name);
									
								userNotice($._('The album name have been successfully changed'));
							}
								
						});
						
						$.post("/core/album/newPermissions/id/"+albumId,{permissions:$.toJSON({allowed:allowed,denied:denied})},function(data){
							data = eval("("+data+")");
							if(data.error)
							{
								ok = false;
								jAlert(data.message,"Error");
							}else
								userNotice($._('The album permissions have been successfully changed'));
						});
						
						if(ok)
						{
							$(this).dialog('close');
						}
						
					}else{
						var input = dialog.find(".name");
						input.focus().addClass("ui-state-error");
						jAlert($._('Please write an album name'),"Error",function(){
							input.focus();
						});
					}
				};
				dialog = $('<div id="dialog-confirm" title="Album Configuration">'+
						'<br /><div align="center"><img class="ui-state-default ui-corner-all" src="images/progress.gif" /></div>'+
						'</div>').dialog({
							resizable: true,
							height:400,
							width: 500,
							modal: true,
							open: function(){
								$.getJSON("/core/album/details/id/"+albumId,function(album){
									dialog.html("<div>"+$._('Album name')+": <input type='text' class='name ui-widget-content ui-corner-all' value='"+album.name+"'></div>" +
											'<br/><br/></div>');
									dialog.append("<div align='center' class='ui-widget-header ui-corner-all'>"+$._('Access allowed')+"</div>");
									dialog.append("<select align='center' multiple class='allowed'></select></div>");
									
									dialog.append("<br/><br/><div align='center' class='ui-widget-header ui-corner-all'>"+$._('Access denied')+"</div>");
									dialog.append("<select align='center' multiple class='denied'></select></div>");
									
									$.getJSON("/core/album/permissionsDetails/id/"+albumId,function(groups){
										var allowedSelect = dialog.find(".allowed");
										var deniedSelect = dialog.find(".denied");
										$.each(groups.allowedGroups,function(i,group){
											allowedSelect.append("<option selected value='"+group.group_id+"'>"+group.group_name+"</option>");
										});
										$.each(groups.undefinedAllowedGroups,function(i,group){
											allowedSelect.append("<option value='"+group.group_id+">"+group.group_name+"</option>");
										});
										
										$.each(groups.deniedGroups,function(i,group){
											deniedSelect.append("<option selected value='"+group.group_id+">"+group.group_name+"</option>");
										});
										$.each(groups.undefinedDeniedGroups,function(i,group){
											deniedSelect.append("<option value='"+group.group_id+">"+group.group_name+"</option>");
										});
										allowedSelect.multiselect();	
										deniedSelect.multiselect();
									});
								});
							},
							buttons:buttonsOpts
						});


			}
			
			
			//Nuevo
			function removeCollection(element) {
				var row = $(element).parent();
				jConfirm("Realmente quieres borrar el directorio \""+row.find("span").text()+"\"? (los mensajes contenidos en el directorio también serán eliminados)","Confirmacion",function(e){
					if(e){
						var req=opensocial.newDataRequest();
						req.add(req.newDeleteMessageCollectionRequest("OWNER",row.attr("collection")), "result");
			
						req.send(function(data){
							var res = data.get("result").getData();
							if(res.error)
								jAlert(res.message,"Error");
							else
								document.location.href="#privateMessage?reload="+(new Date().getTime());
						});
					}
				});
			}
			
			function createCollection(name) {
				
				var req=opensocial.newDataRequest();
				req.add(req.newCreateMessageCollectionRequest("OWNER",name), "collectionId");
	
				req.send(function(data){
					var id = data.get("collectionId").getData();
					document.location.href="#privateMessage/"+id;
				});
			}
			
