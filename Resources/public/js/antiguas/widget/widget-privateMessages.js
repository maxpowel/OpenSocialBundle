(function($) {
	
	$.widget.privateMessages = {
			widget: null,
			init: function(widget) {
				this.widget=$(widget);
				this.accordion();
				this.widget.find(".paginator").pager({ pagenumber: 1, pagecount: this.widget.find(".accordion").attr("total"), buttonClickCallback: $.widget.privateMessages.paginate });
				
			},
			accordion: function(){
				this.widget.find(".accordion").accordion({
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
										'	<tr>'+
										'		<td valign="top" width="50px">'+
										'			<a class="ui-helper-reset" href="#profile/loadProfile/id/'+message.author.id+'" rel="history">'+
										'				<img alt="'+message.author.first_name+' '+message.author.last_name+'" title="'+message.author.first_name+" "+message.author.last_name+'" src="/core/photo/thumbnail/id/'+message.author.main_photo_id+'/type/mini" class="ui-state-default ui-corner-all" border="0">'+
										'			</a>'+
										'		</td>'+
										'		<td valign="top"><div style="color: rgb(0, 0, 0);">'+
										'			<a class="ui-helper-reset" href="#profile/loadProfile/id/'+message.author.main_photo_id+'" rel="history" style="color: rgb(0, 0, 0);">'+
												message.author.first_name+' '+message.author.last_name+
										'			</a>'+
										'			<span> el dia '+message.date+'</b></span>'+
										'			</div>'+
										'			<div>'+
										'				<div style="color: rgb(0, 0, 255); font-family: times new roman,times;">'+message.body+'</div>'+
										'			</div>'+
										'		</td>'+
										'	</tr>'+
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
															'	<tr>'+
															'		<td valign="top" width="50px">'+
															'			<a class="ui-helper-reset" href="#profile/loadProfile/id/'+$.wixet.user.id+'" rel="history">'+
															'				<img alt="'+$.wixet.user.firstName+'" title="'+$.wixet.user.firstName+'" src="/core/photo/thumbnail/id/'+$.wixet.user.mainPhotoId+'/type/mini" class="ui-state-default ui-corner-all" border="0">'+
															'			</a>'+
															'		</td>'+
															'		<td valign="top"><div style="color: rgb(0, 0, 0);">'+
															'			<a class="ui-helper-reset" href="#profile/loadProfile/id/'+$.wixet.user.id+'" rel="history" style="color: rgb(0, 0, 0);">'+
																		$.wixet.user.firstName+
															'			</a>'+
															'			<span> el dia </b></span>'+
															'			</div>'+
															'			<div>'+
															'				<div style="color: rgb(0, 0, 255); font-family: times new roman,times;">'+content+'</div>'+
															'			</div>'+
															'		</td>'+
															'	</tr>'+
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
			},
			paginate: function(page){
				var thisWidget = this;
				var widget = $.widget.privateMessages.widget;
				var accordion = widget.find(".accordion");
				accordion.fadeOut("fast",function(){
					accordion.accordion("destroy");
					accordion.html("");
					var directory = $.url.getParam("id");
					if(directory != null) directory = "/directory/"+directory;
					else directory = "";
					
					$.getJSON("core/privateMessage/index/page/"+page+""+directory,
							function(data)
							{
								widget.find(".title").text(data.album.name);
							 	widget.find(".paginator").pager({ pagenumber: page, pagecount: data.pagecount, buttonClickCallback: $.widget.privateMessages.paginate });
							 		if(data.messages != null){
										$.each(data.messages, function(i,message){
											var highlight = "";
											if(message.new)
												highlight = "class='ui-state-highlight'";
												
												
											accordion.append('<h3 message="'+message.id+'"><a href="#" '+highlight+'>'+message.body.substr(0,25)+' ['+message.date+']<img src="images/cruzTemporal.png" class="move ui-state-default ui-corner-all" style="float:right;" /></a></h3>'+
															 '<div><div id="'+message.id+'" align="center"><img src="images/progress.gif"/></div></div>');
										});
									
										$.widget.privateMessages.accordion();
									accordion.fadeIn("slow");
									thisWidget.prepareMessageList();
							 		}else accordion.html("<div>"+$._("No messages")+"</div>").show();
							});
				});
				
				 
			},
			prepareMessageList: function () {
				var widget = this.widget;
				widget.find("h3").draggable({revert: true, handle: '.move'});
				widget.find("h3").find("img").click(function(event) {
					if (stop) {
						event.stopImmediatePropagation();
						event.preventDefault();
					}
				});


				try{
						$.widget.privateMessagesDirectories.widget.find("li").droppable({
							tolerance: 'pointer',
							greedy: true,
							activeClass: 'ui-state-hover',
							hoverClass: 'ui-state-highlight',
							drop: function(event, ui) {
								ui.draggable.fadeOut(function(){ui.draggable.remove();});
								$.getJSON("/core/privateMessage/moveMessage/conversation/"+$(ui.draggable).attr("message")+"/directory/"+$(event.target).attr("directory"),function(data){
									if(ui.draggable.find("a").hasClass("ui-state-highlight")){
										//Moving new message
										$.widget.privateMessagesDirectories.checkNewMessages();
									}
									if(data.error)
										jAlert(data.message,"Error");
								});
							}


					});
				}catch(err){
					jAlert("Dependency missing: "+err.message);
				}
			}

	}
	
})(jQuery);