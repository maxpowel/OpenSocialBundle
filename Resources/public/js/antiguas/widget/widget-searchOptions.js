(function($) {
	
	$.widget.searchOptions = {
			widget: null,
			page: 1,
			init: function(widget) {
				this.widget = $(widget);
				var thisWidget = this;
				this.widget.find(".portlet-header").remove();
				this.widget.find("#tabs-search").tabs({show: function(event, ui) {
					var panel = $(ui.panel);
					if(panel.attr("id") == "tabs-places" && panel.find(".placecity-button").length == 0){
						$(ui.panel).find("#placecity").selectmenu({style:'dropdown',maxHeight:200});
						$(ui.panel).find("#placetype").selectmenu({style:'dropdown',maxHeight:200});
					}
				}}).find(".ui-widget-content").css({padding:"2px"});
				this.widget.find(".portlet-content").css("padding","0em");
				var widget = this.widget;
				this.widget.find("#personName").hint();
				this.widget.find("#placeName").hint();
				
				/*-- PEOPLE --*/
				this.widget.find(".but-people").button().click(function(){
					//TODO unificar esto, que como ves es casi igual cambiando
					//unas palabras. La idea es que se puedan añadir mas cosas
					//sin necesidad de tocar codigo
					
					////
					//School list
					var school = new Array();
					$.each(widget.find("#schoolList").find("li"),function(i,element){
						school.push(parseInt($(element).attr("school")));
					});
					//Workplace list
					var workplace = new Array();
					$.each(widget.find("#workplaceList").find("li"),function(i,element){
						workplace.push(parseInt($(element).attr("workplace")));
					});
					
					//Place list
					var place = new Array();
					$.each(widget.find("#placeList").find("li[place]"),function(i,element){
						place.push(parseInt($(element).attr("place")));
					});
					//Cityplace list
					var cityplace = new Array();
					$.each(widget.find("#placeList").find("li[city]"),function(i,element){
						cityplace.push(parseInt($(element).attr("city")));
					});
					
					//
					var name = widget.find("#personName").val();
					if(name == widget.find("#personName").attr("title"))
						name="";
					$.post("core/search/index/page/"+thisWidget.page,{
						name:name,
						school:$.toJSON(school),
						workplace:$.toJSON(workplace),
						place:$.toJSON(place),
						agemin:widget.find("#agemin").val(),
						agemax:widget.find("#agemax").val(),
						city:widget.find("#city").val(),
						cityplace:$.toJSON(cityplace),
						searchin:widget.find('input:radio[name=searchin]:checked').val(),
						},function(data){
							data = eval("("+data+")");
							$.widget.searchBody.widget.find(".paginator").pager({ pagenumber: thisWidget.page, pagecount: data.pagecount, buttonClickCallback: $.widget.searchBody.paginate });
							var list = $.widget.searchBody.widget.find(".result");
							list.html("");
							if(data.users.length > 0){
								$.each(data.users,function(i,user){
									var element = $('<li style="clear:left;"><hr class="ui-state-default"></hr>'+
									'<img class="ui-state-default ui-corner-all" style="float:left;" src="core.php/photo/thumbnail/id/'+user.photo_id+'/type/mini" />'+
									'<ul class="normal-list" style="float:left;">'+
									'<li style="margin-top:0"><a class="ui-state-default ui-corner-all" href="#profile/load/id/'+user.id+'" style="text-decoration:none;">'+user.firstname+'</a></li>'+
									'</ul>'+
									"</li>")
									var subList=element.find("ul");
									if(user.city.city_id != null){
										subList.append("<li>"+$._("City")+": "+user.city.name+"</li>");
									}
									
									if(user.workplace.length > 0){
										var workplaceElement = $("<li>"+$._("Workplaces")+":</li>");
										$.each(user.workplace,function(i,workplace){
											workplaceElement.append("<a href='#"+workplace.workplace_id+"'>"+workplace.name+"</a>")
										});
										subList.append(workplaceElement);
									}
									
									if(user.school.length > 0){
										var schoolElement = $("<li>"+$._("Studies")+":</li>");
										$.each(user.school,function(i,school){
											schoolElement.append("<a href='#"+school.school_id+"'>"+school.name+"</a>")
										});
										subList.append(schoolElement);
									}
									//Actions available
									var actions = $("<li>");
									
									if(user.friend == false){
										var sendFriendRequest = $("<button>"+$._("Friend request")+"</button>");
										sendFriendRequest.button().click(function(){
											var button = this;
											$.getJSON("core/user/friendRequest/id/"+user.id,function(data){
												if(data.error)
													jAlert(data.message);
												else{
													$.wixet.userNotice($._("Friend request sent"));
													$(button).button('disable');
												}
											})
										});
										actions.append(sendFriendRequest);
									}
									
									var sendPrivateMessage = $("<button>"+$._("Private message")+"</button>");
									sendPrivateMessage.button().click(function(){
										$.wixet.privateMessage(user.id);
									});
									
									actions.append(sendPrivateMessage);
									
									subList.append(actions);
									/////////////
									list.append(element);
								});
								list.find("hr").eq(0).remove();
							}else{
								list.append("<li>"+$._("No results found")+"</li>");
							}
							
							
					});
				});
				
				
				//Search in
				widget.find("#searchin").buttonset();
				
				//People search lists
				widget.find("#city").selectmenu({style:'dropdown',maxHeight:200});
				widget.find("#agemin").selectmenu({style:'dropdown',maxHeight:200});
				/*setTimeout(function(){
				widget.find("#agemin").append("<option>HOla</option");
				widget.find("#agemin").selectmenu('destroy');
				widget.find("#agemin").selectmenu({style:'dropdown',maxHeight:200});
				},2000);*/
				//$("#agemin-menu").append('<li role="presentation" class="ui-selectmenu-item-selected"><a aria-selected="true" role="option" tabindex="-1" href="#" id="ui-selectmenu-item-481">Albacete</a></li>');
				widget.find("#agemax").selectmenu({style:'dropdown',maxHeight:200});

				
				//TODO lo mismo que lo de arriba
				
				//School search
				this.widget.find(".school").autocomplete({
					source: "core/search/school",
					minLength: 2,
					select: function(event, ui) {
						//Add if not added already
						if(widget.find("#schoolList").find("li[school='"+ui.item.id+"']").length == 0){
							var element = $('<li school="'+ui.item.id+'"><span style="float:left" class="ui-icon ui-icon-close"></span><div>'+ui.item.value+'</div></li>');
							element.find("span").click(function(){
								element.remove();
							});
							widget.find("#schoolList").append(element);
						}
						setTimeout(function(){ widget.find(".school").val(""); },100);

					}
				}).hint();
				
				//Workplace search
				this.widget.find(".workplace").autocomplete({
					source: "core/search/workplace",
					minLength: 2,
					select: function(event, ui) {
						//Add if not added already
						if(widget.find("#workplaceList").find("li[workplace='"+ui.item.id+"']").length == 0){
							var element = $('<li workplace="'+ui.item.id+'"><span style="float:left" class="ui-icon ui-icon-close"></span><div>'+ui.item.value+'</div></li>');
							element.find("span").click(function(){
								element.remove();
							});
							widget.find("#workplaceList").append(element);
						}
						setTimeout(function(){ widget.find(".workplace").val(""); },100);

					}
				}).hint();
				
				//Place search
				this.widget.find(".place").autocomplete({
					source: "core/search/placeSimple",
					minLength: 2,
					select: function(event, ui) {
						//Add if not added already
						if(ui.item.type=="place"){
							if(widget.find("#placeList").find("li[place='"+ui.item.id+"']").length == 0){
								var element = $('<li place="'+ui.item.id+'"><span style="float:left" class="ui-icon ui-icon-close"></span><div>'+ui.item.value+'</div></li>');
								element.find("span").click(function(){
									element.remove();
								});
								widget.find("#placeList").append(element);
							}
						}else{
							if(widget.find("#placeList").find("li[city='"+ui.item.id+"']").length == 0){
								var element = $('<li city="'+ui.item.id+'"><span style="float:left" class="ui-icon ui-icon-close"></span><div>'+ui.item.value+'</div></li>');
								element.find("span").click(function(){
									element.remove();
								});
								widget.find("#placeList").append(element);
							}
						}
						setTimeout(function(){ widget.find(".place").val(""); },100);

					}
				}).hint();
				/*-- END PEOPLE --*/
				/*-- PLACES --*/
				this.widget.find(".but-places").button().click(function(){
					//Town list
					var towns = new Array();
					$.each(widget.find("#townList").find("li"),function(i,element){
						town.push(parseInt($(element).attr("town")));
					});
					var town = null;
					if(towns.length > 0)
						town = towns[0];
					
					//
					var name = widget.find("#placeName").val();
					if(name == widget.find("#placeName").attr("title"))
						name="";
					$.post("core/search/places",{
						name:name,
						town:town,
						city:widget.find("#placecity").val(),
						type:widget.find("#type").val(),
						},function(data){
							data = eval("("+data+")");
							var list = $.widget.searchBody.widget.find(".result");
							list.html("");
							if(data.places.length > 0){
								$.each(data.places,function(i,place){
									var element = $('<li style="clear:left;"><hr class="ui-state-default"></hr>'+
									'<img class="ui-state-default ui-corner-all" style="float:left;" src="core.php/photo/thumbnail/id/'+place.photo_id+'/type/mini" />'+
									'<ul class="normal-list" style="float:left;">'+
									'<li style="margin-top:0"><a class="ui-state-default ui-corner-all" href="#profile/load/id/'+place.id+'" style="text-decoration:none;">'+place.name+'</a></li>'+
									'</ul>'+
									"</li>")
									var subList=element.find("ul");
									if(user.city.city_id != null){
										subList.append("<li>"+$._("City")+": "+user.city.name+"</li>");
									}

									//Actions available
									var actions = $("<li>");
									
									if(user.friend == false){
										var like = $("<button>"+$._("I like going to")+"</button>");
										like.button().click(function(){
											var button = this;
											$.getJSON("core/user/friendRequest/id/"+place.id,function(data){
												if(data.error)
													jAlert(data.message,"Error");
												else{
													$(button).button('disable');
												}
											})
										});
										actions.append(like);
									}
									
									var sendPrivateMessage = $("<button>"+$._("Private message")+"</button>");
									sendPrivateMessage.button().click(function(){
										$.wixet.privateMessage(place.id);
									});
									
									actions.append(like);
									
									subList.append(actions);
									/////////////
									list.append(element);
								});
								list.find("hr").eq(0).remove();
							}else{
								list.append("<li>"+$._("No results found")+"</li>");
							}
							$.widget.searchBody.widget.find(".paginator").pager({ pagenumber: 1, pagecount: data.pagecount, buttonClickCallback: $.widget.searchBody.paginate });
							
							
					});
				});
				
				
				//Workplace search
				this.widget.find(".town").autocomplete({
					source: "core/search/town",
					minLength: 2,
					select: function(event, ui) {
						//Add if not added already
						if(widget.find("#townList").find("li[town='"+ui.item.id+"']").length == 0){
							var element = $('<li town="'+ui.item.id+'"><span style="float:left" class="ui-icon ui-icon-close"></span><div>'+ui.item.value+'</div></li>');
							element.find("span").click(function(){
								element.remove();
							});
							widget.find("#townList").append(element);
						}
						setTimeout(function(){ widget.find(".town").val(""); },100);

					}
				}).hint();
				/*-- END PLACES--*/
				
				
			},
			load: function(){
				//Do nothing
			}
			
	}
	
})(jQuery);