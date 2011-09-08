(function($) {
	
	$.widget.photo = {
			widget: null,
			init: function(widget) {
				this.widget = $(widget);
			},
			load: function(id){
				this.widget.find("#img-photo").attr("src","/core.php/photo/thumbnail/id/"+id+"/type/normal").
				jQueryNotes({operator: '/core/photo/getTags/id/'+id,operatorUpdate: '/core/photo/updateTag/id/'+id,
				operatorNew: '/core/photo/newTag/id/'+id,operatorRemove: '/core/photo/removeTag/id/'+id});
			
			},
			
			photoPermissionsDialog: function (photoId) {
				var buttonsOpts = {};
				var dialog = null;
				buttonsOpts[$._('Cancel')] = function (){
					$(this).dialog('close');
				};
				buttonsOpts[$._('Save changes')] = function() {
					var allowed = new Array();
					var denied = new Array();
					var ok = true;

						$.each(dialog.find(".allowed option:selected"),function(i,group){
							allowed.push({id:$(group).val()});
						});
						
						$.each(dialog.find(".denied option:selected"),function(i,group){
							denied.push({id:$(group).val()});
						});

						
						$.post("/core/photo/newPermissions/id/"+photoId,{permissions:$.toJSON({allowed:allowed,denied:denied})},function(data){
							data = eval("("+data+")");
							if(data.error)
							{
								ok = false;
								jAlert(data.message,"Error");
							}else
								userNotice($._("The photo permissions have been successfully changed"));
						});
						
						if(ok)
						{
							$(this).dialog('close');
						}
					
				};
				
				var widget = this.widget;
				dialog = $('<div id="dialog-confirm" title="'+$._("Photo Permissions")+'">'+
						'<br /><div align="center"><img class="ui-state-default ui-corner-all" src="images/progress.gif" /></div>'+
						'</div>').dialog({
							resizable: true,
							height:400,
							width: 500,
							modal: true,
							open: function(){
								$.getJSON("/core/photo/permissionsDetails/id/"+photoId,function(groups){
									dialog.html("");
									dialog.append("<div align='center' class='ui-widget-header ui-corner-all'>"+$._("Access allowed")+"</div>");
									dialog.append("<div align='center' multiple class='allowed'></select></div>");
									
									dialog.append("<br/><br/><div align='center' class='ui-widget-header ui-corner-all'>"+$._("Access denied")+"</div>");
									dialog.append("<div align='center' multiple class='denied'></select></div>");
									
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
							},
							buttons: buttonsOpts
						});
			}
	}
	
})(jQuery);

