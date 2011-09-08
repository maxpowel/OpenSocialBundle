(function($) {
	
	$.widget.accountBody = {
			locale: null,
			widget: null,
			init: function(widget) {
				this.widget = $(widget);
			},

			loadPersonalInformation: function(actionVars){
				var body = this.widget.find(".portlet-content");
				body.html("");
				this.widget.find(".title").text($._('Personal information'));

					var tabla = $("<table>");
						
					//Nombre
					var fila1 = $("<tr>");
					var col1_1 = $("<td>");
					col1_1.append('<div class="ui-helper-reset">'+$._('Firstname')+':</div>');
					var col1_2 = $("<td>");
					col1_2.append('<div><input type="text" id="nombre" class="text ui-widget-content ui-corner-all ac_input"></div>');
					fila1.append(col1_1);
					fila1.append(col1_2);
					tabla.append(fila1);
					
					//Apellido
					var fila2 = $("<tr>");
					var col2_1 = $("<td>");
					col2_1.append('<div class="ui-helper-reset">'+$._('Lastname')+':</div>');
					var col2_2 = $("<td>");
					col2_2.append('<div><input type="text" id="apellido1" class="text ui-widget-content ui-corner-all ac_input"></div>');
					fila2.append(col2_1);
					fila2.append(col2_2);
					tabla.append(fila2);
					
					//Apellido2
					var fila3 = $("<tr>");
					var col3_1 = $("<td>");
					col3_1.append('<div class="ui-helper-reset">'+$._('Second lastname')+':</div>');
					var col3_2 = $("<td>");
					col3_2.append('<div><input type="text" id="apellido2" class="text ui-widget-content ui-corner-all ac_input"></div>');
					fila3.append(col3_1);
					fila3.append(col3_2);
					tabla.append(fila3);
					
					//Provincia
					var fila4 = $("<tr>");
					var col4_1 = $("<td>");
					col4_1.append('<div class="ui-helper-reset">'+$._('City')+':</div>');
					var col4_2 = $("<td>");
					var listaProvincias = $("<select>");
					listaProvincias.attr("id","provincia");
					listaProvincias.width(200);
					col4_2.append(listaProvincias);
					fila4.append(col4_1);
					fila4.append(col4_2);
					tabla.append(fila4);
					//esta parte se completa en la llamada ajax
					
					//Fecha de nacimiento
					var fila3 = $("<tr>");
					var col3_1 = $("<td>");
					col3_1.append('<div class="ui-helper-reset">'+$._('Birthdate')+':</div>');
					var col3_2 = $("<td>");
					col3_2.append('<div><input type="text" id="nacimiento" class="text ui-widget-content ui-corner-all ac_input"></div>');
					fila3.append(col3_1);
					fila3.append(col3_2);
					tabla.append(fila3);
					
					
					body.append(tabla);
					//Cargar provincias y fecha de nacimiento
					/*$.getJSON("consultasAjax.php?seccion=listaProvincias",
					function(data){
						var listaProvincias = $("#provincia");
						$.each(data, function(i,provincia){
							listaProvincias.append('<option value="'+provincia.id+'">'+provincia.provincia+'</option>');
						});

						$("#provincia").combo();

					});*/
					
					/*listaProvincias.append('<option value="0">No city</option>');
					body.find("#provincia").combo();*/
					//Cargamos la informacion del usuario
					$.getJSON("core/user",
					function(data){
						//City list
						var cityId=data.city.city_id;
						$.getJSON("core/wixet/cityList/country/1",function(data){
							$.each(data.cityList,function(i,city){
								listaProvincias.append("<option value='"+city.city_id+"'>"+city.name+"</option>");
							});
							listaProvincias.find("[value="+cityId+"]").attr("selected",true);

							listaProvincias.selectmenu({style:'dropdown',maxHeight:200});
						});
						/////
						//Calendario
						$('#nacimiento').attr("readonly","readonly");

						var dayMin = new Array();
						$.each($.i18n.get('day'),function(i,element){
							dayMin.push(element.substr(0,2));
						});

						$('#nacimiento').datepicker({
							showButtonPanel: true,
							altFormat: $.i18n.get('shortDate'),
							dateFormat: $.i18n.get('shortDate'),
							dayNames: $.i18n.get("day"),
							dayNamesMin: dayMin,
							dayNamesShort: dayMin,
							monthNames: $.i18n.get('month'),
							buttonText: $._('Choose'),
							closeText: $._('Close'),
							currentText: $._('Today'),
							changeYear: true,
							maxDate: new Date(),
							showOn: 'both', buttonImage: 'images/calendar.gif'
							});
							
						    body.find("#nombre").val(data.firstName);
						    body.find("#apellido1").val(data.lastName);
						    body.find("#apellido2").val(data.secondLastName);
							
							if(data.birthday != null){
								var fechaHoy = new Date();
								var fechaNac = new Date();
								nacimiento = data.birthday.split("-");
								fechaNac.setFullYear(nacimiento[0],(nacimiento[1])-1,nacimiento[2]);
								//El datepicker funciona dandole la diferencia de dias, asi que converitmos
								//la fecha en la diferencia de dias
								//(fechaNac-fechaHoy)/1000/3600/24
	
								
								$('#nacimiento').datepicker( 'setDate' , (fechaNac-fechaHoy)/86400000 )
							}else $('#nacimiento').datepicker();
						
						
					});
						
						var botonGuardar = $('<a id="boton-guardarDatosPersonales" class="dialog_link ui-state-default ui-corner-all" href="javascript:void(0)"><span class="ui-icon ui-icon-disk"/>'+$._('Save changes')+'</a>');
							botonGuardar.hover(
								function() { $(this).addClass('ui-state-hover'); }, 
								function() { $(this).removeClass('ui-state-hover'); }
							);
							
							botonGuardar.click(
								function() {
									var birthday = $("#nacimiento").val();
									if(birthday.length > 0){
										birthday = birthday.split("-");
										birthday= birthday[2]+"-"+birthday[1]+"-"+birthday[0];
									}
									$.post("core/user/update",{ firstName: $("#nombre").val(), lastName: $("#apellido1").val(), secondLastName: $("#apellido2").val() ,city: $("#provincia").val(), birthday: birthday},
									function(data){
										data = eval("("+data+")");
										if(data.error == false)
										{
											$.wixet.user.firstName =$("#nombre").val();
											$.wixet.user.lastName = $("#apellido1").val();
											$("#resultado").html('<div class="ui-state-highlight ui-corner-all" style="padding: 0pt 0.7em; margin-top: 20px;">'+
																	'<p>'+
																	'<span class="ui-icon ui-icon-info" style="float: left; margin-right: 0.3em;"/>'+
																	$._('Data saved succesfully')+
																	'</p>'+
																	'</div>');
											$.wixet.userNotice($._('Personal data have been changed'));
										}
										else
										{
											$("#resultado").html('<div class="ui-state-error ui-corner-all" style="padding: 0pt 0.7em; margin-top: 20px;">'+
																	'<p>'+
																	'<span class="ui-icon ui-icon-alert" style="float: left; margin-right: 0.3em;"/>'+
																	+data.message+
																	'</p>'+
																	'</div>');
										}
										$("#resultado").fadeIn();
									});

									}
							);
							
						var botonAlmacen = $("<p align='center'>");
							botonAlmacen.append("<br>");
							botonAlmacen.append(botonGuardar);
							botonAlmacen.append("<br>");
							botonAlmacen.append("<br>");
							
				body.append("<div id='resultado'></div>");
				body.append(botonAlmacen);

			},
			
			loadProfile: function(actionVars){
				this.widget.find(".title").text($._('Interests'));
				var body = this.widget.find(".portlet-content");
				$.getJSON("core/profile",
				function(data){
					body.html('<div id="tab"> <ul id="listaTabs"> </ul></div>');
					var tabList = body.find("#listaTabs");
					var tab = body.find("#tab");
					$.each(data.interests, function(i,interest){
						var id = interest.interest_id;
						var name = interest.name;
						var content = interest.content;
						
						tabList.append('<li><a href="#tab-'+id+'">'+name+'</a> <span class="ui-icon ui-icon-close">'+$._('Remove tab')+'</span></li>');
						tab.append('<div id="tab-'+id+'">'+
							'<p align="center"><div id="'+id+'">'+content+'</div><br>'+
							'<p align="center"><a id="boton-guardar'+id+'" class="dialog_link ui-state-default ui-corner-all" href="javascript:void(0)"><span class="ui-icon ui-icon-disk"></span>'+$._('Save')+'</a>'+
							'</p><br></p>'+
						'</div>');
						
						tab.find('#'+id).editor({height:80, width:700,emoticon:false,sound:false});
						
						tab.find('#boton-guardar'+id+', ul#icons li').hover(
								function() { $(this).addClass('ui-state-hover'); }, 
								function() { $(this).removeClass('ui-state-hover'); }
						);
						
						
						tab.find('#boton-guardar'+id).click(
								function() { 
										$('#'+id).editor({send: "core/profile/updateInterest/id/"+id, callback: function(data){
											data = eval("("+data+")");
											if(data.error){
												jAlert(data.message,"Error")
											}
											else
												$.wixet.userNotice($._('Information about %<br>saved',new Array(name)));
											},clean: false});
									}
						);
						
					});
					//Special Tab to add new elements
					tabList.append('<li><a href="#tab-new">'+$._('New')+'</a></li>');
					tab.append('<div id="tab-new">'+
						'<p align="center"><div>'+$._('Interest name')+': <input type="text" class="ui-widget-content ui-corner-all"></div>'+
						'<br><div id="new"></div><br>'+
						'<p align="center"><a id="boton-guardarnew" class="dialog_link ui-state-default ui-corner-all" href="javascript:void(0)"><span class="ui-icon ui-icon-disk"></span>'+$._('Save')+'</a>'+
						'</p><br></p>'+
					'</div>');
					tab.find('#new').editor({height:80, width:700});
					tab.find('#boton-guardarnew, ul#icons li').hover(
							function() { $(this).addClass('ui-state-hover'); }, 
							function() { $(this).removeClass('ui-state-hover'); }
					);
					
					
					tab.find('#boton-guardarnew').click(
							function() { 
								var name = tab.find("input").val();
								$('#new').editor({send: "core/profile/newInterest/title/"+name, callback: function(data){
										data = eval("("+data+")");
										if(data.error){
											jAlert(data.message,"Error")
										}
										else{
											tab.tabs('add', '#tab-'+data.id, name,tab.tabs( "length" )-1);
											$.wixet.userNotice($._('Information about %<br>saved',new Array(name)));
											tab.find("input").val("");
											tab.find("#new").find(".text").html("");
											
										}
										},clean: false});
								}
					);
					/////////////
					tab.tabs({
						tabTemplate: '<li><a href="#{href}">#{label}</a> <span class="ui-icon ui-icon-close">'+$._('Remove tab')+'</span></li>',
						add: function(event, ui) {
							var newTab = $(ui.panel);
							var url = $(ui.tab).attr("href").split("-");
							tabId = url[1];
							newTab.append('<p align="center"><div id="'+tabId+'">'+tab.find("#new").find(".text").html()+'</div><br>'+
									'<p align="center"><a id="boton-guardar'+tabId+'" class="dialog_link ui-state-default ui-corner-all" href="javascript:void(0)"><span class="ui-icon ui-icon-disk"></span>'+$._('Save')+'</a>'+
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
					////////////
					tab.find('.ui-icon-close').live('click', function() {
						var url = $(this).parent().find("a").attr("href").split("-");
						var id = url[1];
						var index = $('li',tab).index($(this).parent());
						jConfirm($._('Are you sure you want to remove the interest "%"?',new Array($(this).parent().find("a").text())),$._('Please confirm'),function(yes){
							if(yes){
								$.getJSON("core/profile/deleteInterest/id/"+id,function(data){
									if(data.error){
										jAlert(data.message,"Error")
									}
									else{
										$.wixet.userNotice($._('Interest removed'));
										tab.tabs('remove', index);
									}
								});
							}
						});
					});
					/////////
					
				});

			},
			loadPrivacy: function(actionVars){
				this.widget.find(".title").text($._('Privacy'));
				var body = this.widget.find(".portlet-content");
				body.html("");
				$.getJSON("core/user/getMyAclGroupList",function(data){
					var tableBody = "";
					$.each(data,function(i,group){
						tableBody += '<tr group_id="'+group.group_id+'">'+
						'<td>'+group.group_name+'</td>'+
						'<td></td>'+
						'<td>'+group.created_at+'</td>'+
						'</tr>';
					});
						var dataTable =$('<table  cellpadding="0" cellspacing="0" border="0" class="display" id="data-table">'+
								'<thead>'+
								'	<tr>'+
								'		<th>'+$._('Name')+'</th>'+
								'		<th>'+$._('Users')+'</th>'+
								'		<th>'+$._('Created')+'</th>'+
								'	</tr>'+
								'</thead>'+
								'<tbody>'+
								tableBody +
								'</tbody>'+
								'</table>');
								
								
								
				//////////////////CREADOR/////////////////////
								var oTable;
								var detailsLoaded= new Array();
								var detailsList= new Array();
								/* Formating function for row details */
								function fnFormatDetails ( id )
								{
									//var aData = oTable.fnGetData( nTr );
									
									var sOut = '<div id="details-'+id+'">';
									sOut += '<img src="/images/progress.gif" /></div>';
	
									return sOut;
								}
	
								/*
								 * Insert a 'details' column to the table
								 */
								/*var nCloneTh = document.createElement( 'th' );
								var nCloneTd = document.createElement( 'td' );
								nCloneTd.innerHTML = '<img src="/images/dataTable/details_open.png">';
								nCloneTd.className = "center";
				*/
	
								dataTable.find('thead').find('tr').each( function () {
									$(this).prepend($("<th>"));
									//this.insertBefore( nCloneTh, this.childNodes[0] );
								} );
	
								dataTable.find('tbody').find('tr').each( function () {
									$(this).prepend($('<td><img class="dtIcon" src="/images/dataTable/details_open.png"></td>').addClass("center"));
									//this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
								} );
	
								/*
								 * Initialse DataTables, with no sorting on the 'details' column
								 */
								oTable = dataTable.dataTable( {
									"aoColumns": [
										{ "bSortable": false },
										null, null, null
									],
									"aaSorting": [[1, 'asc']],
									"bJQueryUI": true,
									"sPaginationType": "full_numbers",
									"oLanguage": {
										"sUrl": "/js/locals/dataTable-"+$._.getLocale()+".js"}
								});
	
								/* Add event listener for opening and closing details
								 * Note that the indicator for showing which row is open is not controlled by DataTables,
								 * rather it is done here
								 */

								//dataTable.find('td','img', oTable.fnGetNodes() ).each( function () {
								dataTable.find('.dtIcon').each( function () {
									$(this).click( function () {
										var nTr = this.parentNode.parentNode;
										var id = $(this).parent().parent().attr("group_id");
										if ( this.src.match('details_close') )
										{
											// This row is already open - close it 
											this.src = "/images/dataTable/details_open.png";
											oTable.fnClose( nTr );
										}
										else
										{
											// Open this row
											this.src = "/images/dataTable/details_close.png";
											oTable.fnOpen( nTr, fnFormatDetails(id), 'ui-widget ui-widget-content ui-corner-all' );
											var aData = oTable.fnGetData( nTr );
											if(detailsLoaded.indexOf(id) == -1)
											{
												$.getJSON("core/user/getAclGroup/id/"+id,function(data)
												{
												detailsLoaded.push(id);
												var container = $("#details-"+id);
												var content = $("<div>");
													//Aqui el tema
												var userList = $("<select multiple>");
												if(data.users != null){
													$.each(data.users,function(i,user){
														userList.append("<option value='"+user.id+"' selected>"+user.firstName+" "+user.lastName+" "+user.secondLastName+"</option>");
													});
												}
												
												var newUsers = new Array();
												$.each($.wixet.friendList,function(i,friend){
													if(userList.find("option:contains("+friend.value+")").length == 0)
													{
														newUsers.push({id:friend.id, name:friend.value});
													}
												});
												
												$.each(newUsers,function(i,friend){
													userList.append("<option value='"+friend.id+"'>"+friend.name+"</option>");
												});
												
												
												
												var userListCont = $("<div align='center' class='widget portlet ui-widget ui-widget-content ui-corner-all'><h3>"+$._('User list of the group')+"</h3></div>");
												userListCont.append(userList);
												content.append(userListCont);
												userList.multiselect();
													
												
												//photos
												var photos = $('<table class="tablesorter photoPermission">');
													photos.append("<thead><tr><th>"+$._('Photo')+"</th><th>"+$._('Title')+"</th><th>"+$._('Read granted')+"</th><th>"+$._('Read denied')+"</th><th>"+$._('Write granted')+"</th><th>"+$._('Write denied')+"</th></tr></thead>");
												var photosBody = $("<tbody>");
												if(data.photos != null){
													$.each(data.photos,function(i,photo){
														
														photosBody.append("<tr photoid='"+photo.id+"'><td><a href='#photo/loadPhoto/id/"+photo.id+"'><img class='ui-state-default ui-corner-all' src='/core.php/photo/thumbnail/id/"+photo.id+"/type/mini' /></a></td> <td>"+photo.title+"</td> <td><input class='read_granted' type='checkbox'></td> <td><input class='read_denied' type='checkbox'></td><td><input class='write_granted' type='checkbox'></td><td><input class='write_denied' type='checkbox'></td></tr>");
														
														$.each(photo.permissions,function(permission,value){
																photosBody.find("."+permission).attr("checked",value)
														});
													});
												}
												photos.append(photosBody);
												photos.tablesorter();
												
												var photosCont = $("<div align='center' class='widget portlet ui-widget ui-widget-content ui-corner-all'><h3>"+$._('Photo permissions')+"</h3></div>");
												photosCont.append(photos);
												content.append(photosCont);
												
												//
												//Albumes
												var albums = $('<table class="tablesorter albumPermission">');
												albums.append("<thead><tr><th>"+$._('Album')+"</th><th>"+$._('Read granted')+"</th><th>"+$._('Read denied')+"</th><th>"+$._('Write granted')+"</th><th>"+$._('Write denied')+"</th></tr></thead>");
												var albumsBody = $("<tbody>");
												if(data.albums != null){
													$.each(data.albums,function(i,album){
														
														albumsBody.append("<tr albumid='"+album.id+"'><td>"+album.title+"</td> <td><input class='read_granted' type='checkbox'></td> <td><input class='read_denied' type='checkbox'></td><td><input class='write_granted' type='checkbox'></td><td><input class='write_denied' type='checkbox'></td></tr>");
														
														$.each(album.permissions,function(permission,value){
															albumsBody.find("."+permission).attr("checked",value)
														});
													});
												}
												albums.append(albumsBody);
												albums.tablesorter();
												
												var albumsCont = $("<div align='center' class='widget portlet ui-widget ui-widget-content ui-corner-all'><h3>"+$._('Album permissions')+"</h3></div>");
												albumsCont.append(albums);
												content.append(albumsCont);
												//
												//Perfiles
												var profiles = $('<table class="tablesorter profilePermission">');
												profiles.append("<thead><tr><th>"+$._('Profile')+"</th><th>"+$._('Read granted')+"</th><th>"+$._('Read denied')+"</th><th>"+$._('Write granted')+"</th><th>"+$._('Write denied')+"</th></tr></thead>");
												var profilesBody = $("<tbody>");
												if(data.profiles != null){
													$.each(data.profiles,function(i,profile){
														
														profilesBody.append("<tr profileid='"+profile.id+"'><td>"+profile.title+"</td> <td><input class='read_granted' type='checkbox'></td> <td><input class='read_denied' type='checkbox'></td><td><input class='write_granted' type='checkbox'></td><td><input class='write_denied' type='checkbox'></td></tr>");
														
														$.each(profile.permissions,function(permission,value){
															profilesBody.find("."+permission).attr("checked",value)
														});
													});
												}
												profiles.append(profilesBody);
												profiles.tablesorter();
												
												var profilesCont = $("<div align='center' class='widget portlet ui-widget ui-widget-content ui-corner-all'><h3>"+$._('Profile permissions')+"</h3></div>");
												profilesCont.append(profiles);
												content.append(profilesCont);
												//
												var butGuardar =$("<button>"+$._('Save changes')+"</button>");
												butGuardar.button().click(function(){
													var selected = new Array();
													$.each(userList.find("option:selected"),function(i,user){
														selected.push(parseInt($(user).val()));
													});
													
													//Profile Permission
													profiles = new Array();
													$.each($(".profilePermission tbody tr"),function(i,element){
														row = $(element);
														profiles.push({id:row.attr("profileid"),
															readGranted:row.find(".read_granted").is(":checked"),
															readDenied:row.find(".read_denied").is(":checked"),
															writeGranted:row.find(".write_granted").is(":checked"),
															writeDenied:row.find(".write_denied").is(":checked")});
														
													});
													//
													//Album Permission
													albums = new Array();
													$.each($(".albumPermission tbody tr"),function(i,element){
														row = $(element);
														albums.push({id:row.attr("albumid"),
															readGranted:row.find(".read_granted").is(":checked"),
															readDenied:row.find(".read_denied").is(":checked"),
															writeGranted:row.find(".write_granted").is(":checked"),
															writeDenied:row.find(".write_denied").is(":checked")});
														
													});
													//
													//Photo Permission
													photos = new Array();
													$.each($(".photoPermission tbody tr"),function(i,element){
														row = $(element);
														photos.push({id:row.attr("photoid"),
															readGranted:row.find(".read_granted").is(":checked"),
															readDenied:row.find(".read_denied").is(":checked"),
															writeGranted:row.find(".write_granted").is(":checked"),
															writeDenied:row.find(".write_denied").is(":checked")});
														
													});
													//

													$.post("core/user/updateGroup/id/"+id,{users:$.toJSON(selected),permissions:$.toJSON({profiles:profiles,photos:photos,albums:albums})},function(data){
														data = eval("("+data+")");
														if(data.error)
															jAlert(data.message,"Error");
														else
															$.wixet.userNotice($._('Changes saved succesufully'));
														
													});
												});
												content.append(butGuardar);
													//
													detailsList.push(content);
													container.html(content);
													
												});
											}else{
												$("#details-"+id).html(detailsList[detailsLoaded.indexOf(id)]);
											}
											
										}
									} );
								} );
								
				//////////////////////////////////
								body.append(dataTable);
				});
				var butNewGroup = $("<button>"+$._('New group')+"</button>");
				body.append(butNewGroup);
				body.append("<br/><br/>");
				butNewGroup.button().click(function(){
					var dialog = $('<div title="'+$._('Create new group')+'">'+
									'<div>'+$._("Group name")+': <input type="text" class="text ui-widget-content ui-corner-all ui-autocomplete-input"><br/><br/></div>'+
									"<div align='center' class='widget portlet ui-widget ui-widget-content ui-corner-all'><h3>"+$._('Users group')+"</h3><select multiple></select><br/></div>"+
									"</div>");
					var select = dialog.find("select");
					$.each($.wixet.friendList,function(i,friend){
						select.append("<option value='"+friend.id+"'>"+friend.value+"</option>");
					});
					select.multiselect();
					var buttonsOpts = {};
					buttonsOpts[$._('Cancel')] = function (){
						$(this).dialog('close');
					};
					buttonsOpts[$._('Create')] = function (){
						var selected = new Array();
						$.each(select.find("option:selected"),function(i,user){
							selected.push(parseInt($(user).val()));
						});
						
						if(dialog.find(".text").val().length > 0){
							$.post("core/user/newAclGroup/name/"+dialog.find(".text").val(),{users:$.toJSON(selected)},function(data){
								data = eval("("+data+")");
								if(data.error)
									jAlert(data.message,"Error");
								else{
									window.location.href = "#account/privacy/refresh/"+Math.floor(Math.random()*10000);
									$.wixet.userNotice($._('Group created succesfully'));
									dialog.dialog('close');
								}
							});
						}else{
							dialog.find(".text").addClass("ui-state-error");
							jAlert($._('Please write a group name'),"Error",function(){ dialog.find(".text").focus()});
						}
						
					};

					dialog.dialog({
						height:370,
						width: 550,
						modal: true,
						buttons: buttonsOpts
					});

					
				});
				
			},
			
			loadPreferences: function(actionVars){
				//Load preferences
				var widget = this.widget;
				var font,theme,language,textColor,fontId;
				$.getJSON("core/user",function(data){
					font = data.font.name;
					fontId = data.font.font_id;
					theme = data.theme.theme_id;
					language = data.language.language_language_code;
					textColor = data.text_color;
					//After load, build the page
					//
					widget.find(".title").text($._('Customizacion'));
					var body = widget.find(".portlet-content");
					body.html("");
					/////
					body.append('<div class="ui-widget ui-widget-content ui-corner-all">'+
					'<h3>'+$._('Appearance')+'</h3>'+
					'<span class="sub">'+
					'	<div class="sub themeswitcher"></div></span>'+
					'<br><br>'+
					'</div><br><br>');
					body.find(".themeswitcher").themeswitcher();
					
					
					body.append('<div class="ui-widget ui-widget-content ui-corner-all">'+
							'<h3>'+$._('Language')+'</h3>'+
							'<div class="sub language">'+
							'</div>'+
							'<br>'+
							'</div><br><br>');
					//Languages
					var languageList = $("<select>");
					$.getJSON("core/wixet/languageList",function(data){
						$.each(data.languageList,function(i,language){
							languageList.append("<option value='"+language.language_code+"'>"+language.name+"</option>");
						});
						body.find(".language").append(languageList);
						languageList.find("[value="+language+"]").attr("selected",true);
						//languageList.combo();
						languageList.selectmenu({style:'dropdown',maxHeight:200});
					});
					/////
					
					var textExample = $._('Example text');
					body.append('<div class="ui-widget ui-widget-content ui-corner-all">'+
							'<h3>'+$._('My font')+'</h3>'+
							'<span class="sub">'+
							'	<div class="sub" id="preview">'+textExample+' '+textExample+' '+textExample+' '+textExample+' '+textExample+'</div>'+
							'	<div class="sub">'+$._('Color')+': <input readonly class="text ui-widget-content ui-corner-all color" type="text" /></div>'+
							'	<div class="sub font">Fuente: </div>'+
							'	</span>'+
							'<br><br>'+
							'</div><br><br>');
					//FontList
					var fontList = $("<select>");
					$.getJSON("core/wixet/fontList",function(data){
						$.each(data.fontList,function(i,font){
							fontList.append("<option value='"+font.font_id+"'>"+font.name+"</option>");
						});
						body.find(".font").append(fontList);
						fontList.find("[value="+fontId+"]").attr("selected",true);
						
						fontList.selectmenu({style:'dropdown',maxHeight:200,
								change:function(event,ui){
									body.find('#preview').css('font-family',ui.option.text);
								}
						});
					});
					/////
					body.find(".color").attachColorPicker().change(function() {body.find("#preview").css("color",body.find(".color").val())});
					if(textColor != null)
					{
						body.find(".color").val("#"+textColor).change();
						body.find(".ColorPickerDivSample").css("background-color","#"+textColor);
					}
					if(font != null){
						body.find('#preview').css('font-family',font);
					}
					
					//
					//Save
					var saveButton = $("<button>"+$._('Save')+"</button>");
					var saveButtonContainer = $("<div align='center'>").append(saveButton);
					saveButton.button().click(
							function() {
								
								$.post("core/user/update",{ theme: "-", language: languageList.val(), font: fontList.val() ,textcolor: body.find(".color").val().substr(1)},
								function(data){
									data = eval("("+data+")");
									if(data.error == false)
									{
										if(languageList.val() != $.cookie("language")){
											$._.setLocale(languageList.val());
											$.cookie("language",languageList.val());
											$.get("js/locals/config."+$._.getLocale()+".json",function(data){
												eval(data);
												$.get("js/locals/widget/accountBody/"+$._.getLocale()+".json",function(data){
													eval(data);
													$.wixet.userNotice($._('Preferences save succesfully'));
												});
											});
										}else
											$.wixet.userNotice($._('Preferences save succesfully'));
									}
									else
									{
										jAlert(data.message,"Error");
									}
								});

								}
						);
					body.append(saveButtonContainer,"<br/>");
					
					//
					
				});

				
			}
			
			
	}
	
})(jQuery);