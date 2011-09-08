$("#accordion").accordion({
                        autoHeight: false,
                        navigation: true,
                        collapsible: true,
                        active: false, changestart: function(event, ui) {
                                if(ui.newContent.find(".loading").length){
                                    var section = ui.newContent.find(".content").attr("id");
                                    $.get("settings/"+section,function(data){
                                        ui.newContent.find(".loading").remove();
                                        ui.newContent.find(".content").html(data);
                                    });
                                }

                        }
});