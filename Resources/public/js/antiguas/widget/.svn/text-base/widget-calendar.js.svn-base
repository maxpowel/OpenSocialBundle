(function($) {
	//TODO hacer que las fechas (buscar por %/%/% se muestren formateadas)
	$.widget.calendar = {
			widget: null,
			init: function(widget) {
				this.widget=$(widget);
				this.widget.find(".portlet-header").remove();
				
						var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();
		var calendar = this.widget.find('#calendar');
		//Month formats
		var format = $.i18n.get('shortDate')
		var monthDayFormat = "";
		if(format.indexOf("d")<format.indexOf("m")){
			//Day first
			monthDayFormat = "d/M";
		}else{
			monthDayFormat = "M/d";
		}
		//
		calendar.fullCalendar({
			monthNames: $.i18n.get('month'),
			monthNamesShort: $.i18n.get('month'),
			dayNames: $.i18n.get('day'),
			dayNamesShort: $.i18n.get('day'),
			buttonText: {
				prev: '&nbsp;&#9668;&nbsp;',
				next: '&nbsp;&#9658;&nbsp;',
				prevYear: '&nbsp;&lt;&lt;&nbsp;',
				nextYear: '&nbsp;&gt;&gt;&nbsp;',
				today: $._("Today"),
				month: $._("Month"),
				week: $._("Week"),
				day: $._("Day")
			},
			columnFormat: {
				month: 'ddd',
				week: 'ddd '+monthDayFormat,
				day: 'dddd '+monthDayFormat
			},
			firstDay: $.i18n.get('firstDay'),
			allDayText: $._('all-day'),
			theme: true,
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			eventRender: function(calEvent, element) {
				//Event click: edit event information
				element.find("a").click(function(){
					if(calEvent.className == "fc-task"){
						jPrompt($._('New task description'),calEvent.title,$._('Change task information'),function(title){
							if(title){
								var oldTitle = calEvent.title;
								calEvent.title = title;
								calendar.fullCalendar( 'updateEvent', calEvent );
								$.getJSON("core/calendar/changeTaskTitle/id/"+calEvent.id+"/title/"+title,function(data){
									if(data.error){
										jAlert(data.message,"Error");
										calEvent.title = oldTitle;
										calendar.fullCalendar( 'updateEvent', calEvent );
									}
								});
							}
						});
					}
				});
				//Close click: to remove the event
				var close =$("<img title='Borrar' alt='Borrar' style='z-index:1000;cursor: pointer;opacity:0;float:right;position:absolute; margin-left: -10px' src='images/cruzTemporal2.png' />");
				close.click(function(){
					jConfirm($._('Are you sure you want to remove the task "%"?',new Array(calEvent.title)),$._('Please confirm'),function(yes){
						if(yes)
						{
							calendar.fullCalendar( 'removeEvents', calEvent.id);
							$.get("core/calendar/removeTask/id/"+calEvent.id);
						}
					})
				}).hover(function(){
					element.find(".ui-resizable-handle").hide();
					$(this).addClass("ui-state-default ui-corner-all").
					attr("src","images/cruzTemporal2negra.png");
				},function(){
					element.find(".ui-resizable-handle").show();
					$(this).removeClass("ui-state-default ui-corner-all").
					attr("src","images/cruzTemporal2.png");
				});
				
				element.hover(function(){
						close.css("opacity",1);
				},function(){
					close.css("opacity",0);
				});
				element.find("a").parent().append(close);

			},
			eventDrop: function( event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view ){
				start = event.start;
				end = event.end;
				if(end == null) end = start;
				$.post("core/calendar/updateTask",{id:event.id,start:start.getFullYear()+"/"+(start.getMonth()+1)+"/"+start.getDate()+" "+start.getHours()+":"+start.getMinutes()+":"+start.getSeconds(),end:end.getFullYear()+"/"+(end.getMonth()+1)+"/"+end.getDate()+" "+end.getHours()+":"+end.getMinutes()+":"+end.getSeconds(),allDay:allDay},function(data){
					//revertFunc();
				});

				
			},
			eventResize: function( event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ) {
				start = event.start;
				end = event.end;
				if(end == null) end = start;
				$.post("core/calendar/updateTask",{id:event.id,start:start.getFullYear()+"/"+(start.getMonth()+1)+"/"+start.getDate()+" "+start.getHours()+":"+start.getMinutes()+":"+start.getSeconds(),end:end.getFullYear()+"/"+(end.getMonth()+1)+"/"+end.getDate()+" "+end.getHours()+":"+end.getMinutes()+":"+end.getSeconds(),allDay:false},function(data){
					//revertFunc();
				});
			},
			//eventClick: created in renderEvent
			className: "normal",
			editable: true,
			selectable: true,
			selectHelper: true,
			
			select: function(start, end, allDay) {
				var description;
				if(start.getTime()==end.getTime()){
					//One day task
					description = $._("Task for the day %/%/%",new Array(start.getDate(),start.getMonth()+1,start.getFullYear()));
				}else{
					description = $._("From %/%/% to %/%/%",new Array(start.getDate(),start.getMonth()+1,start.getFullYear(),end.getDate(),end.getMonth()+1,end.getFullYear()));
				}
				jPrompt(description,$._("Task name"),$._("New task"),function(title){
						if (title) {
							$.post("core/calendar/newTask",{title:title, start:start.getFullYear()+"-"+(start.getMonth()+1)+"-"+start.getDate()+" "+start.getHours()+":"+start.getMinutes()+":"+start.getSeconds(), end:end.getFullYear()+"-"+(end.getMonth()+1)+"-"+end.getDate()+" "+end.getHours()+":"+end.getMinutes()+":"+end.getSeconds(), allDay:allDay},function(data){
								data = eval("("+data+")");
								if(data.error)
									jAlert(data.message,"Error");
								else{
									calendar.fullCalendar('renderEvent',
											{
												id: data.id,
												title: title,
												start: start,
												end: end,
												allDay: allDay,
												className: "fc-task"
											},
											true // make the event "stick"
										);
								}
							});
							
						}
						calendar.fullCalendar('unselect');
					});
				},
				events: function(start, end, callback) {

			        // do some asynchronous ajax
					var monthStart = start.getMonth()+1;
					var monthEnd = end.getMonth()+1;
			        $.getJSON("core/calendar/index/start/"+start.getFullYear()+"-"+monthStart+"-"+start.getDate()+"/end/"+end.getFullYear()+"-"+monthEnd+"-"+end.getDate(),
			                function(data) {

			                        // format the result into an array of CalEvents
			                        // (not seen here)

			                        // then, pass the CalEvent array to the callback
			                	calevents = new Array();
			                	$.each(data.tasks, function(i,task){
			                		//Start date
			                		var fecha = task.start.split(" ");
			                		var horaCompleta = fecha[1].split(":");
			                			fecha = fecha[0].split("-");
			                		var ano = fecha[0];
			                		var mes = fecha[1]-1;
			                		var dia = fecha[2];
			                		var hora = horaCompleta[0];
			                		var minuto = horaCompleta[1];
			                		var fechaInicio = new Date(ano, mes, dia, hora, minuto);
			                		//fin fecha inicio
			                		//fecha fin
			                		var fechaFin = null;
			                		if(task.end != null)
			                		{
			                			var fecha = task.end.split(" ");
				                		var horaCompleta = fecha[1].split(":");
				                			fecha = fecha[0].split("-");
				                		var ano = fecha[0];
				                		var mes = fecha[1]-1;
				                		var dia = fecha[2];
				                		var hora = horaCompleta[0];
				                		var minuto = horaCompleta[1];
				                		var fechaFin = new Date(ano, mes, dia, hora, minuto);
			                		}
			                		
			                		calevents.push({
			            				title: task.title,
			            				start:fechaInicio,
			                			id:task.task_id,
			                			allDay:task.allDay == 1,
			                			className: "fc-task"
			            			});
			                		
			                		//birthdays
			                		$.each(data.birthdays, function(i,task){
				                		//Start date
				                		var fecha = task.start.split(" ");
				                		var horaCompleta = fecha[1].split(":");
				                			fecha = fecha[0].split("-");
				                		var ano = fecha[0];
				                		var mes = fecha[1]-1;
				                		var dia = fecha[2];
				                		var hora = horaCompleta[0];
				                		var minuto = horaCompleta[1];
				                		var fechaInicio = new Date(ano, mes, dia, hora, minuto);
				                		//fin fecha inicio
				                		//fecha fin
				                		var fechaFin = null;
				                		if(task.end != null)
				                		{
				                			var fecha = task.end.split(" ");
					                		var horaCompleta = fecha[1].split(":");
					                			fecha = fecha[0].split("-");
					                		var ano = fecha[0];
					                		var mes = fecha[1]-1;
					                		var dia = fecha[2];
					                		var hora = horaCompleta[0];
					                		var minuto = horaCompleta[1];
					                		var fechaFin = new Date(ano, mes, dia, hora, minuto);
				                		}
				                		
				                		calevents.push({
				            				title: task.title,
				            				start:fechaInicio,
				                			id:task.task_id,
				                			url:task.url,
				                			allDay:true,
				                			editable: false,
				                			className: "fc-birthday"
				            			});
			                	});
			                		$.each(calevents,function(i,event){
			                			calendar.fullCalendar( 'renderEvent', event,true );
			                		});
			                	//callback(calevents);

			                });
				});
				}

		});

				
			}
	}
	
})(jQuery);