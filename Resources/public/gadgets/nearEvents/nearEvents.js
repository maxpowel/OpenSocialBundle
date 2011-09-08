$(document).ready(function(data){
    
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
                
                gadgets.window.adjustHeight();
                
});
                
});