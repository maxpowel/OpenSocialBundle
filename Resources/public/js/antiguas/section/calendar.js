//TODO: poner ckeditor y api de gmpas

$(document).ready(function(){
    				
		 		
                var calendar = $('#calendar');
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

		
		
		    $('#calendar').fullCalendar({
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
                       selectable: true,
                       //dayClick: dayClick, NOT USED
                       select: select,
                       events: eventsSource,
                       eventResize: eventResize,
                       eventDrop: eventDrop
                       
    });
    

//Menu de la izquierda

var date = new Date();
//Today
var todayStartFomatted = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
var todayEndFomatted = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()+1);
//Tomorrow
var tomorrowStartFomatted = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()+1);
var tomorrowEndFomatted = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()+2);
//
var nextDaysStartFomatted = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()+2);
var nextDaysEndFomatted = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()+10);


var req=opensocial.newDataRequest();
req.add(req.newFetchCalendarEventRequest(todayStartFomatted,todayEndFomatted), "today");
req.add(req.newFetchCalendarEventRequest(tomorrowStartFomatted,tomorrowEndFomatted), "tomorrow");
req.add(req.newFetchCalendarEventRequest(nextDaysStartFomatted,nextDaysEndFomatted), "next");

req.send(function(data){
    
    function doList(container,data){
        if(data.getSize() == 0)
            container.append("<li>Nada</li>");
        else
            data.each(function(event) {
                time = "";
                if(!event.getField("allDay")){
                    hour = event.getField("start").getHours();
                    minute = event.getField("start").getMinutes();
                    time = (hour<10?0+""+hour:hour)+":"+(minute<10?0+""+minute:minute);
                }

                title = event.getField("title");

                eventElement = $('<li><span style=" -moz-user-select: none;" class="fc-event fc-event-skin fc-event-hori fc-event-draggable fc-corner-left fc-corner-right ui-draggable" unselectable="on"><span class="fc-event-inner fc-event-skin"><span class="fc-event-title">'+title+'</span></span></span> <span>'+time+'</span></li>');
                container.append(eventElement);
            });
    }
                //Today
                doList($("#today"),data.get("today").getData());
                //Tomorrow
                doList($("#tomorrow"),data.get("tomorrow").getData());
                //Next days
                doList($("#next"),data.get("next").getData());
                
                
});
    
$("#new-Task").button().click(function(){
		createTaskForm(new Date(),new Date(),true);
	});

