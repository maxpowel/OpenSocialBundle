$(document).ready(function(){
    				
		 var tab = $("#profileTabs");
                tab.tabs({
						tabTemplate: '<li><a href="#{href}">#{label}</a> <span class="ui-icon ui-icon-close">Remove tab</span></li>',
						add: function(event, ui) {
							var newTab = $(ui.panel);
							var url = $(ui.tab).attr("href").split("-");
							tabId = url[1];
							newTab.append('<p align="center"><div id="'+tabId+'">'+tab.find("#new").find(".text").html()+'</div><br>'+
									'<p align="center"><a id="boton-guardar'+tabId+'" class="dialog_link ui-state-default ui-corner-all" href="javascript:void(0)"><span class="ui-icon ui-icon-disk"></span>Save</a>'+
									'</p><br></p>');
							newTab.find('#'+tabId).editor({height:80, width:700});
							newTab.find('#boton-guardar'+tabId+', ul#icons li').hover(
									function() { $(this).addClass('ui-state-hover'); },
									function() { $(this).removeClass('ui-state-hover'); }
							);


							newTab.find('#boton-guardar'+tabId).click(
									function() {
											$('#'+tabId).editor({send: "core/profile/updateInterest/id/"+tabId, callback: function(data){
												data = eval("("+data+")");
												if(data.error){
													jAlert(data.message,"Error")
												}
												else
													$.wixet.userNotice($._('Information about %<br>saved',new Array(name)));
												},clean: false});
										}
							);
						}
					});
});

