var widget = $("#options");

widget.find("#tabs-search").tabs({show: function(event, ui) {
        var panel = $(ui.panel);
        if(panel.attr("id") == "tabs-places" && panel.find(".placecity-button").length == 0){
                $(ui.panel).find("#placecity").selectmenu({style:'dropdown',maxHeight:200});
                $(ui.panel).find("#placetype").selectmenu({style:'dropdown',maxHeight:200});
        }
}}).find(".ui-widget-content").css({padding:"2px"});

widget.find("#personName").hint();
widget.find("#placeName").hint();
widget.find("#searchin").buttonset();
//widget.find("#city").selectmenu({style:'dropdown',maxHeight:200});
//widget.find("#agemin").selectmenu({style:'dropdown',maxHeight:200});
//widget.find("#agemax").selectmenu({style:'dropdown',maxHeight:200});
widget.find("#but-people").button().click(function(){
    paginatePeople(1);
});

//City
    
    $("#city").autocomplete({
            source: "/autocomplete?type=city",
            minLength: 2,
            select: function(event, ui) {      
                    //Add if not added already
                   /* if($("#"+type+"List").find("li["+type+"l='"+ui.item.id+"']").length == 0){
                            
                            var element = $('<li '+type+'="'+ui.item.id+'"><span style="float:left" class="ui-icon ui-icon-close"></span><div>'+ui.item.value+'</div></li>');
                            element.find("span").click(function(){
                                    element.remove();
                                    postData[type].splice(postData[type].indexOf(parseInt($(element).attr(type))),1);
                            });
                            $("#"+type+"List").append(element);
                            postData[type].push(parseInt($(element).attr(type)));
                    }
                    setTimeout(function(){ $("."+type).val(""); },100);*/

            }
    }).hint();

/////
var tipos = ["school","workplace","place"];//TODO Hacer esto mas elegante, una fuente de datos a ser posible

var postData = new Object();//Datos que se postearan

//Por cada tipo, hacemos el autocomplete y todo eso
$.each(tipos, function(i,type){
    
    postData[type] = new Array();
    /*for(element in widget.find("#"+type+"List").find("li")){
        postData[type].push(parseInt($(element).attr(type)));   
    }*/
    
    $("."+type).autocomplete({
            source: "/autocomplete?type="+type,
            minLength: 2,
            select: function(event, ui) {      
                    //Add if not added already
                    if($("#"+type+"List").find("li["+type+"l='"+ui.item.id+"']").length == 0){
                            
                            var element = $('<li '+type+'="'+ui.item.id+'"><span style="float:left" class="ui-icon ui-icon-close"></span><div>'+ui.item.value+'</div></li>');
                            element.find("span").click(function(){
                                    element.remove();
                                    postData[type].splice(postData[type].indexOf(parseInt($(element).attr(type))),1);
                            });
                            $("#"+type+"List").append(element);
                            postData[type].push(parseInt($(element).attr(type)));
                    }
                    setTimeout(function(){$("."+type).val("");},100);

            }
    }).hint();
});




function paginatePeople(page){
	//$("#loadingAlbum").show();
	$("#searchBody").hide();
        postData['searchin'] = $('input:radio[name=searchin]:checked').val();
        postData['name'] = $("#personName").val();
	var req = opensocial.newDataRequest();
	var params = {};
	params[opensocial.DataRequest.MediaItemRequestFields.FIRST] = (page-1)*10;
	params[opensocial.DataRequest.MediaItemRequestFields.MAX] = 10;
        params["QUERY"] = postData;
	req.add(req.newFetchPeopleQuery('OWNER',params), 'people');
	req.send(function(data){
		var people = data.get('people').getData();
		var list = $("#personList");
		list.html("");
		people.each(function(person){
                    var element = $('<li style="clear:left;"><hr class="ui-state-default"></hr>'+
                                                                        '<img class="ui-state-default ui-corner-all" style="float:left;" src="'+person.getField(opensocial.Person.Field.THUMBNAIL_URL)+'" />'+
                                                                        '<ul class="normal-list" style="float:left;">'+
                                                                        '<li style="margin-top:0"><a class="ui-state-default ui-corner-all" href="#profile/load/id/" style="text-decoration:none;">'+person.getField(opensocial.Person.Field.NAME)+'</a></li>'+
                                                                        '</ul>'+
                                                                        "</li>")
                    list.append(element);
                     
			});
                        list.find("hr").eq(0).css("visibility","hidden");
		//$("#loadingAlbum").hide();
		$("#searchBody").show();
		$(".paginator").pager({pagenumber: page, pagecount: Math.ceil((people.getTotalSize()/10)), buttonClickCallback: paginatePeople});

	});
	
}