/////////////////////

	//Functions
	function update(event){
		var req = opensocial.newDataRequest();
		
		var startFomatted = event.start.getFullYear()+"-"+(event.start.getMonth()+1)+"-"+event.start.getDate()+" "+event.start.getHours()+":"+event.start.getMinutes()+":"+event.start.getSeconds();
		var endFormatted = null;
		if(event.end != null)
			endFormatted = event.end.getFullYear()+"-"+(event.end.getMonth()+1)+"-"+event.end.getDate()+" "+event.end.getHours()+":"+event.end.getMinutes()+":"+event.end.getSeconds();
											
		req.add(req.newUpdateCalendarEventRequest(event.id,event.title,event.allDay,startFomatted,endFormatted), "event");
		req.send();
		//TODO: revertFunc(); si hubo error
	}
	
	function eventDrop( event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view ){
		update(event);
	}
	
	function eventResize( event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
		update(event);
	}
	//DayClick: when user clicks a day
	//NO USED: select captures this event
	/*function dayClick(date, allDay, jsEvent, view){
		console.log("hola");
		createTaskForm(date, null, allDay);										
	}*/
	
	//select: user select more than one date
	function select(start, end, allDay, jsEvent, view){
		//console.log("Desde "+start+" hasta "+end+" todo dia "+allDay);
		createTaskForm(start, end, allDay);
	}
	//Events source: where to load the events
	function eventsSource( start, end, callback ){
				var startFomatted = start.getFullYear()+"-"+(start.getMonth()+1)+"-"+start.getDate();
				var endFormatted = end.getFullYear()+"-"+(end.getMonth()+1)+"-"+end.getDate();
                
			var req=opensocial.newDataRequest();
    		req.add(req.newFetchCalendarEventRequest(startFomatted,endFormatted), "events");
    		req.send(function(data){
				//Render the events
				var events = [];
				var eventList = data.get("events").getData();
				eventList.each(function(event) {
                    events.push({
						id: 		event.getId(),
                        title: 		event.getField(opensocial.Calendar.Field.TITLE),
                        start: 		event.getField(opensocial.Calendar.Field.START),
                        end: 		event.getField(opensocial.Calendar.Field.END),
                        allDay: 	event.getField(opensocial.Calendar.Field.ALL_DAY),
                        url:	 	event.getField(opensocial.Calendar.Field.URL),
                        className: 	event.getField(opensocial.Calendar.Field.CLASS_NAME),
                        editable: 	event.getField(opensocial.Calendar.Field.EDITABLE)
                        
                    });
                	//Callback funtion will render the events
				});
				callback(events);
			});
		
	}

        //Forumulario para crear eventos
        function createTaskForm(start, end, allDay){
        var eventTable;

		var dialog = $('<div id="dialog-form" title="Nueva entrada de calendario">'+
		'<div id="tabs">'+
		'	<ul>'+
		'		<li><a href="#tabs-1">Tarea personal</a></li>'+
		'		<li><a href="#tabs-2">Evento p&uacute;blico</a></li>'+
		'	</ul>'+
		'	<div id="tabs-1">'+
		//Task table
		'<h3>Detalles de la tarea</h3><table style="margin-left:20px">'+
							 '<tr>'+
							'	 <td>Descripcion</td><td><input id="title" type="text" class="ui-widget-content ui-corner-all"></td>'+
							'</tr><tr>'+
							'	 <td valign="top">Todo el d&iacute;a</td><td>'+
							'							<div><input id="showDetails" type="checkbox" checked></div>'+
							'							<div id="taskDetails" style="visibility:hidden">'+
							'								<table>'+
							'									<tr>'+
							'										<td>Empieza el <input class="ui-widget-content ui-corner-all" type="text" id="taskStart" size="10"> a las <input type="text" value="08:00" size="10" id="startTime" class="ui-widget-content ui-corner-all" autocomplete="OFF"></td>'+
							'									</tr>'+
							'									<tr>'+
							'										<td>Termina el <input class="ui-widget-content ui-corner-all" type="text" id="taskEnd" size="10"> a las <input type="text" value="08:30" size="10" id="endTime" class="ui-widget-content ui-corner-all" autocomplete="OFF"></td>'+
							'									</tr>'+
							'								</table>'+
							'							</div>'+
							'						</td>'+
						'	 </tr>'+
						 '</table>'+
			/////////
		'	</div>'+
		'	<div id="tabs-2">'+
		//////////////////////
		//Event table
		'<h3>Detalles del evento</h3><table style="margin-left:20px">'+
		'	<tr>'+
		'		<td>T&iacute;tulo</td>'+
		'		<td><input type="text" class="ui-widget-content ui-corner-all"></td>'+
		'	</tr>'+
		'		<td valign="top">Descripci&oacute;n</td>'+
		'		<td><textarea class="ui-widget-content ui-corner-all" rows="20" cols="30"></textarea></td>'+
		'	</tr>'+
		'	</tr>'+
		'		<td>Fecha</td>'+
		'		<td><input class="ui-widget-content ui-corner-all" type="text" id="eventDate" size="10"> a las <input type="text" value="08:00" size="10" id="eventTime" class="ui-widget-content ui-corner-all" autocomplete="OFF">'+
		'	</tr>'+
		'	</tr>'+
		'		<td>Lugar</td>'+
		'		<td><input type="text" class="ui-widget-content ui-corner-all"></td>'+
		'	</tr>'+
		'</table>'+
		'<h3>Otros datos de inter&eacute;s</h3>'+
		'<div><button id="addOtherData">A&ntilde;adir</button></div>'+
		'<table id="otherData" style="margin-left:20px">'+

		'</table>'+


		/////////////////////
		'	</div>'+
		'</div>'+
		'</div>');


                var taskType = 0;//0  normal task, 1 public event
		dialog.dialog({modal:true,
                            width:500,
                            open: function(){
                                    var dialog = $(this);
                                    //Tarea normal
                                    dialog.find("#tabs").tabs({select: function(event, ui) { taskType = ui.index}});
                                    dialog.find("#showDetails").click(function(){
                                            if($(this).is(":checked"))
                                                    dialog.find("#taskDetails").css("visibility","hidden");
                                            else
                                                    dialog.find("#taskDetails").css("visibility","visible");
                                    });
                                    //
                                    //init datepickers
                                    $.datepicker.setDefaults( $.datepicker.regional[ "es" ] );

                                    dialog.find( "#taskStart" ).datepicker({dateFormat:"dd/mm/yy",
                                                                            onSelect: function(dateText, inst){
                                                                                    dialog.find( "#taskEnd" ).datepicker( "option", "minDate", dateText );
                                                                            }
                                                                    });


                                    dialog.find( "#taskEnd" ).datepicker({dateFormat:"dd/mm/yy"});

                                    dialog.find( "#eventDate" ).datepicker({dateFormat:"dd/mm/yy"});
                                    //
                                    dialog.find( "#taskStart" ).datepicker('setDate', start);
                                    dialog.find( "#taskEnd" ).datepicker( "option", "minDate", start );
                                    dialog.find( "#eventDate" ).datepicker('setDate', start);

                                    if(!allDay){
                                        dialog.find("#showDetails").click();
                                        dialog.find("#taskDetails").css("visibility","visible");
                                        dialog.find( "#taskEnd" ).datepicker('setDate', end);
                                        dialog.find( "#eventDate" ).datepicker('setDate', start);

                                        var hoursStart = start.getHours();
                                        var minutesStart = start.getMinutes();
                                        //Put a '0' before hour/minute if only one number
                                        if(hoursStart < 10)
                                               hoursStart = "0"+hoursStart;

                                        if(minutesStart < 10)
                                               minutesStart = "0"+minutesStart;

                                        dialog.find("#startTime").val(hoursStart+":"+minutesStart);
                                        dialog.find("#eventTime").val(hoursStart+":"+minutesStart);

                                        var hoursEnd = end.getHours();
                                        var minutesEnd = end.getMinutes();
                                        //Put a '0' before hour/minute if only one number
                                        if(hoursEnd < 10)
                                               hoursEnd = "0"+hoursEnd;

                                        if(minutesEnd < 10)
                                               minutesEnd = "0"+minutesEnd;

                                        dialog.find("#endTime").val(hoursEnd+":"+minutesEnd);
                                    }

                                    ////
                                            

                                            dialog.find("#startTime, #endTime, #eventTime").timePicker();

                                            //Mantener diferencia entre las dos horas
                                            var oldTime = $.timePicker("#startTime").getTime();

                                            dialog.find("#startTime").change(function() {
                                              if ($("#endTime").val()) { // Only update when second input has a value.
                                                    // Calculate duration.
                                                    var duration = ($.timePicker("#endTime").getTime() - oldTime);
                                                    var time = $.timePicker("#startTime").getTime();
                                                    // Calculate and update the time in the second input.
                                                    $.timePicker("#endTime").setTime(new Date(new Date(time.getTime() + duration)));
                                                    oldTime = time;
                                              }
                                            });

                                            //Validar horas
                                            dialog.find("#endTime").change(function() {
                                                    if($.timePicker("#startTime").getTime() > $.timePicker(this).getTime()) {
                                                            $(this).addClass("ui-state-error");
                                                    }
                                                    else {
                                                            $(this).removeClass("ui-state-error");
                                                    }
                                            });

                                            //Evento
                                            dialog.find("#addOtherData").button().click(function(){
                                                    var nombre = jPrompt("¿Que tipo de dato quieres introducir? (tel&eacute;fono, p&aacute;gina web...)","","Insertar campo",function(name){
                                                        if(name){
                                                            var row = 			$('	<tr>'+
                                                                                            '		<td>'+name+'</td>'+
                                                                                            '		<td><input type="text" class="ui-widget-content ui-corner-all"></td>'+
                                                                                            '		<td><a style="position:absolute; margin-top: -9px;" href="#" id="remove" class="ui-corner-all" role="button"><span class="ui-icon ui-icon-closethick">close</span></a></td>'+
                                                                                            '	</tr>');

                                                            row.find("#remove").hover(function(){
                                                                    $(this).addClass("ui-state-hover");
                                                            },
                                                            function(){
                                                                    $(this).removeClass("ui-state-hover");
                                                            }).click(function(){
                                                                    $(this).parent().parent().remove();
                                                            });

                                                            dialog.find("#otherData").append(row);
                                                                }
                                                            });
                                            });






                            },
                            buttons:{
                                    "Crear": function(){
                                        if(taskType == 0){
                                            //Normal task
                                            var req = opensocial.newDataRequest();
                                            var title = $.trim(dialog.find("#title").val());
                                            var allDay = dialog.find("#showDetails").is(":checked");
                                            //TODO: hacer esto genérico, que no depende un formato de fecha concreto
                                            //Start date
                                            var startDate = dialog.find( "#taskStart" ).val().split("/");
                                            var startTime = dialog.find( "#startTime" ).val().split(":");
                                            var start = new Date(startDate[2],(startDate[1]-1),startDate[0],startTime[0],startTime[1],0);
                                            //End date
                                            var endDate = dialog.find( "#taskEnd" ).val().split("/");
                                            var endTime = dialog.find( "#endTime" ).val().split(":");

                                            var end = new Date(endDate[2],(endDate[1]-1),endDate[0],endTime[0],endTime[1],0);
                                            //Format time to string
                                            var startFomatted = start.getFullYear()+"-"+(start.getMonth()+1)+"-"+start.getDate()+" "+start.getHours()+":"+start.getMinutes()+":"+start.getSeconds();
                                            var endFormatted = null;

                                            
                                            if(!allDay)
                                                    endFormatted = end.getFullYear()+"-"+(end.getMonth()+1)+"-"+end.getDate()+" "+end.getHours()+":"+end.getMinutes()+":"+end.getSeconds();

                                            if(title.length > 0){
                                                    req.add(req.newCreateCalendarEventRequest(title,allDay,startFomatted,endFormatted), "event");
                                                    req.send(function(data){

                                                            var event = data.get("event").getData();

                                                            calendar.fullCalendar('renderEvent',
                                                                    {
                                                                            id: 		event.getId(),
                                                                            title: 		event.getField(opensocial.Calendar.Field.TITLE),
                                                                            start: 		event.getField(opensocial.Calendar.Field.START),
                                                                            end: 		event.getField(opensocial.Calendar.Field.END),
                                                                            allDay: 	event.getField(opensocial.Calendar.Field.ALL_DAY),
                                                                            url:	 	event.getField(opensocial.Calendar.Field.URL),
                                                                            className: 	event.getField(opensocial.Calendar.Field.CLASS_NAME),
                                                                            editable: 	event.getField(opensocial.Calendar.Field.EDITABLE)
                                                                    },
                                                                    true // make the event "stick"
                                                            );
                                                    });
                                            }
                                        }
                                        //TODO hacer lo mismo para los eventos
                                       
                                        $(this).dialog('close');
                                    },
                                    "Cancelar":function(){$(this).dialog('close');}
                                    }
                            });
            }

});

